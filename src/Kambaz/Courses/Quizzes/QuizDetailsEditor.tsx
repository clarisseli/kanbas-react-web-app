import { Form, Row, Col } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import type { AssignmentGroup, Quiz, QuizType } from "./types";

const SimpleToolbar = ({ onAction }: { onAction: (action: string, value?: string) => void }) => {
    return (
        <div className="d-flex flex-wrap gap-1 p-2 border-bottom bg-light">
            <button
                type="button"
                onClick={() => onAction('bold')}
                className="btn btn-sm btn-outline-secondary"
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => onAction('italic')}
                className="btn btn-sm btn-outline-secondary"
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onClick={() => onAction('underline')}
                className="btn btn-sm btn-outline-secondary"
                title="Underline"
            >
                <u>U</u>
            </button>
            <div className="vr mx-1" />
            <button
                type="button"
                onClick={() => onAction('formatBlock', 'h1')}
                className="btn btn-sm btn-outline-secondary"
                title="Heading 1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => onAction('formatBlock', 'h2')}
                className="btn btn-sm btn-outline-secondary"
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => onAction('formatBlock', 'h3')}
                className="btn btn-sm btn-outline-secondary"
                title="Heading 3"
            >
                H3
            </button>
            <button
                type="button"
                onClick={() => onAction('formatBlock', 'p')}
                className="btn btn-sm btn-outline-secondary"
                title="Paragraph"
            >
                P
            </button>
            <div className="vr mx-1" />
            <button
                type="button"
                onClick={() => onAction('insertUnorderedList')}
                className="btn btn-sm btn-outline-secondary"
                title="Bullet List"
            >
                • List
            </button>
            <button
                type="button"
                onClick={() => onAction('insertOrderedList')}
                className="btn btn-sm btn-outline-secondary"
                title="Numbered List"
            >
                1. List
            </button>
            <div className="vr mx-1" />
            <button
                type="button"
                onClick={() => onAction('createLink')}
                className="btn btn-sm btn-outline-secondary"
                title="Insert Link"
            >
                🔗 Link
            </button>
            <button
                type="button"
                onClick={() => onAction('removeFormat')}
                className="btn btn-sm btn-outline-secondary"
                title="Clear Formatting"
            >
                Clear
            </button>
        </div>
    );
};

interface QuizDetailsEditorProps {
    quiz: Quiz;
    setQuiz: (quiz: Quiz) => void;
}

export default function QuizDetailsEditor({ quiz, setQuiz }: QuizDetailsEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    useEffect(() => {
        if (editorRef.current && !isInitialized) {
            if (quiz.description) {
                editorRef.current.innerHTML = quiz.description;
            } else {
                editorRef.current.innerHTML = '<p>Enter quiz instructions here...</p>';
            }
            setIsInitialized(true);
        }
    }, [quiz.description, isInitialized]);

    const handleEditorAction = (action: string, value?: string) => {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (action === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        } else if (value) {
            document.execCommand(action, false, value);
        } else {
            document.execCommand(action, false);
        }

        editorRef.current?.focus();
        if (range && selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        handleEditorChange();
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            if (content !== quiz.description) {
                handleChange("description", content);
            }
        }
    };

    const handleEditorFocus = () => {
        setIsEditorFocused(true);
        if (editorRef.current && editorRef.current.innerHTML === '<p>Enter quiz instructions here...</p>') {
            editorRef.current.innerHTML = '';
        }
    };

    const handleEditorBlur = () => {
        setIsEditorFocused(false);
        if (editorRef.current && editorRef.current.innerHTML.trim() === '') {
            editorRef.current.innerHTML = '<p>Enter quiz instructions here...</p>';
        }
    };

    return (
        <div className="container-fluid">
            <Row>
                <Col xs={12} md={10}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                value={quiz.title}
                                placeholder="Quiz Title"
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Quiz Instructions</Form.Label>
                            <div className={`border rounded ${isEditorFocused ? 'border-primary' : ''}`}>
                                <SimpleToolbar onAction={handleEditorAction} />
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="p-3"
                                    style={{
                                        minHeight: '200px',
                                        backgroundColor: 'white',
                                        outline: 'none'
                                    }}
                                    onInput={handleEditorChange}
                                    onFocus={handleEditorFocus}
                                    onBlur={handleEditorBlur}
                                />
                            </div>
                        </Form.Group>

                        <Row className="mb-3 align-items-center">
                            <Col xs={12} sm={3} className="text-sm-end">
                                <Form.Label className="mb-0">Quiz Type</Form.Label>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Select
                                    value={quiz.type}
                                    onChange={(e) => handleChange("type", e.target.value as QuizType)}
                                >
                                    <option value="Graded Quiz">Graded Quiz</option>
                                    <option value="Practice Quiz">Practice Quiz</option>
                                    <option value="Graded Survey">Graded Survey</option>
                                    <option value="Ungraded Survey">Ungraded Survey</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={12} sm={3} className="text-sm-end">
                                <Form.Label className="mb-0">Assignment Group</Form.Label>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Select
                                    value={quiz.assignmentGroup}
                                    onChange={(e) => handleChange("assignmentGroup", e.target.value as AssignmentGroup)}
                                >
                                    <option value="Quizzes">Quizzes</option>
                                    <option value="Exams">Exams</option>
                                    <option value="Assignments">Assignments</option>
                                    <option value="Project">Project</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} sm={3} className="text-sm-end">
                                <Form.Label className="mb-0">Options</Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Shuffle Answers"
                                        checked={quiz.shuffleAnswers}
                                        onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
                                    />
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Time Limit"
                                        checked={quiz.timeLimit > 0}
                                        onChange={(e) => handleChange("timeLimit", e.target.checked ? 20 : 0)}
                                        className="me-3"
                                    />
                                    <Form.Control
                                        type="number"
                                        style={{ width: "80px" }}
                                        value={quiz.timeLimit}
                                        onChange={(e) => handleChange("timeLimit", parseInt(e.target.value) || 0)}
                                        className="me-2"
                                    />
                                    <span>Minutes</span>
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Allow Multiple Attempts"
                                        checked={quiz.multipleAttempts}
                                        onChange={(e) => handleChange("multipleAttempts", e.target.checked)}
                                    />
                                    {quiz.multipleAttempts && (
                                        <div className="d-flex align-items-center mt-2 ms-4">
                                            <Form.Label className="mb-0 me-2">How Many Attempts</Form.Label>
                                            <Form.Control
                                                type="number"
                                                style={{ width: "80px" }}
                                                value={quiz.howManyAttempts}
                                                onChange={(e) => handleChange("howManyAttempts", parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <Form.Label className="mb-0 me-3" style={{ minWidth: "150px" }}>View Responses</Form.Label>
                                    <Form.Select
                                        style={{ width: "150px" }}
                                        value={quiz.viewResponses}
                                        onChange={(e) => handleChange("viewResponses", e.target.value)}
                                    >
                                        <option value="Always">Always</option>
                                        <option value="Never">Never</option>
                                    </Form.Select>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <Form.Label className="mb-0 me-3" style={{ minWidth: "150px" }}>Show Correct Answers</Form.Label>
                                    <Form.Select
                                        style={{ width: "150px" }}
                                        value={quiz.showCorrectAnswers}
                                        onChange={(e) => handleChange("showCorrectAnswers", e.target.value)}
                                    >
                                        <option value="Immediately">Immediately</option>
                                        <option value="Never">Never</option>
                                    </Form.Select>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <Form.Label className="mb-0 me-3" style={{ minWidth: "150px" }}>Access Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Leave blank for no code"
                                        value={quiz.accessCode}
                                        onChange={(e) => handleChange("accessCode", e.target.value)}
                                        style={{ maxWidth: "250px" }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="One Question at a Time"
                                        checked={quiz.oneQuestionAtTime}
                                        onChange={(e) => handleChange("oneQuestionAtTime", e.target.checked)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Require Respondus LockDown Browser"
                                        checked={quiz.requireRespondusLockDownBrowser}
                                        onChange={(e) => handleChange("requireRespondusLockDownBrowser", e.target.checked)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Required to View Quiz Results"
                                        checked={quiz.requiredToViewQuizResults}
                                        onChange={(e) => handleChange("requiredToViewQuizResults", e.target.checked)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Webcam Required"
                                        checked={quiz.webcamRequired}
                                        onChange={(e) => handleChange("webcamRequired", e.target.checked)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Lock Questions After Answering"
                                        checked={quiz.lockQuestionsAfterAnswering}
                                        onChange={(e) => handleChange("lockQuestionsAfterAnswering", e.target.checked)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-start">
                            <Col xs={12} sm={3} className="text-sm-end">
                                <Form.Label className="mb-0 pt-2">Assign</Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <div className="border rounded p-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Assign to</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value="Everyone"
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Due</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={new Date(quiz.dueDate).toISOString().slice(0, 16)}
                                            onChange={(e) => handleChange("dueDate", e.target.value)}
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col xs={12} sm={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Available from</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={new Date(quiz.availableFrom).toISOString().slice(0, 16)}
                                                    onChange={(e) => handleChange("availableFrom", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Until</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={new Date(quiz.availableUntil).toISOString().slice(0, 16)}
                                                    onChange={(e) => handleChange("availableUntil", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}