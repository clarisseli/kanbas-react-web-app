import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import MultipleChoiceEditor from "./QuestionTypes/MultipleChoiceEditor";
import TrueFalseEditor from "./QuestionTypes/TrueFalseEditor";
import FillInBlankEditor from "./QuestionTypes/FillInBlankEditor";
import { type Quiz, type Question, type QuestionType, createNewQuestion } from "./types";

interface QuizQuestionsEditorProps {
    quiz: Quiz;
    setQuiz: (quiz: Quiz) => void;
}

export default function QuizQuestionsEditor({ quiz, setQuiz }: QuizQuestionsEditorProps) {
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    const handleAddQuestion = (type: QuestionType = "MULTIPLE-CHOICE") => {
        const newQuestion = createNewQuestion(type);
        newQuestion.title = `Question ${quiz.questions.length + 1}`;
        newQuestion.description = "New question";

        const updatedQuestions = [...quiz.questions, newQuestion];
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleUpdateQuestion = (questionId: string, updatedQuestion: Question) => {
        const updatedQuestions = quiz.questions.map(q =>
            q.id === questionId ? updatedQuestion : q
        );
        const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
        setQuiz({ ...quiz, questions: updatedQuestions, points: totalPoints });
        setEditingQuestionId(null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            const updatedQuestions = quiz.questions.filter(q => q.id !== questionId);
            const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
            setQuiz({ ...quiz, questions: updatedQuestions, points: totalPoints });
        }
    };

    const handleCancelEdit = () => {
        setEditingQuestionId(null);
    };

    const handleChangeQuestionType = (questionId: string, newType: QuestionType) => {
        const question = quiz.questions.find(q => q.id === questionId);
        if (!question) return;

        const newQuestion = createNewQuestion(newType);
        newQuestion.id = question.id;
        newQuestion.title = question.title;
        newQuestion.points = question.points;
        newQuestion.description = question.description;

        const updatedQuestions = quiz.questions.map(q =>
            q.id === questionId ? newQuestion : q
        );
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const getQuestionTypeLabel = (type: QuestionType) => {
        switch (type) {
            case "MULTIPLE-CHOICE": return "Multiple Choice";
            case "TRUE-FALSE": return "True/False";
            case "FILL-IN-THE-BLANK": return "Fill in the Blank";
            default: return type;
        }
    };

    const renderQuestionEditor = (question: Question) => {
        const commonProps = {
            question,
            onSave: (updatedQuestion: Question) => handleUpdateQuestion(question.id, updatedQuestion),
            onCancel: () => handleCancelEdit(),
            onTypeChange: (newType: QuestionType) => handleChangeQuestionType(question.id, newType)
        };

        switch (question.type) {
            case "MULTIPLE-CHOICE":
                return <MultipleChoiceEditor {...commonProps} />;
            case "TRUE-FALSE":
                return <TrueFalseEditor {...commonProps} />;
            case "FILL-IN-THE-BLANK":
                return <FillInBlankEditor {...commonProps} />;
        }
    };

    const stripHtmlTags = (html: string): string => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };

    const renderQuestionPreview = (question: Question, index: number) => {
        const getAnswerPreview = () => {
            switch (question.type) {
                case "MULTIPLE-CHOICE":
                    if (question.choices && question.choices.length > 0) {
                        return (
                            <div className="mt-2 text-muted small">
                                {question.choices.map((choice, idx) => {
                                    const isCorrect = question.multipleAnswers
                                        ? (question.correctChoices || []).includes(idx)
                                        : idx === question.correctChoice;
                                    return (
                                        <div key={idx}>
                                            {isCorrect && "✓ "}
                                            {String.fromCharCode(97 + idx)}) {choice || `Option ${idx + 1}`}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                    return <div className="text-muted small mt-2">No answers defined</div>;

                case "TRUE-FALSE":
                    return (
                        <div className="mt-2 text-muted small">
                            Correct answer: {question.correctAnswer ? "True" : "False"}
                        </div>
                    );

                case "FILL-IN-THE-BLANK":
                    if (question.blanks && question.blanks.length > 0) {
                        return (
                            <div className="mt-2 text-muted small">
                                {question.blanks.map((blank, blankIdx) => (
                                    <div key={blank.id}>
                                        Blank {blankIdx + 1}: {
                                            blank.possibleAnswers.filter(a => a.trim()).length > 0
                                                ? blank.possibleAnswers.filter(a => a.trim()).join(", ")
                                                : "No answers defined"
                                        }
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    if (question.answers && question.answers.length > 0) {
                        return (
                            <div className="mt-2 text-muted small">
                                Possible answers: {question.answers.filter(a => a.trim()).join(", ") || "None defined"}
                            </div>
                        );
                    }
                    return <div className="text-muted small mt-2">No answers defined</div>;
            }
        };

        return (
            <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-start flex-grow-1">
                        <BsGripVertical className="me-3 text-muted fs-5 mt-1" />
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                                <h6 className="mb-0 me-3">
                                    {question.title || `Question ${index + 1}`}
                                </h6>
                                <span className="badge bg-secondary">
                                    {getQuestionTypeLabel(question.type)}
                                </span>
                                <span className="ms-3 text-muted">
                                    {question.points} pts
                                </span>
                            </div>
                            <p className="mb-2">
                                {stripHtmlTags(question.description || "No question text")}
                            </p>
                            {getAnswerPreview()}
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="link"
                            size="sm"
                            className="text-secondary p-1"
                            onClick={() => setEditingQuestionId(question.id)}
                            title="Edit question"
                        >
                            <FaPencil />
                        </Button>
                        <Button
                            variant="link"
                            size="sm"
                            className="text-secondary p-1"
                            onClick={() => handleDeleteQuestion(question.id)}
                            title="Delete question"
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-end mb-4 gap-2">
                <Button
                    variant="outline-secondary"
                    onClick={() => handleAddQuestion()}
                    id="new-question-button"
                >
                    + New Question
                </Button>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-secondary"
                        id="question-type-dropdown"
                        className="px-2"
                    >
                        <IoEllipsisVertical className="fs-5" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Header>Add Question Type</Dropdown.Header>
                        <Dropdown.Item onClick={() => handleAddQuestion("MULTIPLE-CHOICE")}>
                            + Multiple Choice
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleAddQuestion("TRUE-FALSE")}>
                            + True/False
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleAddQuestion("FILL-IN-THE-BLANK")}>
                            + Fill in the Blank
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {quiz.questions.length === 0 ? (
                <div className="text-center py-5 bg-light rounded">
                    <p className="text-muted mb-3">No questions yet</p>
                    <p className="text-muted">Questions you add will appear here</p>
                </div>
            ) : (
                <div className="border rounded bg-white">
                    {quiz.questions.map((question, index) => (
                        <div key={question.id}>
                            {editingQuestionId === question.id ? (
                                <div className="p-3 bg-light">
                                    {renderQuestionEditor(question)}
                                </div>
                            ) : (
                                renderQuestionPreview(question, index)
                            )}
                        </div>
                    ))}
                </div>
            )}

            {quiz.questions.length > 0 && (
                <div className="mt-4 pt-3 border-top text-muted">
                    <p className="mb-0">
                        <small>
                            Tips: Click the pencil icon to edit a question.
                            Questions are automatically saved when you click "Update Question".
                        </small>
                    </p>
                </div>
            )}
        </div>
    );
}