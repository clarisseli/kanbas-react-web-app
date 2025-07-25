import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const fetchAllCourses = async () => {
    const { data } = await axiosWithCredentials.get(COURSES_API);
    return data;
};

export const deleteCourse = async (id: string) => {
    const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
    return data;
};

export const updateCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
    return data;
};

export const getCourse = async (cid: any) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${cid}`);
    return data;
};

export const createCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.post(COURSES_API, course);
    return data;
};

export const findModulesForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
    return data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
    const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/modules`, module);
    return data;
};

export const enrollStudentForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.post(`${ENROLLMENTS_API}/${courseId}`);
    return data;
};

export const unenrollStudentForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/${courseId}`);
    return data;
};

export const getUsersForCourse = async (courseId: any) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
    return data;
};

export const uploadCourseImage = async (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append('courseImage', file);

    const response = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/image`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};