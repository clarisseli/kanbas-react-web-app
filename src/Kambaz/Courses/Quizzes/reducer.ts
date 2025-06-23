import { createSlice } from "@reduxjs/toolkit";
import { createNewQuiz } from "./types";

const initialState = {
    quizzes: [],
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, { payload: quizzes }) => {
            state.quizzes = quizzes;
        },
        addQuiz: (state, { payload: { course, _id } }) => {
            const newQuiz = {
                ...createNewQuiz(course),
                _id: _id || `Q${Date.now()}`
            };
            state.quizzes = [...state.quizzes, newQuiz] as any;
        },
        deleteQuiz: (state, { payload: { quizId } }) => {
            state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
        },
        updateQuiz: (state, { payload: { quiz } }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? { ...q, ...quiz } : q) as any;
        },
        publishQuiz: (state, { payload: { quizId, published } }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quizId ? { ...q, published } : q) as any;
        },
        updateQuizQuestions: (state, { payload: { quizId, questions } }) => {
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    const points = questions.reduce((sum: number, question: any) =>
                        sum + (question.points || 0), 0);
                    return { ...q, questions, points };
                }
                return q;
            }) as any;
        },
    },
});

export const {
    setQuizzes,
    addQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
    updateQuizQuestions
} = quizzesSlice.actions;

export default quizzesSlice.reducer;