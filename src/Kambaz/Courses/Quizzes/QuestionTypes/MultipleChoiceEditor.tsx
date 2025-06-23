import { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa6";
import type { Question, QuestionType } from "../types";

interface MultipleChoiceEditorProps {
    question: Question;
    onSave: (question: Question) => void;
    onCancel: () => void;
    onTypeChange: (newType: QuestionType) => void;
}

export default function MultipleChoiceEditor({ question, onSave, onCancel, onTypeChange }: MultipleChoiceEditorProps) {
    const [editedQuestion, setEditedQuestion] = useState<Question>(() => {
        const initialQuestion = {
            ...question,
            choices: question.choices?.length ? question.choices : ["", ""],
            multipleAnswers: question.multipleAnswers || false
        };

        if (initialQuestion.multipleAnswers) {
            initialQuestion.correctChoices = question.correctChoices || [];
        } else {
            initialQuestion.correctChoice = question.correctChoice ?? 0;
        }

        return initialQuestion;
    });

    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && !isEditorFocused && editedQuestion.description) {
            editorRef.current.innerHTML = editedQuestion.description;
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setEditedQuestion(prev => ({ ...prev, [field]: value }));
    };

    const handleAddChoice = () => {
        const newChoices = [...(editedQuestion.choices || []), ""];
        handleChange("choices", newChoices);
    };

    const handleUpdateChoice = (index: number, value: string) => {
        const newChoices = [...(editedQuestion.choices || [])];
        newChoices[index] = value;
        handleChange("choices", newChoices);
    };

    const handleDeleteChoice = (index: number) => {
        if (!editedQuestion.choices || editedQuestion.choices.length <= 2) return;

        const newChoices = editedQuestion.choices.filter((_, i) => i !== index);
        const updatedQuestion = { ...editedQuestion, choices: newChoices };

        if (editedQuestion.multipleAnswers) {
            const newCorrectChoices = (editedQuestion.correctChoices || [])
                .map(choiceIndex => {
                    if (choiceIndex === index) return -1;
                    if (choiceIndex > index) return choiceIndex - 1;
                    return choiceIndex;
                })
                .filter(choiceIndex => choiceIndex !== -1);
            updatedQuestion.correctChoices = newCorrectChoices;
        } else {
            if (editedQuestion.correctChoice === index) {
                updatedQuestion.correctChoice = 0;
            } else if (editedQuestion.correctChoice !== undefined && editedQuestion.correctChoice > index) {
                updatedQuestion.correctChoice = editedQuestion.correctChoice - 1;
            }
        }

        setEditedQuestion(updatedQuestion);
    };

    const handleToggleCorrect = (index: number) => {
        if (editedQuestion.multipleAnswers) {
            const currentChoices = editedQuestion.correctChoices || [];
            let newCorrectChoices;

            if (currentChoices.includes(index)) {
                newCorrectChoices = currentChoices.filter(i => i !== index);
            } else {
                newCorrectChoices = [...currentChoices, index];
            }

            handleChange("correctChoices", newCorrectChoices);
        } else {
            handleChange("correctChoice", index);
        }
    };

    const handleMultipleAnswersToggle = (checked: boolean) => {
        const updatedQuestion = { ...editedQuestion, multipleAnswers: checked };

        if (checked) {
            updatedQuestion.correctChoices = editedQuestion.correctChoice !== undefined
                ? [editedQuestion.correctChoice]
                : [];
            delete updatedQuestion.correctChoice;
        } else {
            updatedQuestion.correctChoice = (editedQuestion.correctChoices && editedQuestion.correctChoices.length > 0)
                ? editedQuestion.correctChoices[0]
                : 0;
            delete updatedQuestion.correctChoices;
        }

        setEditedQuestion(updatedQuestion);
    };

    const isCorrect = (index: number) => {
        if (editedQuestion.multipleAnswers) {
            return (editedQuestion.correctChoices || []).includes(index);
        } else {
            return editedQuestion.correctChoice === index;
        }
    };

    const handleSave = () => {
        const questionToSave = { ...editedQuestion };

        if (editedQuestion.multipleAnswers) {
            if (!questionToSave.correctChoices || questionToSave.correctChoices.length === 0) {
                questionToSave.correctChoices = [0];
            }
        } else {
            if (questionToSave.correctChoice === undefined || questionToSave.correctChoice === null) {
                questionToSave.correctChoice = 0;
            }
        }

        onSave(questionToSave);
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

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Allow multiple correct answers"
                        checked={editedQuestion.multipleAnswers || false}
                        onChange={(e) => handleMultipleAnswersToggle(e.target.checked)}
                    />
                </Form.Group>

                <p className="text-muted small mb-3">
                    Enter your question and multiple answers, then select the {editedQuestion.multipleAnswers ? "correct answers" : "one correct answer"}.
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
                            data-placeholder="How much is 2 + 2?"
                        />
                    </div>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="fw-bold">Answers:</Form.Label>

                    {editedQuestion.choices?.map((choice, index) => (
                        <div key={`choice-${index}`} className="mb-3 d-flex align-items-start gap-2">
                            <div style={{ minWidth: "120px" }}>
                                <Form.Check
                                    type={editedQuestion.multipleAnswers ? "checkbox" : "radio"}
                                    id={`choice-${index}-${editedQuestion.id}`}
                                    name={editedQuestion.multipleAnswers ? undefined : `correct-${editedQuestion.id}`}
                                    checked={isCorrect(index)}
                                    onChange={() => handleToggleCorrect(index)}
                                    label={
                                        <span className={isCorrect(index) ? "text-success fw-bold" : ""}>
                                            {isCorrect(index) ? "Correct Answer" : "Possible Answer"}
                                        </span>
                                    }
                                />
                            </div>

                            <Form.Control
                                type="text"
                                placeholder={`Answer ${index + 1}`}
                                value={choice}
                                onChange={(e) => handleUpdateChoice(index, e.target.value)}
                                className="flex-grow-1"
                                style={{ maxWidth: "400px" }}
                            />

                            <Button
                                variant="link"
                                className="text-muted p-1"
                                onClick={() => handleDeleteChoice(index)}
                                disabled={(editedQuestion.choices?.length || 0) <= 2}
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    ))}

                    <Button
                        variant="link"
                        className="text-decoration-none ps-0 text-danger"
                        onClick={handleAddChoice}
                    >
                        <FaPlus className="me-2" />
                        Add Another Answer
                    </Button>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                    <Button variant="light" onClick={onCancel} className="px-4">
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSave}
                        disabled={
                            !editedQuestion.description?.trim() ||
                            !editedQuestion.choices?.some(c => c.trim()) ||
                            (editedQuestion.multipleAnswers
                                ? !editedQuestion.correctChoices || editedQuestion.correctChoices.length === 0
                                : false)
                        }
                        className="px-4"
                    >
                        Update Question
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}