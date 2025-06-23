import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer"
import enrollmentsReducer from "./enrollmentReducer";
import coursesReducer from "./Courses/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        accountReducer,
        assignmentsReducer,
        enrollmentsReducer,
        coursesReducer,
    },
});
export default store;