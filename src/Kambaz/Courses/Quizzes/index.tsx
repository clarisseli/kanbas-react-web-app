import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ListGroup, Dropdown } from "react-bootstrap";
import { FaCheckCircle, FaBan, FaCaretDown, FaRocket } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as client from "./client";
import { type Quiz } from "./types";
import { IoEllipsisVertical } from "react-icons/io5";
import QuizControls from "./QuizControls";

export default function Quizzes({ viewContext }: { viewContext?: any }) {
    const { cid } = useParams();
    const navigate = useNavigate();
    const reduxCurrentUser = useSelector((state: any) => state.accountReducer);
    const currentUser = viewContext?.currentUser || reduxCurrentUser;
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchQuizzes = useCallback(async (search?: string) => {
        if (!cid) return;
        try {
            setLoading(true);
            const fetchedQuizzes = await client.fetchQuizzesForCourse(cid, search);
            const sortedQuizzes = fetchedQuizzes.sort((a: Quiz, b: Quiz) =>
                new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime()
            );
            setQuizzes(sortedQuizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    }, [cid]);

    useEffect(() => {
        fetchQuizzes();
    }, [cid, fetchQuizzes]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== "") {
                fetchQuizzes(searchTerm);
            } else {
                fetchQuizzes();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, fetchQuizzes]);

    const handleEditQuiz = (quizId: string | undefined) => {
        if (!quizId) {
            console.error("Quiz ID is missing");
            return;
        }
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    };

    const handleDeleteQuiz = async (quizId: string | undefined) => {
        if (!quizId) {
            console.error("Quiz ID is missing");
            return;
        }
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            try {
                await client.deleteQuiz(quizId);
                await fetchQuizzes();
            } catch (error) {
                console.error("Error deleting quiz:", error);
            }
        }
    };

    const handlePublishToggle = async (quiz: Quiz) => {
        const quizId = quiz._id || quiz.id;
        if (!quizId) {
            console.error("Quiz ID is missing");
            return;
        }
        try {
            await client.publishQuiz(quizId, !quiz.published);
            setQuizzes(prevQuizzes =>
                prevQuizzes.map(q =>
                    (q._id === quizId || q.id === quizId)
                        ? { ...q, published: !quiz.published }
                        : q
                )
            );
            await fetchQuizzes();
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    };

    const getAvailabilityStatus = (quiz: Quiz) => {
        const now = new Date();
        const availableFrom = new Date(quiz.availableFrom);
        const availableUntil = new Date(quiz.availableUntil);

        if (now > availableUntil) {
            return "Closed";
        }

        if (now < availableFrom) {
            return `Not available until ${availableFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${availableFrom.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        }

        return "Available";
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            ' at ' +
            d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getLastScore = (quiz: Quiz) => {
        if (!quiz.attempts || !quiz.attempts[currentUser._id]) return null;
        const userAttempts = quiz.attempts[currentUser._id];
        if (userAttempts.length === 0) return null;
        return userAttempts[userAttempts.length - 1].score;
    };

    if (loading) {
        return <div className="container-fluid px-4 py-3">Loading quizzes...</div>;
    }

    const displayQuizzes = currentUser.role === "STUDENT"
        ? quizzes.filter(quiz => quiz.published)
        : quizzes;

    return (
        <div className="container-fluid px-4 py-3" id="wd-quizzes">
            {currentUser.role === "FACULTY" && (
                <>
                    <QuizControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <hr />
                </>
            )}

            {displayQuizzes.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">
                        {currentUser.role === "STUDENT"
                            ? "No quizzes available yet."
                            : "No quizzes yet."}
                    </p>
                    {currentUser.role === "FACULTY" && (
                        <p className="text-muted">Click the "+ Quiz" button to create your first quiz.</p>
                    )}
                </div>
            ) : (
                <ListGroup className="rounded-0" id="wd-quiz-list">
                    <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-4 bg-light wd-row-center justify-content-between">
                            <div className="wd-row-center">
                                <FaCaretDown className="me-2 fs-6" />
                                <b>Assignment Quizzes</b>
                            </div>
                        </div>

                        <div id="wd-quiz-list-items">
                            {displayQuizzes.map((quiz) => {
                                const quizId = quiz._id || quiz.id || `quiz-${Math.random()}`;
                                return (
                                    <ListGroup.Item key={quizId} className="wd-lesson p-3 ps-4">
                                        <div className="wd-row-center justify-content-between">
                                            <div className="wd-row-center flex-grow-1 me-3">
                                                <FaRocket className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                                <div className="flex-grow-1">
                                                    <div className="mb-1">
                                                        <a
                                                            href={`#/Kambaz/Courses/${cid}/Quizzes/${quizId}/details`}
                                                            className="fw-bold text-dark text-decoration-none"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/details`);
                                                            }}
                                                        >
                                                            {quiz.title}
                                                        </a>
                                                    </div>
                                                    <div className="text-muted small text-wrap">
                                                        <span className="text-dark">
                                                            <strong>{getAvailabilityStatus(quiz)}</strong>
                                                        </span>
                                                        <span className="mx-1">|</span>
                                                        <strong>Due</strong> {formatDate(quiz.dueDate)}
                                                        <span className="mx-1">|</span>
                                                        {quiz.points || 0} pts
                                                        <span className="mx-1">|</span>
                                                        {quiz.questionsCount || quiz.questions?.length || 0} Questions
                                                        {currentUser.role === "STUDENT" && getLastScore(quiz) !== null && (
                                                            <>
                                                                <span className="mx-1">|</span>
                                                                Score: {getLastScore(quiz)}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                                {currentUser.role === "FACULTY" && (
                                                    <>
                                                        {quiz.published ? (
                                                            <FaCheckCircle
                                                                className="text-success"
                                                                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                onClick={() => handlePublishToggle(quiz)}
                                                                title="Published - Click to unpublish"
                                                            />
                                                        ) : (
                                                            <FaBan
                                                                className="text-danger"
                                                                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                onClick={() => handlePublishToggle(quiz)}
                                                                title="Unpublished - Click to publish"
                                                            />
                                                        )}

                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                as="button"
                                                                className="btn btn-link text-muted p-0 border-0"
                                                                style={{ boxShadow: "none" }}
                                                            >
                                                                <IoEllipsisVertical style={{ fontSize: "24px" }} />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu align="end">
                                                                <Dropdown.Item onClick={() => handleEditQuiz(quizId)}>
                                                                    Edit
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleDeleteQuiz(quizId)}>
                                                                    Delete
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handlePublishToggle(quiz)}>
                                                                    {quiz.published ? "Unpublish" : "Publish"}
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item disabled>Copy</Dropdown.Item>
                                                                <Dropdown.Item disabled>Sort</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </>
                                                )}
                                                {currentUser.role === "STUDENT" && (
                                                    <FaCheckCircle
                                                        className="text-success"
                                                        style={{ fontSize: "1.2rem" }}
                                                        title="Published"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                );
                            })}
                        </div>
                    </ListGroup.Item>
                </ListGroup>
            )}
        </div>
    );
}