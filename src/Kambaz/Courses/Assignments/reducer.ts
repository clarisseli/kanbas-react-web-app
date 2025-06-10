import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    assignments: [],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, { payload: assignments }) => {
            state.assignments = assignments;
        },
        addAssignment: (state, action) => {
            const { course } = action.payload;
            const { _id } = action.payload;

            const newAssignment: any = {
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
            state.assignments = [...state.assignments, newAssignment] as any;
        },
        deleteAssignment: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.filter((a: any) => a._id !== assignment._id);
        },
        updateAssignment: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? { ...a, ...assignment } : a) as any;
        },
        editAssignmentId: (state, { payload: { assignment } }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? { ...a, ...assignment, _id: "A" + assignment._id } : a
            ) as any;
        },
    },
});

export const { setAssignments, addAssignment, deleteAssignment, updateAssignment, editAssignmentId } =
    assignmentsSlice.actions;

export default assignmentsSlice.reducer;