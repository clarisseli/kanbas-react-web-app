export type QuestionType = "MULTIPLE-CHOICE" | "TRUE-FALSE" | "FILL-IN-THE-BLANK";
export type QuizType = "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
export type AssignmentGroup = "Quizzes" | "Exams" | "Assignments" | "Project";

export interface Blank {
    id: string;
    possibleAnswers: string[];
}

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    points: number;
    description: string;
    choices?: string[];
    correctChoice?: number;
    correctChoices?: number[];
    multipleAnswers?: boolean;
    correctAnswer?: boolean;
    answers?: string[];
    blanks?: Blank[];
}

export interface Quiz {
    _id: string;
    id?: string;
    course: string;
    title: string;
    description: string;
    type: QuizType;
    points: number;
    assignmentGroup: AssignmentGroup;
    shuffleAnswers: boolean;
    timeLimit: number;
    multipleAttempts: boolean;
    howManyAttempts: number;
    viewResponses: "Always" | "Never";
    showCorrectAnswers: "Immediately" | "Never";
    accessCode: string;
    oneQuestionAtTime: boolean;
    requireRespondusLockDownBrowser: boolean;
    requiredToViewQuizResults: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    dueDate: Date | string;
    availableFrom: Date | string;
    availableUntil: Date | string;
    published: boolean;
    questions: Question[];
    questionsCount?: number;
    attempts?: Record<string, QuizAttempt[]>;
}

export interface QuizAttempt {
    attemptId: string;
    quizId: string;
    userId: string;
    score: number;
    answers: AnswerItem[];
    submittedAt: Date | string;
    timeTakenSeconds?: number;
}

export interface AnswerItem {
    questionId: string;
    studentAnswer: string | number | boolean | string[];
    isCorrect: boolean;
    pointsEarned: number;
}

export const createNewQuestion = (type: QuestionType): Question => ({
    id: `q${Date.now()}`,
    type,
    title: "",
    points: 1,
    description: "",
    choices: type === "MULTIPLE-CHOICE" ? ["", ""] : undefined,
    correctChoice: type === "MULTIPLE-CHOICE" ? 0 : undefined,
    correctChoices: type === "MULTIPLE-CHOICE" ? [] : undefined,
    multipleAnswers: type === "MULTIPLE-CHOICE" ? false : undefined,
    correctAnswer: type === "TRUE-FALSE" ? true : undefined,
    answers: type === "FILL-IN-THE-BLANK" ? [""] : undefined,
    blanks: type === "FILL-IN-THE-BLANK" ? [{ id: `blank-${Date.now()}`, possibleAnswers: [""] }] : undefined,
});

export const createNewQuiz = (courseId: string): Partial<Quiz> => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
        course: courseId,
        title: "Unnamed Quiz",
        description: "",
        type: "Graded Quiz",
        points: 0,
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        howManyAttempts: 1,
        viewResponses: "Always",
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtTime: true,
        requireRespondusLockDownBrowser: false,
        requiredToViewQuizResults: false,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: nextWeek,
        availableFrom: now,
        availableUntil: nextWeek,
        published: false,
        questions: []
    };
};