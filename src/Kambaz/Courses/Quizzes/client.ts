import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const fetchQuizzesForCourse = async (courseId: string, searchTerm?: string) => {
    let url = `${QUIZZES_API}/summary/${courseId}`;
    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    const { data } = await axiosWithCredentials.get(url);

    return data.map((quiz: any) => ({
        ...quiz,
        published: quiz.published !== undefined ? quiz.published : quiz.isPublished,
        _id: quiz._id || quiz.id
    }));
};

export const fetchQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
    if (data.quiz) {
        data.quiz.published = data.quiz.isPublished;
        data.quiz.viewResponses = data.quiz.viewResponses || "Always";
        data.quiz.showCorrectAnswers = data.quiz.showCorrectAnswers || "Immediately";
        data.quiz.requireRespondusLockDownBrowser = data.quiz.requireRespondusLockDownBrowser || false;
        data.quiz.requiredToViewQuizResults = data.quiz.requiredToViewQuizResults || false;

        if (data.quiz.questions) {
            data.quiz.questions = data.quiz.questions.map((q: any) => {
                if (q.type === "MULTIPLE-CHOICE") {
                    q.choices = q.choices || [];
                    if (q.multipleAnswers === undefined) {
                        q.multipleAnswers = false;
                    }
                    if (q.multipleAnswers) {
                        q.correctChoices = Array.isArray(q.correctChoices) ? q.correctChoices : [];
                    } else {
                        q.correctChoice = q.correctChoice ?? 0;
                    }
                } else if (q.type === "FILL-IN-THE-BLANK") {
                    if (!q.blanks || q.blanks.length === 0) {
                        if (q.answers && q.answers.length > 0) {
                            q.blanks = [{
                                id: `blank-${Date.now()}`,
                                possibleAnswers: q.answers
                            }];
                        }
                    }
                }
                return q;
            });
        }
    }
    return data.quiz;
};

export const createQuiz = async (quiz: any) => {
    const processedQuestions = (quiz.questions || []).map((q: any) => {
        const question = { ...q };

        if (question.type === "MULTIPLE-CHOICE") {
            question.multipleAnswers = !!question.multipleAnswers;
            if (question.multipleAnswers) {
                question.correctChoices = Array.isArray(question.correctChoices) ? question.correctChoices : [];
                delete question.correctChoice;
            } else {
                question.correctChoice = question.correctChoice ?? 0;
                delete question.correctChoices;
            }
        } else if (question.type === "FILL-IN-THE-BLANK") {
            if (question.blanks && question.blanks.length > 0) {
                question.blanks = question.blanks.map((blank: any) => ({
                    id: blank.id || `blank-${Date.now()}-${Math.random()}`,
                    possibleAnswers: blank.possibleAnswers || []
                }));
            }
        }

        return question;
    });

    const quizToCreate = {
        ...quiz,
        questions: processedQuestions,
        isPublished: quiz.published || false,
        viewResponses: quiz.viewResponses || "Always",
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        requireRespondusLockDownBrowser: quiz.requireRespondusLockDownBrowser || false,
        requiredToViewQuizResults: quiz.requiredToViewQuizResults || false
    };

    const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/new`, quizToCreate);
    return data;
};

export const updateQuiz = async (quiz: any) => {
    const processedQuestions = (quiz.questions || []).map((q: any) => {
        const question = { ...q };

        if (question.type === "MULTIPLE-CHOICE") {
            question.multipleAnswers = !!question.multipleAnswers;
            if (question.multipleAnswers) {
                question.correctChoices = Array.isArray(question.correctChoices)
                    ? question.correctChoices.map((c: any) => Number(c))
                    : [];
                delete question.correctChoice;
            } else {
                question.correctChoice = question.correctChoice ?? 0;
                delete question.correctChoices;
            }
        } else if (question.type === "FILL-IN-THE-BLANK") {
            if (question.blanks && question.blanks.length > 0) {
                question.blanks = question.blanks.map((blank: any) => ({
                    id: blank.id || `blank-${Date.now()}-${Math.random()}`,
                    possibleAnswers: blank.possibleAnswers || []
                }));
            }
        }

        return question;
    });

    const quizToUpdate = {
        ...quiz,
        questions: processedQuestions,
        isPublished: quiz.published,
        viewResponses: quiz.viewResponses || "Always",
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        requireRespondusLockDownBrowser: quiz.requireRespondusLockDownBrowser || false,
        requiredToViewQuizResults: quiz.requiredToViewQuizResults || false
    };

    const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quizToUpdate);
    return data;
};

export const deleteQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
    return data;
};

export const publishQuiz = async (quizId: string, published: boolean) => {
    const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, { published: published });
    return data;
};

export const fetchQuestionsForQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/questions`);
    return data;
};

export const updateQuestionsForQuiz = async (quizId: string, questions: any) => {
    const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/questions`, questions);
    return data;
};

export const updateQuestion = async (quizId: string, questionId: string, question: any) => {
    const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/questions/${questionId}`, question);
    return data;
};

export const submitQuizAttempt = async (quizId: string, userId: string, answers: any, score: number, timeTakenSeconds?: number) => {
    const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/attempts/new`, {
        quizId,
        userId,
        answers,
        score,
        timeTakenSeconds
    });
    return data;
};

export const fetchQuizAttemptsForUser = async (quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/attempts/${quizId}/user/${userId}`);
    return data;
};

export const fetchQuizAttemptById = async (attemptId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/attempts/${attemptId}`);
    return data;
};

export const fetchAttemptCount = async (quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/count/${userId}`);
    return data.count;
};