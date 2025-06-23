import { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa6";
import type { Question, QuestionType } from "../types";

interface FillInBlankEditorProps {
    question: Question;
    onSave: (question: Question) => void;
    onCancel: () => void;
    onTypeChange: (newType: QuestionType) => void;
}

export default function FillInBlankEditor({ question, onSave, onCancel, onTypeChange }: FillInBlankEditorProps) {
    const [editedQuestion, setEditedQuestion] = useState<Question>({
        ...question,
        blanks: question.blanks?.length ? question.blanks : [{ id: `blank-${Date.now()}`, possibleAnswers: [""] }]
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

    const handleAddBlank = () => {
        const newBlanks = [...(editedQuestion.blanks || []), {
            id: `blank-${Date.now()}`,
            possibleAnswers: [""]
        }];
        handleChange("blanks", newBlanks);
    };

    const handleDeleteBlank = (blankIndex: number) => {
        const newBlanks = (editedQuestion.blanks || []).filter((_, i) => i !== blankIndex);
        handleChange("blanks", newBlanks);
    };

    const handleAddAnswer = (blankIndex: number) => {
        const newBlanks = [...(editedQuestion.blanks || [])];
        newBlanks[blankIndex].possibleAnswers.push("");
        handleChange("blanks", newBlanks);
    };

    const handleUpdateAnswer = (blankIndex: number, answerIndex: number, value: string) => {
        const newBlanks = [...(editedQuestion.blanks || [])];
        newBlanks[blankIndex].possibleAnswers[answerIndex] = value;
        handleChange("blanks", newBlanks);
    };

    const handleDeleteAnswer = (blankIndex: number, answerIndex: number) => {
        const newBlanks = [...(editedQuestion.blanks || [])];
        newBlanks[blankIndex].possibleAnswers = newBlanks[blankIndex].possibleAnswers.filter((_, i) => i !== answerIndex);
        handleChange("blanks", newBlanks);
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

    const insertBlankPlaceholder = (blankIndex: number) => {
        if (editorRef.current) {
            editorRef.current.focus();
            const selection = window.getSelection();
            const placeholder = ` ___${blankIndex + 1}___ `;

            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(placeholder);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                const currentContent = editorRef.current.innerHTML;
                const newContent = currentContent + (currentContent ? ' ' : '') + placeholder;
                editorRef.current.innerHTML = newContent;
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
            handleEditorChange();
        }
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
                                style={{ width: "80px" }}
                                onChange={(e) => handleChange("points", parseInt(e.target.value) || 0)}
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
                    Enter your question text and use placeholders like [blank 1], [blank 2], etc. for blanks.
                    Then define possible correct answers for each blank below.
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
                            data-placeholder="The capital of France is [blank 1] and 2 + 2 = [blank 2]."
                        />
                    </div>
                    <div className="mt-2">
                        {editedQuestion.blanks?.map((_, index) => (
                            <Button
                                key={index}
                                variant="outline-secondary"
                                size="sm"
                                className="me-2 mb-2"
                                onClick={() => insertBlankPlaceholder(index)}
                            >
                                Insert Blank {index + 1}
                            </Button>
                        ))}
                    </div>
                </Form.Group>

                <Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Label className="fw-bold mb-0">Blanks and Answers:</Form.Label>
                        <Button
                            variant="link"
                            className="text-decoration-none text-danger p-0"
                            onClick={handleAddBlank}
                        >
                            <FaPlus className="me-2" />
                            Add Blank
                        </Button>
                    </div>

                    {editedQuestion.blanks?.map((blank, blankIndex) => (
                        <div key={blank.id} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Blank {blankIndex + 1}</h6>
                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    onClick={() => handleDeleteBlank(blankIndex)}
                                    disabled={(editedQuestion.blanks?.length || 0) <= 1}
                                >
                                    <FaTrash /> Remove Blank
                                </Button>
                            </div>

                            {blank.possibleAnswers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="mb-2 d-flex align-items-center gap-2">
                                    <span style={{ minWidth: "120px" }}>Possible Answer {answerIndex + 1}</span>
                                    <Form.Control
                                        type="text"
                                        value={answer}
                                        placeholder={blankIndex === 0 && answerIndex === 0 ? "Paris" : `Answer ${answerIndex + 1}`}
                                        onChange={(e) => handleUpdateAnswer(blankIndex, answerIndex, e.target.value)}
                                        className="flex-grow-1"
                                        style={{ maxWidth: "400px" }}
                                    />
                                    <Button
                                        variant="link"
                                        className="text-muted p-1"
                                        onClick={() => handleDeleteAnswer(blankIndex, answerIndex)}
                                        disabled={blank.possibleAnswers.length <= 1}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                variant="link"
                                className="text-decoration-none ps-0 text-danger"
                                size="sm"
                                onClick={() => handleAddAnswer(blankIndex)}
                            >
                                + Add Another Answer for Blank {blankIndex + 1}
                            </Button>
                        </div>
                    ))}

                    <p className="text-muted small mt-2">
                        <em>Note: Answers are case insensitive</em>
                    </p>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                    <Button variant="light" onClick={onCancel} className="px-4">
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className="px-4"
                        onClick={() => onSave(editedQuestion)}
                        disabled={
                            !editedQuestion.description.trim() ||
                            !editedQuestion.blanks?.every(blank =>
                                blank.possibleAnswers.some(answer => answer.trim())
                            )
                        }
                    >
                        Update Question
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}