import { FaAlignJustify, FaRocket } from "react-icons/fa";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import CoursesNavigation from "./Navigation";
import Home from "./Home";
import Modules from "./Modules";
import PeopleTable from "./People/Table";
import { getUsersForCourse } from "./client";
import { useState, useEffect } from "react";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/QuizEditor";
import QuizDetailsView from "./Quizzes/QuizDetailsView";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizTaker from "./Quizzes/QuizTaker";
import QuizResults from "./Quizzes/QuizResults";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

export default function Courses({ courses }: { courses: any[] }) {
    const { cid } = useParams();
    const course = courses.find((course: any) => course._id === cid);
    const { pathname } = useLocation();
    const [users, setUsers] = useState<any[]>([]);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [isStudentView, setIsStudentView] = useState(false);

    const fetchUsers = async () => {
        try {
            const users = await getUsersForCourse(cid);
            setUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        if (cid) {
            fetchUsers();
        }
    }, [cid]);

    const toggleStudentView = () => {
        setIsStudentView(!isStudentView);
    };

    const viewContext = {
        currentUser: isStudentView && currentUser.role === "FACULTY"
            ? { ...currentUser, role: "STUDENT" }
            : currentUser,
        isStudentView,
        originalRole: currentUser.role,
        actualUserId: currentUser._id
    };

    return (
        <div id="wd-courses">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-danger mb-0">
                    <FaAlignJustify className="me-4 fs-4 mb-1" />
                    {course && course.name} &gt; {pathname.split("/")[4]}
                </h2>
                {currentUser.role === "FACULTY" && (
                    <Button variant="light" onClick={toggleStudentView}>
                        <FaRocket className="me-2" />
                        {isStudentView ? "Exit Student View" : "Student View"}
                    </Button>
                )}
            </div>
            <hr />
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CoursesNavigation />
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="Home" element={<Home viewContext={viewContext} />} />
                        <Route path="Modules" element={<Modules viewContext={viewContext} />} />
                        <Route path="Assignments" element={<Assignments viewContext={viewContext} />} />
                        <Route path="Assignments/:aid" element={<AssignmentEditor />} />
                        <Route path="Quizzes" element={<Quizzes viewContext={viewContext} />} />
                        <Route path="Quizzes/:qid" element={<QuizEditor />} />
                        <Route path="Quizzes/:qid/results" element={<QuizResults viewContext={viewContext} />} />
                        <Route path="Quizzes/:qid/details" element={<QuizDetailsView viewContext={viewContext} />} />
                        <Route path="Quizzes/:qid/preview" element={<QuizPreview />} />
                        <Route path="Quizzes/:qid/take" element={<QuizTaker viewContext={viewContext} />} />
                        <Route path="People" element={<PeopleTable users={users} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}