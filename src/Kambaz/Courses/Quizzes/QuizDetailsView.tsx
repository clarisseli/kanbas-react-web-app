import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import * as client from "./client";
import { type Quiz } from "./types";

export default function QuizDetailsView({ viewContext }: { viewContext?: any }) {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const reduxCurrentUser = useSelector((state: any) => state.accountReducer);
    const currentUser = viewContext?.currentUser || reduxCurrentUser;

    useEffect(() => {
        const loadQuiz = async () => {
            if (!qid) return;
            try {
                const quizData = await client.fetchQuiz(qid);
                setQuiz(quizData);
            } catch (error) {
                console.error("Error loading quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, [qid]);

    const handlePublishToggle = async () => {
        if (!quiz || !qid) return;
        try {
            const newPublishedState = !quiz.published;
            await client.publishQuiz(qid, newPublishedState);
            setQuiz({ ...quiz, published: newPublishedState });
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    };

    const formatDateTime = (date: Date | string) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).replace(',', ' at');
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

    const getShowCorrectAnswersText = (value: string) => {
        return value === "Immediately" ? "Immediately" : "Never";
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!quiz) return <div className="p-4">Quiz not found</div>;

    if (currentUser && currentUser.role === "STUDENT") {
        return (
            <Container fluid className="px-4 py-3">
                <h2 className="mb-3">{quiz.title}</h2>
                <hr />

                <div style={{ maxWidth: '600px' }}>
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

                <div className="my-4">
                    <h3>Instructions</h3>
                    {quiz.description ? (
                        <div
                            className="mt-3"
                            dangerouslySetInnerHTML={{ __html: quiz.description }}
                        />
                    ) : (
                        <p className="text-muted">No instructions provided.</p>
                    )}
                </div>

                <div className="text-center mt-5">
                    <Button
                        variant="danger"
                        size="lg"
                        disabled={!quiz.published}
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`)}
                    >
                        Take the Quiz
                    </Button>
                    {!quiz.published && (
                        <div className="text-muted small mt-2">This quiz is not yet available.</div>
                    )}
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="px-4">
            <div className="d-flex justify-content-center gap-2 mb-3">
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`)}
                >
                    Preview
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
                >
                    <FaEdit className="me-1" /> Edit
                </Button>
                <Button
                    variant={quiz.published ? "success" : "danger"}
                    onClick={handlePublishToggle}
                >
                    {quiz.published ? "Unpublish" : "Publish"}
                </Button>
            </div>

            <div style={{
                border: '2px dotted #ccc',
                padding: '30px'
            }}>
                <h2 className="mb-4">{quiz.title}</h2>

                <div className="mx-auto" style={{ maxWidth: '600px' }}>
                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Quiz Type</strong>
                        </Col>
                        <Col xs={7}>{quiz.type}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Points</strong>
                        </Col>
                        <Col xs={7}>{quiz.points}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Assignment Group</strong>
                        </Col>
                        <Col xs={7}>{quiz.assignmentGroup}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Shuffle Answers</strong>
                        </Col>
                        <Col xs={7}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Time Limit</strong>
                        </Col>
                        <Col xs={7}>{quiz.timeLimit} Minutes</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Multiple Attempts</strong>
                        </Col>
                        <Col xs={7}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
                    </Row>

                    {quiz.multipleAttempts && (
                        <Row className="mb-2">
                            <Col xs={5} className="text-end pe-4">
                                <strong>Allowed Attempts</strong>
                            </Col>
                            <Col xs={7}>{quiz.howManyAttempts}</Col>
                        </Row>
                    )}

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>View Responses</strong>
                        </Col>
                        <Col xs={7}>{quiz.viewResponses}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Show Correct Answers</strong>
                        </Col>
                        <Col xs={7}>{getShowCorrectAnswersText(quiz.showCorrectAnswers)}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>One Question at a Time</strong>
                        </Col>
                        <Col xs={7}>{quiz.oneQuestionAtTime ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Require Respondus LockDown Browser</strong>
                        </Col>
                        <Col xs={7}>{quiz.requireRespondusLockDownBrowser ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Required to View Quiz Results</strong>
                        </Col>
                        <Col xs={7}>{quiz.requiredToViewQuizResults ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Webcam Required</strong>
                        </Col>
                        <Col xs={7}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Lock Questions After Answering</strong>
                        </Col>
                        <Col xs={7}>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col xs={5} className="text-end pe-4">
                            <strong>Access Code</strong>
                        </Col>
                        <Col xs={7}>{quiz.accessCode || "None"}</Col>
                    </Row>
                </div>

                <div className="mx-auto mt-4" style={{ maxWidth: '700px' }}>
                    <Row className="pb-2" style={{ borderBottom: '1px solid #dee2e6' }}>
                        <Col><strong>Due</strong></Col>
                        <Col><strong>For</strong></Col>
                        <Col><strong>Available from</strong></Col>
                        <Col><strong>Until</strong></Col>
                    </Row>
                    <Row className="pt-2 pb-2" style={{ borderBottom: '1px solid #dee2e6' }}>
                        <Col>{formatDateTime(quiz.dueDate)}</Col>
                        <Col>Everyone</Col>
                        <Col>{formatDateTime(quiz.availableFrom)}</Col>
                        <Col>{formatDateTime(quiz.availableUntil)}</Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
}