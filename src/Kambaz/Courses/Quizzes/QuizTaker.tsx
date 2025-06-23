import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Alert, Card, Container } from "react-bootstrap";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import * as client from "./client";
import type { Quiz, Question } from "./types";

interface QuizAnswers {
    [questionId: string]: string | number | boolean | number[] | string[];
}

export default function QuizTaker({ viewContext }: { viewContext?: any }) {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const reduxCurrentUser = useSelector((state: any) => state.accountReducer);

    const actualUserId = viewContext?.actualUserId || reduxCurrentUser._id;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [accessCode, setAccessCode] = useState("");
    const [accessGranted, setAccessGranted] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [startTime] = useState<Date>(new Date());

    useEffect(() => {
        if (qid && actualUserId) {
            loadQuizAndAttempts();
        }
    }, [qid]);

    useEffect(() => {
        if (quiz && quiz.timeLimit && timeRemaining !== null && timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            if (timeRemaining === 0) {
                handleSubmit();
            }

            return () => clearTimeout(timer);
        }
    }, [timeRemaining, quiz]);

    const loadQuizAndAttempts = async () => {
        if (!qid || !actualUserId) {
            setLoading(false);
            return;
        }

        try {
            const fetchedQuiz = await client.fetchQuiz(qid);
            setQuiz(fetchedQuiz);

            const initialAnswers: QuizAnswers = {};
            fetchedQuiz.questions.forEach((question: Question) => {
                if (question.type === "FILL-IN-THE-BLANK" && question.blanks) {
                    initialAnswers[question.id] = new Array(question.blanks.length).fill("");
                } else if (question.type === "MULTIPLE-CHOICE" && question.multipleAnswers) {
                    initialAnswers[question.id] = [];
                }
            });
            setAnswers(initialAnswers);

            const count = await client.fetchAttemptCount(qid, actualUserId);
            setAttemptCount(count);

            if (!fetchedQuiz.accessCode) {
                setAccessGranted(true);
                if (fetchedQuiz.timeLimit > 0) {
                    setTimeRemaining(fetchedQuiz.timeLimit * 60);
                }
            }
        } catch (err) {
            setError("Failed to load quiz");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccessCodeSubmit = () => {
        if (quiz && accessCode === quiz.accessCode) {
            setAccessGranted(true);
            setError("");
            if (quiz.timeLimit > 0) {
                setTimeRemaining(quiz.timeLimit * 60);
            }
        } else {
            setError("Incorrect access code");
        }
    };

    const handleAnswerChange = (questionId: string, answer: any, blankIndex?: number) => {
        if (quiz?.lockQuestionsAfterAnswering && answers[questionId] !== undefined) {
            return;
        }

        const question = quiz?.questions.find(q => q.id === questionId);
        if (!question) return;

        if (question.type === "FILL-IN-THE-BLANK" && question.blanks && blankIndex !== undefined) {
            const currentAnswers = (answers[questionId] as string[]) || new Array(question.blanks.length).fill("");
            const newAnswers = [...currentAnswers];
            newAnswers[blankIndex] = answer;
            setAnswers({ ...answers, [questionId]: newAnswers });
        } else if (question.type === "MULTIPLE-CHOICE" && question.multipleAnswers) {
            const currentChoices = (answers[questionId] as number[]) || [];
            const choiceIndex = answer as number;

            if (currentChoices.includes(choiceIndex)) {
                setAnswers({
                    ...answers,
                    [questionId]: currentChoices.filter(c => c !== choiceIndex)
                });
            } else {
                setAnswers({
                    ...answers,
                    [questionId]: [...currentChoices, choiceIndex]
                });
            }
        } else {
            setAnswers({ ...answers, [questionId]: answer });
        }
    };

    const calculateScore = (): number => {
        if (!quiz) return 0;

        let totalScore = 0;
        quiz.questions.forEach(question => {
            const userAnswer = answers[question.id];
            let pointsEarned = 0;

            switch (question.type) {
                case "MULTIPLE-CHOICE":
                    if (question.multipleAnswers && question.correctChoices) {
                        const userChoices = (userAnswer as number[]) || [];
                        const correctChoices = question.correctChoices;

                        const hasWrongAnswer = userChoices.some(choice => !correctChoices.includes(choice));

                        if (!hasWrongAnswer && userChoices.length > 0) {
                            const correctCount = userChoices.filter(choice => correctChoices.includes(choice)).length;
                            pointsEarned = (correctCount / correctChoices.length) * question.points;
                        }
                    } else {
                        if (userAnswer === question.correctChoice) {
                            pointsEarned = question.points;
                        }
                    }
                    break;

                case "TRUE-FALSE":
                    if (userAnswer === question.correctAnswer) {
                        pointsEarned = question.points;
                    }
                    break;

                case "FILL-IN-THE-BLANK":
                    if (question.blanks) {
                        const userAnswers = (userAnswer as string[]) || [];
                        let correctBlanks = 0;

                        question.blanks.forEach((blank, index) => {
                            const userBlankAnswer = (userAnswers[index] || "").toLowerCase().trim();
                            const isCorrect = blank.possibleAnswers.some(ans =>
                                ans.toLowerCase().trim() === userBlankAnswer
                            );
                            if (isCorrect) correctBlanks++;
                        });

                        pointsEarned = (correctBlanks / question.blanks.length) * question.points;
                    } else if (question.answers) {
                        const userAnswerStr = String(userAnswer).toLowerCase().trim();
                        const isCorrect = question.answers.some(ans =>
                            ans.toLowerCase().trim() === userAnswerStr
                        );
                        if (isCorrect) {
                            pointsEarned = question.points;
                        }
                    }
                    break;
            }

            totalScore += pointsEarned;
        });

        return Math.round(totalScore * 100) / 100;
    };

    const handleSubmit = async () => {
        if (!quiz || !actualUserId || submitting) return;

        try {
            setSubmitting(true);
            const submittedTime = new Date();
            const score = calculateScore();

            const attemptData = quiz.questions.map(question => {
                const userAnswer = answers[question.id] ?? "";
                let isCorrect = false;
                let pointsEarned = 0;

                switch (question.type) {
                    case "MULTIPLE-CHOICE":
                        if (question.multipleAnswers && question.correctChoices) {
                            const userChoices = (userAnswer as number[]) || [];
                            const correctChoices = question.correctChoices;

                            const hasWrongAnswer = userChoices.some(choice => !correctChoices.includes(choice));

                            if (!hasWrongAnswer && userChoices.length > 0) {
                                const correctCount = userChoices.filter(choice => correctChoices.includes(choice)).length;
                                pointsEarned = (correctCount / correctChoices.length) * question.points;
                                isCorrect = correctCount === correctChoices.length;
                            }
                        } else {
                            isCorrect = userAnswer === question.correctChoice;
                            if (isCorrect) pointsEarned = question.points;
                        }
                        break;

                    case "TRUE-FALSE":
                        isCorrect = userAnswer === question.correctAnswer;
                        if (isCorrect) pointsEarned = question.points;
                        break;

                    case "FILL-IN-THE-BLANK":
                        if (question.blanks) {
                            const userAnswers = (userAnswer as string[]) || [];
                            let correctBlanks = 0;

                            question.blanks.forEach((blank, index) => {
                                const userBlankAnswer = (userAnswers[index] || "").toLowerCase().trim();
                                const isBlankCorrect = blank.possibleAnswers.some(ans =>
                                    ans.toLowerCase().trim() === userBlankAnswer
                                );
                                if (isBlankCorrect) correctBlanks++;
                            });

                            pointsEarned = (correctBlanks / question.blanks.length) * question.points;
                            isCorrect = correctBlanks === question.blanks.length;
                        } else if (question.answers) {
                            const userAnswerStr = String(userAnswer).toLowerCase().trim();
                            isCorrect = question.answers.some(ans =>
                                ans.toLowerCase().trim() === userAnswerStr
                            );
                            if (isCorrect) pointsEarned = question.points;
                        }
                        break;
                }

                pointsEarned = Math.round(pointsEarned * 100) / 100;

                return {
                    questionId: question.id,
                    studentAnswer: userAnswer,
                    isCorrect,
                    pointsEarned
                };
            });

            const timeTakenSeconds = Math.floor((submittedTime.getTime() - startTime.getTime()) / 1000);

            await client.submitQuizAttempt(qid!, actualUserId, attemptData, score, timeTakenSeconds);
            navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/results`);
        } catch (err) {
            setError("Failed to submit quiz");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderQuestion = (question: Question, index: number) => {
        const isLocked = quiz?.lockQuestionsAfterAnswering && answers[question.id] !== undefined;

        return (
            <Card className="mb-4 shadow-sm" style={{ minHeight: '300px' }} id={`question-${index}`}>
                <Card.Header className="bg-light border-bottom" style={{ padding: '1.25rem' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                            Question {index + 1}
                        </h5>
                        <span className="text-muted" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {question.points} pts
                        </span>
                    </div>
                </Card.Header>
                <Card.Body className="p-4">
                    <div className="mb-4">
                        {question.description ? (
                            <div dangerouslySetInnerHTML={{ __html: question.description }} />
                        ) : (
                            <p>{question.title || `Question ${index + 1}`}</p>
                        )}
                    </div>

                    {question.type === "MULTIPLE-CHOICE" && (
                        <Form.Group>
                            {question.multipleAnswers && (
                                <p className="text-muted small mb-3">Select all that apply</p>
                            )}
                            {question.choices?.map((choice, choiceIndex) => {
                                const userAnswer = answers[question.id];
                                const isChecked = question.multipleAnswers
                                    ? ((userAnswer as number[]) || []).includes(choiceIndex)
                                    : userAnswer === choiceIndex;

                                return (
                                    <Form.Check
                                        key={choiceIndex}
                                        type={question.multipleAnswers ? "checkbox" : "radio"}
                                        id={`q${question.id}-choice${choiceIndex}`}
                                        name={question.multipleAnswers ? undefined : `question-${question.id}`}
                                        label={choice}
                                        checked={isChecked}
                                        onChange={() => handleAnswerChange(question.id, choiceIndex)}
                                        disabled={isLocked}
                                        className="mb-3 ps-4"
                                    />
                                );
                            })}
                        </Form.Group>
                    )}

                    {question.type === "TRUE-FALSE" && (
                        <Form.Group>
                            <Form.Check
                                type="radio"
                                id={`q${question.id}-true`}
                                name={`question-${question.id}`}
                                label="True"
                                checked={answers[question.id] === true}
                                onChange={() => handleAnswerChange(question.id, true)}
                                disabled={isLocked}
                                className="mb-3 ps-4"
                            />
                            <Form.Check
                                type="radio"
                                id={`q${question.id}-false`}
                                name={`question-${question.id}`}
                                label="False"
                                checked={answers[question.id] === false}
                                onChange={() => handleAnswerChange(question.id, false)}
                                disabled={isLocked}
                                className="ps-4"
                            />
                        </Form.Group>
                    )}

                    {question.type === "FILL-IN-THE-BLANK" && (
                        <Form.Group>
                            {question.blanks ? (
                                <div>
                                    {question.blanks.map((blank, blankIndex) => (
                                        <div key={blank.id} className="mb-3">
                                            <Form.Label>Blank {blankIndex + 1}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Enter answer for blank ${blankIndex + 1}`}
                                                value={((answers[question.id] as string[]) || [])[blankIndex] || ""}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value, blankIndex)}
                                                disabled={isLocked}
                                                className="w-50"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your answer"
                                    value={answers[question.id] as string || ""}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    disabled={isLocked}
                                    className="w-50"
                                />
                            )}
                        </Form.Group>
                    )}

                    {isLocked && (
                        <Alert variant="info" className="mt-3">
                            This question is locked and cannot be changed.
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        );
    };

    const isQuestionAnswered = (question: Question): boolean => {
        const answer = answers[question.id];
        if (answer === undefined || answer === null) return false;

        if (question.type === "FILL-IN-THE-BLANK" && question.blanks) {
            const blanksAnswers = answer as string[];
            return blanksAnswers && blanksAnswers.every(a => a && a.trim() !== "");
        } else if (question.type === "MULTIPLE-CHOICE" && question.multipleAnswers) {
            const choices = answer as number[];
            return choices && choices.length > 0;
        }

        return answer !== "";
    };

    if (loading) {
        return <div className="container-fluid px-4 py-3">Loading quiz...</div>;
    }

    if (!quiz) {
        return <div className="container-fluid px-4 py-3">Quiz not found</div>;
    }

    if (!quiz.published) {
        return (
            <div className="container-fluid px-4 py-3">
                <Alert variant="warning">This quiz is not yet available.</Alert>
            </div>
        );
    }

    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
        return (
            <div className="container-fluid px-4 py-3">
                <Alert variant="warning">
                    You have used all {quiz.howManyAttempts} attempts for this quiz.
                </Alert>
                <Button
                    variant="danger"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/results`)}
                >
                    View Last Attempt
                </Button>
            </div>
        );
    }

    if (!accessGranted && quiz.accessCode) {
        return (
            <div className="container-fluid px-4 py-3">
                <Card style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <Card.Body>
                        <h4>Access Code Required</h4>
                        <p>This quiz requires an access code to begin.</p>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter access code"
                                value={accessCode}
                                onChange={(e) => {
                                    setAccessCode(e.target.value);
                                    setError("");
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAccessCodeSubmit();
                                    }
                                }}
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button variant="primary" onClick={handleAccessCodeSubmit}>
                            Submit Code
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <Container fluid className="px-4 py-3" style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title}</h2>
                {timeRemaining !== null && (
                    <Alert variant="warning" className="mb-0">
                        Time Remaining: {formatTime(timeRemaining)}
                    </Alert>
                )}
            </div>

            <div className="mb-4">
                <strong>Started:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </div>

            {quiz.description && (
                <div className="mb-4">
                    <h3>Quiz Instructions</h3>
                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {quiz.oneQuestionAtTime ? (
                <div>
                    {renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}
                    <div className="d-flex justify-content-end mb-4">
                        {currentQuestionIndex > 0 && (
                            <Button
                                variant="outline-secondary"
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                className="me-2 px-4"
                            >
                                ◀ Previous
                            </Button>
                        )}
                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <Button
                                variant="outline-secondary"
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                className="px-4"
                            >
                                Next ▶
                            </Button>
                        ) : (
                            <Button
                                variant="outline-secondary"
                                onClick={() => setCurrentQuestionIndex(0)}
                                className="px-4"
                            >
                                Review Questions
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                quiz.questions.map((question, index) => renderQuestion(question, index))
            )}

            <div className="border rounded p-3 mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>
                        Quiz saved at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                    <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            color: '#000',
                            fontSize: '1rem'
                        }}
                    >
                        {submitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                </div>
            </div>

            {quiz.questions.length > 1 && (
                <div className="mt-4">
                    <h5>Questions</h5>
                    <div className="list-group">
                        {quiz.questions.map((question, index) => (
                            <button
                                key={index}
                                className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-2 ${isQuestionAnswered(question) ? 'text-dark' : 'text-danger'
                                    }`}
                                onClick={() => {
                                    setCurrentQuestionIndex(index);
                                    if (!quiz.oneQuestionAtTime) {
                                        const element = document.getElementById(`question-${index}`);
                                        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                style={{ backgroundColor: 'transparent', fontSize: '1.1rem' }}
                            >
                                {isQuestionAnswered(question) ? (
                                    <FaRegCheckCircle size={18} className="me-2" />
                                ) : (
                                    <AiOutlineQuestionCircle size={18} className="me-2" />
                                )}
                                <span>Question {index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}