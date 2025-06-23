import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses"
import "./styles.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";


export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description"
  });
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    console.log("updateEnrollment called:", { courseId, enrolled, currentUser: currentUser._id });
    try {
      if (enrolled) {
        console.log("Enrolling...");
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        console.log("Unenrolling...");
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }

      console.log("API call successful, updating state...");

      // Update both courses and allCourses state
      setCourses(courses.map((course) =>
        course._id === courseId ? { ...course, enrolled } : course
      ));

      setAllCourses(allCourses.map((course) =>
        course._id === courseId ? { ...course, enrolled } : course
      ));

      // Also refresh the courses to get updated data
      console.log("Refreshing courses...");
      await fetchCourses();
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  };
  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const courses = await userClient.findMyCourses();
      console.log("Courses fetched:", courses);
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllCourses = async () => {
    const allCourses = await courseClient.fetchAllCourses();
    setAllCourses(allCourses);
  }
  useEffect(() => {
    fetchCourses();
    fetchAllCourses();
  }, [currentUser]);

  const addNewCourse = async () => {
    const newCourse = await courseClient.createCourse(course);
    setCourses((courses) => [...courses, newCourse]);
  };
  const deleteCourse = async (courseId: any) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    }));
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kambaz/Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={
              <ProtectedRoute>
                <Dashboard
                  courses={courses}
                  course={course}
                  allCourses={allCourses}
                  setCourse={setCourse}
                  addNewCourse={addNewCourse}
                  deleteCourse={deleteCourse}
                  updateCourse={updateCourse}
                  enrolling={enrolling}
                  setEnrolling={setEnrolling}
                  updateEnrollment={updateEnrollment}
                />
              </ProtectedRoute>
            } />
            <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses} /></ProtectedRoute>} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}