import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Nav, Tab, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { type Quiz, createNewQuiz } from "./types";
import { addQuiz, updateQuiz } from "./reducer";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionsEditor";
import { FaCheckCircle, FaBan } from "react-icons/fa";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");
    const [isNewQuiz, setIsNewQuiz] = useState(false);

    useEffect(() => {
        const loadQuiz = async () => {
            if (!cid || !qid) return;

            try {
                const existingQuiz = await client.fetchQuiz(qid);

                if (!existingQuiz || existingQuiz === null) {
                    const newQuiz = createNewQuiz(cid) as Quiz;
                    newQuiz._id = qid;
                    setQuiz(newQuiz);
                    setIsNewQuiz(true);
                } else {
                    setQuiz(existingQuiz);
                    setIsNewQuiz(false);
                }
                setLoading(false);
            } catch (error) {
                const newQuiz = createNewQuiz(cid) as Quiz;
                newQuiz._id = qid;
                setQuiz(newQuiz);
                setIsNewQuiz(true);
                setLoading(false);
            }
        };

        loadQuiz();
    }, [cid, qid]);

    const handleSave = async (quizToSave?: Quiz) => {
        const quizData = quizToSave || quiz;
        if (!quizData || !cid) return;

        try {
            if (isNewQuiz) {
                const quizToCreate = {
                    ...quizData,
                    questions: quizData.questions || [],
                    points: quizData.questions.reduce((sum, q) => sum + q.points, 0)
                };
                await client.createQuiz(quizToCreate);
                dispatch(addQuiz(quizToCreate));
                setIsNewQuiz(false);
            } else {
                const quizToUpdate = {
                    ...quizData,
                    questions: quizData.questions || [],
                    points: quizData.questions.reduce((sum, q) => sum + q.points, 0)
                };
                await client.updateQuiz(quizToUpdate);
                dispatch(updateQuiz({ quiz: quizToUpdate }));
            }

            navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/details`);
        } catch (error) {
            alert("Failed to save quiz. Please check the console for details.");
        }
    };

    const handleSaveAndPublish = async () => {
        if (!quiz) return;

        const publishedQuiz = {
            ...quiz,
            published: true,
            questions: quiz.questions || [],
            points: quiz.questions.reduce((sum, q) => sum + q.points, 0)
        };

        try {
            if (isNewQuiz) {
                await client.createQuiz(publishedQuiz);
                dispatch(addQuiz(publishedQuiz));
            } else {
                await client.updateQuiz(publishedQuiz);
                dispatch(updateQuiz({ quiz: publishedQuiz }));
            }

            navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    };

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    const updateQuizPoints = () => {
        if (!quiz) return;
        const totalPoints = quiz.questions.reduce((sum, question) => sum + (question.points || 0), 0);
        setQuiz({ ...quiz, points: totalPoints });
    };

    useEffect(() => {
        updateQuizPoints();
    }, [quiz?.questions]);

    if (loading) {
        return <div className="container-fluid px-4 py-3">Loading...</div>;
    }

    if (!quiz) {
        return <div className="container-fluid px-4 py-3">Quiz not found</div>;
    }

    return (
        <div className="container-fluid px-4 py-3">
            <Row className="mb-3 align-items-center">
                <Col xs={6}>
                    <div className="d-flex align-items-center gap-2">
                        <strong>Points:</strong>
                        <Form.Control
                            type="number"
                            value={quiz.points || 0}
                            onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) || 0 })}
                            style={{ width: "100px" }}
                        />
                    </div>
                </Col>
                <Col xs={6} className="text-end">
                    <div className="d-inline-flex align-items-center gap-2">
                        {quiz.published ? (
                            <>
                                <FaCheckCircle className="text-success" />
                                <span className="text-success">Published</span>
                            </>
                        ) : (
                            <>
                                <FaBan className="text-danger" />
                                <span className="text-danger">Not Published</span>
                            </>
                        )}
                    </div>
                </Col>
            </Row>

            <hr />

            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
                <Nav variant="tabs" className="mb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="details"
                            style={{
                                color: activeTab === "details" ? "black" : "#dc3545",
                                backgroundColor: activeTab === "details" ? "white" : "transparent",
                                border: activeTab === "details" ? "1px solid #dee2e6" : "none",
                                borderBottom: activeTab === "details" ? "1px solid white" : "none",
                                marginBottom: activeTab === "details" ? "-1px" : "0",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.25rem 0.25rem 0 0"
                            }}
                        >
                            Details
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="questions"
                            style={{
                                color: activeTab === "questions" ? "black" : "#dc3545",
                                backgroundColor: activeTab === "questions" ? "white" : "transparent",
                                border: activeTab === "questions" ? "1px solid #dee2e6" : "none",
                                borderBottom: activeTab === "questions" ? "1px solid white" : "none",
                                marginBottom: activeTab === "questions" ? "-1px" : "0",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.25rem 0.25rem 0 0"
                            }}
                        >
                            Questions
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="details">
                        <QuizDetailsEditor quiz={quiz} setQuiz={setQuiz} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="questions">
                        <QuizQuestionsEditor
                            quiz={quiz}
                            setQuiz={(updatedQuiz) => {
                                setQuiz(updatedQuiz);
                            }}
                        />
                    </Tab.Pane>
                </Tab.Content>

                <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleSave()}>
                        Save
                    </Button>
                    <Button variant="danger" onClick={handleSaveAndPublish}>
                        Save & Publish
                    </Button>
                </div>
            </Tab.Container>
        </div>
    );
}