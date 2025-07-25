import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer"
import enrollmentsReducer from "./enrollmentReducer";
import coursesReducer from "./Courses/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        accountReducer,
        assignmentsReducer,
        enrollmentsReducer,
        coursesReducer,
        quizzesReducer,
    },
});
export default store;