import { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import type { Question, QuestionType } from "../types";

interface TrueFalseEditorProps {
    question: Question;
    onSave: (question: Question) => void;
    onCancel: () => void;
    onTypeChange: (newType: QuestionType) => void;
}

export default function TrueFalseEditor({ question, onSave, onCancel, onTypeChange }: TrueFalseEditorProps) {
    const [editedQuestion, setEditedQuestion] = useState<Question>({
        ...question,
        correctAnswer: question.correctAnswer !== undefined ? question.correctAnswer : true
    });
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && !isEditorFocused) {
            editorRef.current.innerHTML = editedQuestion.description || '';
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setEditedQuestion({ ...editedQuestion, [field]: value });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as QuestionType;
        if (newType !== question.type) {
            if (window.confirm("Changing the question type will reset some question settings. Continue?")) {
                onTypeChange(newType);
            }
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleEditorChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            handleChange("description", content);
        }
    };

    const handleEditorFocus = () => {
        setIsEditorFocused(true);
    };

    const handleEditorBlur = () => {
        setIsEditorFocused(false);
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <Row className="mb-3 align-items-center">
                    <Col xs={8}>
                        <Form.Select
                            value={question.type}
                            onChange={handleTypeChange}
                            className="w-auto d-inline-block"
                        >
                            <option value="MULTIPLE-CHOICE">Multiple Choice</option>
                            <option value="TRUE-FALSE">True/False</option>
                            <option value="FILL-IN-THE-BLANK">Fill in the Blank</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                            <span>pts:</span>
                            <Form.Control
                                type="number"
                                min="0"
                                value={editedQuestion.points}
                                onChange={(e) => handleChange("points", parseInt(e.target.value) || 0)}
                                style={{ width: "80px" }}
                            />
                        </div>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Question title (optional)"
                        value={editedQuestion.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                    />
                </Form.Group>

                <p className="text-muted small mb-3">
                    Enter your question text, then select if True or False is the correct answer.
                </p>

                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Question:</Form.Label>
                    <div className="border rounded">
                        <div className="border-bottom bg-light p-2 small">
                            <span className="me-3">Edit</span>
                            <span className="me-3">View</span>
                            <span className="me-3">Insert</span>
                            <span className="me-3">Format</span>
                            <span className="me-3">Tools</span>
                            <span>Table</span>
                        </div>
                        <div className="p-2 border-bottom">
                            <div className="d-flex gap-2 align-items-center small">
                                <select className="form-select form-select-sm" style={{ width: "100px" }}>
                                    <option>12pt</option>
                                </select>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: "120px" }}
                                    onChange={(e) => execCommand('formatBlock', e.target.value)}
                                >
                                    <option value="p">Paragraph</option>
                                    <option value="h1">Heading 1</option>
                                    <option value="h2">Heading 2</option>
                                    <option value="h3">Heading 3</option>
                                </select>
                                <div className="d-flex gap-1">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light"
                                        onClick={() => execCommand('bold')}
                                    >
                                        <strong>B</strong>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light"
                                        onClick={() => execCommand('italic')}
                                    >
                                        <em>I</em>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light"
                                        onClick={() => execCommand('underline')}
                                    >
                                        <u>U</u>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            ref={editorRef}
                            contentEditable
                            className="p-3"
                            style={{
                                minHeight: '4.5rem',
                                outline: 'none',
                                whiteSpace: 'pre-wrap'
                            }}
                            onInput={handleEditorChange}
                            onFocus={handleEditorFocus}
                            onBlur={handleEditorBlur}
                            data-placeholder="Is it true that 2 + 2 = 4?"
                        />
                    </div>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="fw-bold">Answers:</Form.Label>

                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="answer-true"
                            name={`tf-${editedQuestion.id}`}
                            checked={editedQuestion.correctAnswer === true}
                            onChange={() => handleChange("correctAnswer", true)}
                            label={
                                <span className={editedQuestion.correctAnswer === true ? "text-success fw-bold" : ""}>
                                    True
                                </span>
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="answer-false"
                            name={`tf-${editedQuestion.id}`}
                            checked={editedQuestion.correctAnswer === false}
                            onChange={() => handleChange("correctAnswer", false)}
                            label={
                                <span className={editedQuestion.correctAnswer === false ? "text-success fw-bold" : ""}>
                                    False
                                </span>
                            }
                        />
                    </div>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                    <Button variant="light" onClick={onCancel} className="px-4">
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => onSave(editedQuestion)}
                        disabled={!editedQuestion.description.trim()}
                        className="px-4"
                    >
                        Update Question
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}