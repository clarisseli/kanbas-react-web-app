import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as client from "./client";
import type { Quiz, QuizAttempt, Question } from "./types";

export default function QuizResults({ viewContext }: { viewContext?: any }) {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const reduxCurrentUser = useSelector((state: any) => state.accountReducer);
    const currentUser = viewContext?.currentUser || reduxCurrentUser;
    const actualUserId = viewContext?.actualUserId || reduxCurrentUser._id;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuizAndAttempts();
    }, [qid, actualUserId]);

    const loadQuizAndAttempts = async () => {
        if (!qid || !actualUserId) return;

        try {
            setLoading(true);
            const [fetchedQuiz, userAttempts] = await Promise.all([
                client.fetchQuiz(qid),
                client.fetchQuizAttemptsForUser(qid, actualUserId)
            ]);

            setQuiz(fetchedQuiz);
            setAttempts(userAttempts);

            if (userAttempts.length > 0) {
                setSelectedAttempt(userAttempts[userAttempts.length - 1]);
            }
        } catch (error) {
            console.error("Error loading quiz results:", error);
        } finally {
            setLoading(false);
        }
    };

    const getQuestionById = (questionId: string) => {
        return quiz?.questions.find(q => q.id === questionId);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }) + ' at ' + new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const formatDateOnly = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTimeOnly = (date: Date | string) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const formatTimeTaken = (seconds?: number): string => {
        if (!seconds) return "0 minutes";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs} seconds`;
        if (secs === 0) return `${mins} minutes`;
        return `${mins} minutes ${secs} seconds`;
    };

    const getHighestScore = (): number => {
        if (attempts.length === 0) return 0;
        return Math.max(...attempts.map(attempt => calculateActualScore(attempt)));
    };

    const calculateActualScore = (attempt: QuizAttempt): number => {
        let totalScore = 0;
        attempt.answers.forEach(answer => {
            totalScore += answer.pointsEarned;
        });
        return Math.round(totalScore * 100) / 100;
    };

    const renderAnswerDetails = (question: Question, answer: any) => {
        const showCorrectAnswers = currentUser.role === "FACULTY" || quiz?.showCorrectAnswers === "Immediately";

        switch (question.type) {
            case "MULTIPLE-CHOICE":
                if (question.multipleAnswers && question.correctChoices) {
                    const userChoices = (answer.studentAnswer as number[]) || [];
                    const correctChoices = question.correctChoices;

                    return (
                        <div>
                            {question.choices?.map((choice, choiceIndex) => {
                                const isUserSelected = userChoices.includes(choiceIndex);
                                const isCorrectChoice = correctChoices.includes(choiceIndex);
                                const isCorrectSelection = isUserSelected && isCorrectChoice;
                                const isWrongSelection = isUserSelected && !isCorrectChoice;
                                const isMissedCorrect = !isUserSelected && isCorrectChoice;

                                return (
                                    <div
                                        key={choiceIndex}
                                        className={`p-2 mb-2 ${isCorrectSelection ? 'bg-success bg-opacity-25' :
                                            isWrongSelection ? 'bg-danger bg-opacity-25' :
                                                showCorrectAnswers && isMissedCorrect ? 'bg-warning bg-opacity-25' : ''
                                            }`}
                                    >
                                        <span className="me-2">
                                            {isUserSelected ? '☑' : '☐'}
                                        </span>
                                        {choice}
                                        {isCorrectSelection && (
                                            <span className="ms-3 text-success fw-bold">✓ Correct</span>
                                        )}
                                        {isWrongSelection && (
                                            <span className="ms-3 text-danger fw-bold">✗ Incorrect selection</span>
                                        )}
                                        {showCorrectAnswers && isMissedCorrect && (
                                            <span className="ms-3 text-warning fw-bold">← Should be selected</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            {question.choices?.map((choice, choiceIndex) => {
                                const isUserAnswer = answer.studentAnswer === choiceIndex;
                                const isCorrectAnswer = question.correctChoice === choiceIndex;

                                return (
                                    <div
                                        key={choiceIndex}
                                        className={`p-2 mb-2 ${isUserAnswer && answer.isCorrect ? 'bg-success bg-opacity-25' :
                                            isUserAnswer && !answer.isCorrect ? 'bg-danger bg-opacity-25' :
                                                showCorrectAnswers && isCorrectAnswer && !isUserAnswer ? 'bg-success bg-opacity-25' : ''
                                            }`}
                                    >
                                        <span className="me-2">•</span>
                                        {choice}
                                        {isUserAnswer && answer.isCorrect && (
                                            <span className="ms-3 text-success fw-bold">Correct!</span>
                                        )}
                                        {isUserAnswer && !answer.isCorrect && (
                                            <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                        )}
                                        {showCorrectAnswers && isCorrectAnswer && !isUserAnswer && (
                                            <span className="ms-3 text-success fw-bold">Correct Answer</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                }

            case "TRUE-FALSE":
                return (
                    <div>
                        <div
                            className={`p-2 mb-2 ${answer.studentAnswer === true && answer.isCorrect ? 'bg-success bg-opacity-25' :
                                answer.studentAnswer === true && !answer.isCorrect ? 'bg-danger bg-opacity-25' :
                                    showCorrectAnswers && question.correctAnswer === true && answer.studentAnswer !== true ? 'bg-success bg-opacity-25' : ''
                                }`}
                        >
                            True
                            {answer.studentAnswer === true && answer.isCorrect && (
                                <span className="ms-3 text-success fw-bold">Correct!</span>
                            )}
                            {answer.studentAnswer === true && !answer.isCorrect && (
                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                            )}
                            {showCorrectAnswers && question.correctAnswer === true && answer.studentAnswer !== true && (
                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                            )}
                        </div>
                        <div
                            className={`p-2 ${answer.studentAnswer === false && answer.isCorrect ? 'bg-success bg-opacity-25' :
                                answer.studentAnswer === false && !answer.isCorrect ? 'bg-danger bg-opacity-25' :
                                    showCorrectAnswers && question.correctAnswer === false && answer.studentAnswer !== false ? 'bg-success bg-opacity-25' : ''
                                }`}
                        >
                            False
                            {answer.studentAnswer === false && answer.isCorrect && (
                                <span className="ms-3 text-success fw-bold">Correct!</span>
                            )}
                            {answer.studentAnswer === false && !answer.isCorrect && (
                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                            )}
                            {showCorrectAnswers && question.correctAnswer === false && answer.studentAnswer !== false && (
                                <span className="ms-3 text-success fw-bold">Correct Answer</span>
                            )}
                        </div>
                    </div>
                );

            case "FILL-IN-THE-BLANK":
                if (question.blanks) {
                    const userAnswers = (answer.studentAnswer as string[]) || [];

                    return (
                        <div>
                            {question.blanks.map((blank, blankIndex) => {
                                const userBlankAnswer = userAnswers[blankIndex] || "";
                                const isBlankCorrect = blank.possibleAnswers.some(ans =>
                                    ans.toLowerCase().trim() === userBlankAnswer.toLowerCase().trim()
                                );

                                return (
                                    <div key={blank.id} className="mb-3">
                                        <div
                                            className={`p-2 mb-2 ${isBlankCorrect ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25'
                                                }`}
                                        >
                                            <strong>Blank {blankIndex + 1}:</strong> {userBlankAnswer || "(No answer provided)"}
                                            {isBlankCorrect && (
                                                <span className="ms-3 text-success fw-bold">Correct!</span>
                                            )}
                                            {!isBlankCorrect && (
                                                <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                            )}
                                        </div>

                                        {showCorrectAnswers && !isBlankCorrect && (
                                            <div className="ms-4 p-2 bg-success bg-opacity-25">
                                                <strong>Correct Answer(s):</strong> {blank.possibleAnswers.join(", ")}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <div
                                className={`p-2 mb-2 ${answer.isCorrect ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25'
                                    }`}
                            >
                                <strong>Your Answer:</strong> {answer.studentAnswer || "(No answer provided)"}
                                {answer.isCorrect && (
                                    <span className="ms-3 text-success fw-bold">Correct!</span>
                                )}
                                {!answer.isCorrect && (
                                    <span className="ms-3 text-danger fw-bold">Incorrect</span>
                                )}
                            </div>

                            {showCorrectAnswers && !answer.isCorrect && (
                                <div className="mt-2 p-2 bg-success bg-opacity-25">
                                    <strong>Correct Answer(s):</strong> {question.answers?.join(", ")}
                                </div>
                            )}
                        </div>
                    );
                }

            default:
                return null;
        }
    };

    if (loading) {
        return <div className="container-fluid px-4 py-3">Loading results...</div>;
    }

    if (!quiz || !selectedAttempt) {
        return <div className="container-fluid px-4 py-3">No results found</div>;
    }

    const highestScore = getHighestScore();
    const actualScore = calculateActualScore(selectedAttempt);

    return (
        <Container fluid className="px-4 py-3" style={{ maxWidth: '1400px' }}>
            <Row>
                <Col lg={currentUser.role === "STUDENT" ? 8 : 12} md={12}>
                    {currentUser.role === "FACULTY" && (
                        <div className="mb-4">
                            <h2 className="mb-4">Submission Details</h2>
                            <div style={{ maxWidth: '500px' }}>
                                <Row className="border-bottom py-2">
                                    <Col xs={4}><strong>Time:</strong></Col>
                                    <Col xs={8}>{formatTimeTaken(selectedAttempt.timeTakenSeconds)}</Col>
                                </Row>
                                <Row className="border-bottom py-2">
                                    <Col xs={4}><strong>Submitted at:</strong></Col>
                                    <Col xs={8}>{formatDate(selectedAttempt.submittedAt)}</Col>
                                </Row>
                                <Row className="py-2">
                                    <Col xs={4}><strong>Score:</strong></Col>
                                    <Col xs={8}><strong>{actualScore}</strong> out of {quiz.points}</Col>
                                </Row>
                            </div>
                            <hr className="my-4" />
                        </div>
                    )}

                    {currentUser.role === "STUDENT" && (
                        <>
                            <h2 className="mb-3">{quiz.title}</h2>
                            <hr />

                            <div style={{ maxWidth: '600px' }} className="mb-3">
                                <div className="wd-row-center flex-wrap mb-1">
                                    <div className="me-5 mb-1" style={{ whiteSpace: 'nowrap' }}>
                                        <strong>Due</strong>{" "}{formatDateOnly(quiz.dueDate)} at {formatTimeOnly(quiz.dueDate)}
                                    </div>
                                    <div className="me-5 mb-1" style={{ whiteSpace: 'nowrap' }}>
                                        <strong>Points</strong>{" "}{quiz.points}
                                    </div>
                                    <div className="mb-1" style={{ whiteSpace: 'nowrap' }}>
                                        <strong>Questions</strong>{" "}{quiz.questions?.length || 0}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <strong>Available</strong>{" "}{formatDateOnly(quiz.availableFrom)} at {formatTimeOnly(quiz.availableFrom)} - {formatDateOnly(quiz.availableUntil)} at {formatTimeOnly(quiz.availableUntil)}
                                </div>

                                <div className="mb-3">
                                    <strong>Time Limit</strong>{" "}{quiz.timeLimit} Minutes
                                </div>
                            </div>

                            <hr />

                            {quiz.description && (
                                <div className="my-4">
                                    <h3>Instructions</h3>
                                    <div
                                        className="mt-3"
                                        dangerouslySetInnerHTML={{ __html: quiz.description }}
                                    />
                                </div>
                            )}

                            <hr />

                            <h3 className="mb-4">Attempt History</h3>

                            <div className="mb-5">
                                <Row className="border-bottom py-2 fw-bold">
                                    <Col xs={2}></Col>
                                    <Col xs={4}>Attempt</Col>
                                    <Col xs={3}>Time</Col>
                                    <Col xs={3}>Score</Col>
                                </Row>
                                {attempts.map((attempt, index) => {
                                    const attemptScore = calculateActualScore(attempt);
                                    const isSelected = attempt.attemptId === selectedAttempt.attemptId;
                                    const isLatest = index === attempts.length - 1;

                                    return (
                                        <Row
                                            key={attempt.attemptId}
                                            className="py-2 border-bottom"
                                            onClick={() => setSelectedAttempt(attempt)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Col xs={2}>
                                                {isLatest && <strong>LATEST</strong>}
                                            </Col>
                                            <Col xs={4}>
                                                <span className={isSelected ? "text-danger text-decoration-underline" : ""}>
                                                    Attempt {index + 1}
                                                </span>
                                            </Col>
                                            <Col xs={3}>{formatTimeTaken(attempt.timeTakenSeconds)}</Col>
                                            <Col xs={3}><strong>{attemptScore}</strong> out of {quiz.points}</Col>
                                        </Row>
                                    );
                                })}
                            </div>

                            <hr />

                            <div className="mb-5">
                                <p>Score for this quiz: <strong>{actualScore}</strong> out of {quiz.points}</p>
                                <p>Submitted {formatDate(selectedAttempt.submittedAt)}</p>
                                <p>This attempt took {formatTimeTaken(selectedAttempt.timeTakenSeconds)}.</p>
                            </div>
                        </>
                    )}

                    {selectedAttempt.answers.map((answer, index) => {
                        const question = getQuestionById(answer.questionId);
                        if (!question) return null;

                        return (
                            <Card key={answer.questionId} className="mb-4">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Question {index + 1}</h5>
                                    <span>{answer.pointsEarned} / {question.points} pts</span>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-4">
                                        {question.description ? (
                                            <div dangerouslySetInnerHTML={{ __html: question.description }} />
                                        ) : (
                                            <p>{question.title}</p>
                                        )}
                                    </div>

                                    {renderAnswerDetails(question, answer)}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </Col>

                {currentUser.role === "STUDENT" && (
                    <Col lg={4} className="d-none d-lg-block">
                        <div className="sticky-top" style={{ top: '20px' }}>
                            <Row className="border-bottom py-2">
                                <Col xs={12}><strong>Submission Details</strong></Col>
                            </Row>
                            <Row className="border-bottom py-2">
                                <Col xs={5}><strong>Time:</strong></Col>
                                <Col xs={7}>{formatTimeTaken(selectedAttempt.timeTakenSeconds)}</Col>
                            </Row>
                            <Row className="border-bottom py-2">
                                <Col xs={5} className="pe-0"><strong>Current Score:</strong></Col>
                                <Col xs={7}><strong>{actualScore}</strong> out of {quiz.points}</Col>
                            </Row>
                            <Row className="py-2">
                                <Col xs={5}><strong>Kept Score:</strong></Col>
                                <Col xs={7}><strong>{highestScore}</strong> out of {quiz.points}</Col>
                            </Row>
                        </div>
                    </Col>
                )}
            </Row>

            {currentUser.role === "STUDENT" && (
                <Row className="d-lg-none mt-4">
                    <Col>
                        <Row className="border-bottom py-2">
                            <Col xs={12}><strong>Submission Details</strong></Col>
                        </Row>
                        <Row className="border-bottom py-2">
                            <Col xs={5}><strong>Time:</strong></Col>
                            <Col xs={7}>{formatTimeTaken(selectedAttempt.timeTakenSeconds)}</Col>
                        </Row>
                        <Row className="border-bottom py-2">
                            <Col xs={5} className="pe-0"><strong>Current Score:</strong></Col>
                            <Col xs={7}>{actualScore} out of {quiz.points}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col xs={5}><strong>Kept Score:</strong></Col>
                            <Col xs={7}>{highestScore} out of {quiz.points}</Col>
                        </Row>
                    </Col>
                </Row>
            )}

            <Row className="mt-4 mb-4">
                <Col>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                    >
                        Back to Quizzes
                    </Button>

                    {quiz.multipleAttempts && attempts.length < quiz.howManyAttempts && (
                        <Button
                            variant="primary"
                            className="ms-2"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`)}
                        >
                            Retake Quiz: {quiz.howManyAttempts - attempts.length} attempts remaining
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
}