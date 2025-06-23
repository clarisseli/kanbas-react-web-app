import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Alert, Form, Container } from "react-bootstrap";
import { FaEdit, FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle, AiOutlineQuestionCircle } from "react-icons/ai";
import * as client from "./client";
import type { Quiz, Question } from "./types";

interface PreviewAnswers {
    [questionId: string]: string | number | boolean | number[] | string[];
}

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<PreviewAnswers>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [startTime] = useState(new Date());

    useEffect(() => {
        loadQuiz();
    }, [qid]);

    const loadQuiz = async () => {
        if (!qid) return;

        try {
            setLoading(true);
            const fetchedQuiz = await client.fetchQuiz(qid);
            setQuiz(fetchedQuiz);

            // Initialize answers for multiple choice with multiple answers and multiple blanks
            const initialAnswers: PreviewAnswers = {};
            fetchedQuiz.questions.forEach((question: Question) => {
                if (question.type === "FILL-IN-THE-BLANK" && question.blanks) {
                    initialAnswers[question.id] = new Array(question.blanks.length).fill("");
                } else if (question.type === "MULTIPLE-CHOICE" && question.multipleAnswers) {
                    initialAnswers[question.id] = [];
                }
            });
            setAnswers(initialAnswers);
        } catch (error) {
            console.error("Error loading quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: any, blankIndex?: number) => {
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

    const calculateScore = () => {
        if (!quiz) return;

        let totalScore = 0;
        quiz.questions.forEach(question => {
            const userAnswer = answers[question.id];
            let pointsEarned = 0;

            switch (question.type) {
                case "MULTIPLE-CHOICE":
                    if (question.multipleAnswers && question.correctChoices) {
                        const userChoices = (userAnswer as number[]) || [];
                        const correctChoices = question.correctChoices;

                        // Check if user has any wrong answers
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

        setScore(Math.round(totalScore * 100) / 100);
        setShowResults(true);
    };

    const renderQuestion = (question: Question, index: number) => {
        return (
            <Card key={question.id} className="mb-4 shadow-sm" style={{ minHeight: '300px' }} id={`question-${index}`}>
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
                                        id={`preview-q${question.id}-choice${choiceIndex}`}
                                        name={question.multipleAnswers ? undefined : `preview-question-${question.id}`}
                                        label={choice}
                                        checked={isChecked}
                                        onChange={() => handleAnswerChange(question.id, choiceIndex)}
                                        disabled={showResults}
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
                                id={`preview-q${question.id}-true`}
                                name={`preview-question-${question.id}`}
                                label="True"
                                checked={answers[question.id] === true}
                                onChange={() => handleAnswerChange(question.id, true)}
                                disabled={showResults}
                                className="mb-3 ps-4"
                            />
                            <Form.Check
                                type="radio"
                                id={`preview-q${question.id}-false`}
                                name={`preview-question-${question.id}`}
                                label="False"
                                checked={answers[question.id] === false}
                                onChange={() => handleAnswerChange(question.id, false)}
                                disabled={showResults}
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
                                                disabled={showResults}
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
                                    disabled={showResults}
                                    className="w-50"
                                />
                            )}
                        </Form.Group>
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

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    if (loading) {
        return <div className="container-fluid px-4 py-3">Loading quiz preview...</div>;
    }

    if (!quiz) {
        return <div className="container-fluid px-4 py-3">Quiz not found</div>;
    }

    if (!quiz.questions || quiz.questions.length === 0) {
        return (
            <Container fluid className="px-4 py-3" style={{ maxWidth: '900px' }}>
                <h2 className="mb-3">{quiz.title}</h2>

                <Alert variant="light" className="text-center py-5">
                    <AiOutlineExclamationCircle size={48} className="mb-3 text-black" />
                    <h4>No Questions Available</h4>
                    <p className="mb-4">
                        This quiz doesn't have any questions yet.
                        Add questions to preview the quiz.
                    </p>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        <FaEdit className="me-2" />
                        Add Questions
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (showResults) {
        const endTime = new Date();
        const timeTakenSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        const timeTakenMinutes = Math.floor(timeTakenSeconds / 60);
        const timeTakenSecondsRemainder = timeTakenSeconds % 60;
        const timeTakenDisplay = timeTakenMinutes > 0
            ? `${timeTakenMinutes} minutes ${timeTakenSecondsRemainder} seconds`
            : `${timeTakenSecondsRemainder} seconds`;

        return (
            <Container fluid className="px-4 py-3" style={{ maxWidth: '900px' }}>
                <h2 className="mb-4">{quiz.title} - Preview Results</h2>

                <div className="mb-5">
                    <p>Score for this quiz: <strong>{score}</strong> out of {quiz.points}</p>
                    <p>Submitted {formatDate(endTime)}</p>
                    <p>This attempt took {timeTakenDisplay}.</p>
                    <p className="text-muted">This was a preview. No scores were saved.</p>
                </div>

                {quiz.questions.map((question, index) => {
                    const userAnswer = answers[question.id];
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

                                question.blanks.forEach((blank, blankIdx) => {
                                    const userBlankAnswer = (userAnswers[blankIdx] || "").toLowerCase().trim();
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

                    return (
                        <Card key={question.id} className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Question {index + 1}</h5>
                                <span>{pointsEarned} / {question.points} pts</span>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-4">
                                    {question.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: question.description }} />
                                    ) : (
                                        <p>{question.title}</p>
                                    )}
                                </div>

                                {/* Multiple Choice Results */}
                                {question.type === "MULTIPLE-CHOICE" && (
                                    <div>
                                        {question.multipleAnswers && question.correctChoices ? (
                                            // Multiple answer multiple choice
                                            <div>
                                                {question.choices?.map((choice, choiceIndex) => {
                                                    const userChoices = (userAnswer as number[]) || [];
                                                    const isUserChoice = userChoices.includes(choiceIndex);
                                                    const isCorrectChoice = question.correctChoices!.includes(choiceIndex);

                                                    return (
                                                        <div
                                                            key={choiceIndex}
                                                            className={`p-2 mb-2 ${isUserChoice && isCorrectChoice ? 'bg-success bg-opacity-25' :
                                                                isUserChoice && !isCorrectChoice ? 'bg-danger bg-opacity-25' :
                                                                    !isUserChoice && isCorrectChoice ? 'bg-success bg-opacity-25' : ''
                                                                }`}
                                                        >
                                                            <span className="me-2">
                                                                {isUserChoice ? "☑" : "☐"}
                                                            </span>
                                                            {choice}
                                                            {isUserChoice && isCorrectChoice && (
                                                                <span className="ms-3 text-success fw-bold">Correct Selection!</span>
                                                            )}
                                                            {isUserChoice && !isCorrectChoice && (
                                                                <span className="ms-3 text-danger fw-bold">Incorrect Selection</span>
                                                            )}
                                                            {!isUserChoice && isCorrectChoice && (
                                                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Single answer multiple choice
                                            <div>
                                                {question.choices?.map((choice, choiceIndex) => {
                                                    const isUserAnswer = userAnswer === choiceIndex;
                                                    const isCorrectAnswer = question.correctChoice === choiceIndex;

                                                    return (
                                                        <div
                                                            key={choiceIndex}
                                                            className={`p-2 mb-2 ${isUserAnswer && isCorrect ? 'bg-success bg-opacity-25' :
                                                                isUserAnswer && !isCorrect ? 'bg-danger bg-opacity-25' :
                                                                    isCorrectAnswer && !isUserAnswer ? 'bg-success bg-opacity-25' : ''
                                                                }`}
                                                        >
                                                            <span className="me-2">•</span>
                                                            {choice}
                                                            {isUserAnswer && isCorrect && (
                                                                <span className="ms-3 text-success fw-bold">Correct!</span>
                                                            )}
                                                            {isUserAnswer && !isCorrect && (
                                                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                                            )}
                                                            {isCorrectAnswer && !isUserAnswer && (
                                                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* True/False Results */}
                                {question.type === "TRUE-FALSE" && (
                                    <div>
                                        <div
                                            className={`p-2 mb-2 ${userAnswer === true && isCorrect ? 'bg-success bg-opacity-25' :
                                                userAnswer === true && !isCorrect ? 'bg-danger bg-opacity-25' :
                                                    question.correctAnswer === true && userAnswer !== true ? 'bg-success bg-opacity-25' : ''
                                                }`}
                                        >
                                            True
                                            {userAnswer === true && isCorrect && (
                                                <span className="ms-3 text-success fw-bold">Correct!</span>
                                            )}
                                            {userAnswer === true && !isCorrect && (
                                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                            )}
                                            {question.correctAnswer === true && userAnswer !== true && (
                                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                                            )}
                                        </div>
                                        <div
                                            className={`p-2 ${userAnswer === false && isCorrect ? 'bg-success bg-opacity-25' :
                                                userAnswer === false && !isCorrect ? 'bg-danger bg-opacity-25' :
                                                    question.correctAnswer === false && userAnswer !== false ? 'bg-success bg-opacity-25' : ''
                                                }`}
                                        >
                                            False
                                            {userAnswer === false && isCorrect && (
                                                <span className="ms-3 text-success fw-bold">Correct!</span>
                                            )}
                                            {userAnswer === false && !isCorrect && (
                                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                            )}
                                            {question.correctAnswer === false && userAnswer !== false && (
                                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Fill in the Blank Results */}
                                {question.type === "FILL-IN-THE-BLANK" && (
                                    <div>
                                        {question.blanks ? (
                                            // Multiple blanks
                                            <div>
                                                {question.blanks.map((blank, blankIdx) => {
                                                    const userAnswers = (userAnswer as string[]) || [];
                                                    const userBlankAnswer = userAnswers[blankIdx] || "";
                                                    const isBlankCorrect = blank.possibleAnswers.some(ans =>
                                                        ans.toLowerCase().trim() === userBlankAnswer.toLowerCase().trim()
                                                    );

                                                    return (
                                                        <div key={blank.id} className="mb-3">
                                                            <div
                                                                className={`p-2 mb-2 ${isBlankCorrect ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25'
                                                                    }`}
                                                            >
                                                                <strong>Blank {blankIdx + 1}:</strong> {userBlankAnswer || "(No answer provided)"}
                                                                {isBlankCorrect && (
                                                                    <span className="ms-3 text-success fw-bold">Correct!</span>
                                                                )}
                                                                {!isBlankCorrect && (
                                                                    <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                                                )}
                                                            </div>
                                                            {!isBlankCorrect && (
                                                                <div className="mt-2 p-2 bg-success bg-opacity-25">
                                                                    <strong>Correct Answer(s):</strong> {blank.possibleAnswers.join(", ")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Single blank
                                            <div>
                                                <div
                                                    className={`p-2 mb-2 ${isCorrect ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25'
                                                        }`}
                                                >
                                                    <strong>Your Answer:</strong> {userAnswer || "(No answer provided)"}
                                                    {isCorrect && (
                                                        <span className="ms-3 text-success fw-bold">Correct!</span>
                                                    )}
                                                    {!isCorrect && (
                                                        <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                                    )}
                                                </div>

                                                {!isCorrect && (
                                                    <div className="mt-2 p-2 bg-success bg-opacity-25">
                                                        <strong>Correct Answer(s):</strong> {question.answers?.join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    );
                })}

                <div className="mt-4 text-center">
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => {
                            setAnswers({});
                            setShowResults(false);
                            setScore(0);
                            setCurrentQuestionIndex(0);
                        }}
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        <FaEdit className="me-2" />
                        Keep Editing This Quiz
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="px-4 py-3" style={{ maxWidth: '900px' }}>
            <h2 className="mb-3">{quiz.title}</h2>

            <Alert variant="light" className="d-flex align-items-center border-0" style={{ backgroundColor: '#f8f9fa' }}>
                <AiOutlineExclamationCircle size={20} className="me-2" />
                <span>This is a preview of the published version of the quiz</span>
            </Alert>

            <div className="mb-4">
                <strong>Started:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(startTime)}
            </div>

            {quiz.description && (
                <div className="mb-4">
                    <h3>Quiz Instructions</h3>
                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
                </div>
            )}

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
                        Quiz saved at {formatTime(new Date())}
                    </span>
                    <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={calculateScore}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            color: '#000',
                            fontSize: '1rem'
                        }}
                    >
                        Submit Quiz
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm" style={{ border: '1px solid #dee2e6' }}>
                <Card.Body className="py-3 px-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-center">
                        <FaEdit size={18} className="me-3" style={{ color: '#000' }} />
                        <Button
                            variant="link"
                            className="text-decoration-none p-0"
                            style={{ color: '#000', fontSize: '1rem' }}
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
                        >
                            Keep Editing This Quiz
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {quiz.questions.length > 1 && (
                <div className="mt-4">
                    <h4>Questions</h4>
                    <div className="list-group">
                        {quiz.questions.map((_, index) => (
                            <button
                                key={index}
                                className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-2 ${isQuestionAnswered(quiz.questions[index]) ? 'text-dark' : 'text-danger'
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
                                {isQuestionAnswered(quiz.questions[index]) ? (
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