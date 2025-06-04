import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../Database";
const initialState = {
    assignments: assignments,
};
const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment: (state, action) => {
            const { course } = action.payload;
            const { _id } = action.payload;

            const newAssignment = {
                _id: _id,
                title: "New Assignment",
                course: course,
                available: new Date().toISOString(),
                due: new Date().toISOString(),
                until: new Date().toISOString(),
                available_dt: new Date().toISOString(),
                due_dt: new Date().toISOString(),
                until_dt: new Date().toISOString(),
                description: "Assignment Description",
                points: 100,
            };
            state.assignments = [...state.assignments, newAssignment]
        },
        deleteAssignment: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.filter((a: any) => a._id !== assignment._id);
        },
        updateAssignment: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? { ...a, ...assignment } : a);
        },
        editAssignmentId: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? { ...a, ...assignment, _id: "A" + assignment._id } : a
            );
        },
    },
});

export const { addAssignment, deleteAssignment, updateAssignment, editAssignmentId } =
    assignmentsSlice.actions;

export default assignmentsSlice.reducer;