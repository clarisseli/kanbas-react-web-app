import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enrollments: [],
};

const enrollmentSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        setEnrollments: (state, action) => {
            state.enrollments = action.payload;
        },
        enroll: (state, { payload: enrollment }) => {
            const newEnrollment: any = {
                _id: new Date().getTime().toString(),
                user: enrollment.user,
                course: enrollment.course
            };
            state.enrollments = [...state.enrollments, newEnrollment] as any;
        },
        unenroll: (state, { payload: enrollment }) => {
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === enrollment.user && e.course === enrollment.course)
            ) as any;
        },
    }
});

export const { setEnrollments, enroll, unenroll } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;