import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true })
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

export const fetchAllAssignments = async () => {
    try {
        const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching all assignments:", error);
        throw error;
    }
};

export const fetchAssignment = async (cid: any, aid: any) => {
    try {
        const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${cid}/${aid}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching assignment:", error);
        throw error;
    }
};

export const fetchAssignmentsForCourse = async (cid: any) => {
    try {
        const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${cid}`);
        return data;
    } catch (error: any) {
        console.error("Error fetching assignments for course:", error);
        throw error;
    }
};

export const createAssignment = async (cid: string, assignment: any) => {
    try {
        const { data } = await axiosWithCredentials.post(`${ASSIGNMENTS_API}/${cid}`, assignment);
        return data;
    } catch (error: any) {
        console.error("Error creating assignment:", error);
        throw error;
    }
};

export const updateAssignment = async (assignment: { _id: string;[key: string]: any }) => {
    try {
        const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
        return data;
    } catch (error: unknown) {
        console.error("Error updating assignment:", error);
        throw error;
    }
};

export const deleteAssignment = async (cid: any, aid: any) => {
    try {
        const { data } = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${cid}/${aid}`);
        return data;
    } catch (error: any) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
};