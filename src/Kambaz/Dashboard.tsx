import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setEnrollments } from "./enrollmentReducer";
import * as enrollmentsClient from "./enrollmentsClient";

export default function Dashboard({ courses, course, allCourses, setCourse, addNewCourse,
    deleteCourse, updateCourse, fetchCourses, fetchAllCourses }: {
        courses: any[]; course: any; allCourses: any;
        setCourse: (course: any) => void;
        addNewCourse: () => void;
        deleteCourse: (course: any) => void;
        updateCourse: () => void;
        fetchCourses: () => void;
        fetchAllCourses: () => void;
    }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
    const [showAll, setShowAll] = useState(false);
    const dispatch = useDispatch();
    const isEnrolled = (courseId: any) => enrollments.some(
        (enrollment: any) => enrollment.user === currentUser._id && enrollment.course === courseId
    );
    const coursesToShow = (() => {
        if (currentUser?.role === "FACULTY") {
            return courses;
        } else if (currentUser?.role === "STUDENT") {
            if (showAll) {
                return allCourses;
            } else {
                return allCourses.filter((course: { _id: any; }) => isEnrolled(course._id));
            }
        }
        return courses;
    })();
    const fetchEnrollments = async () => {
        try {
            const enrollments = await enrollmentsClient.getEnrollments();
            dispatch(setEnrollments(enrollments))
        } catch (error) {
            console.error(error);
        }
    };
    const enrollInCourse = async (user: any, course: any) => {
        await enrollmentsClient.enroll(user._id, course._id);
        await fetchEnrollments();
        fetchCourses();
    };
    const unenrollInCourse = async (user: any, course: any) => {
        await enrollmentsClient.unenroll(user._id, course._id);
        await fetchEnrollments();
        fetchCourses();
    };
    useEffect(() => {
        fetchEnrollments();
        fetchAllCourses();
    }, []);

    useEffect(() => {
        if (currentUser?.role === "STUDENT") {
            fetchCourses();
            fetchAllCourses();
        }
    }, [showAll, enrollments, currentUser]);

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1><hr />
            {currentUser && currentUser.role === "FACULTY" && (
                <h5>New Course
                    <Button className="btn btn-primary float-end align-items-center mb-2"
                        id="wd-add-new-course-click"
                        onClick={addNewCourse} >
                        Add
                    </Button>
                    <Button className="btn btn-warning float-end me-2 mb-2"
                        id="wd-update-course-click"
                        onClick={updateCourse} >
                        Update
                    </Button>
                </h5>
            )}
            {currentUser && currentUser.role === "FACULTY" && (
                <>
                    <Form.Control value={course.name} className="mb-2"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <Form.Control as="textarea" value={course.description}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })} /> <br />
                </>
            )}

            {currentUser && currentUser.role === "STUDENT" && (
                <Button className="float-end" onClick={() => setShowAll(!showAll)}>
                    Enrollments
                </Button>)}

            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
            <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {coursesToShow
                        .map((course: any) => (
                            <Col className="wd-dashboard-course" style={{ width: "300px" }} key={course._id}>
                                <Card className="h-100">
                                    <Link to={`/Kambaz/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark" >
                                        <Card.Img variant="top" src="images/reactjs.jpg" width="100%" height={160} />
                                    </Link><br />
                                    <div className="card-body">
                                        <Link to={`/Kambaz/Courses/${course._id}/Home`}
                                            className="wd-dashboard-course-link text-decoration-none text-dark" >
                                            <h5 className="wd-dashboard-course-title card-title overflow-hidden text-nowrap">
                                                {course.name} </h5>
                                            <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ height: "50px" }}>
                                                {course.description} </p>
                                            <Button className="btn btn-primary wd-go-button me-2"> Go </Button>
                                        </Link>
                                        {currentUser && currentUser.role === "FACULTY" && (
                                            <>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteCourse(course._id);
                                                }} className="btn btn-danger wd-card-delete-button float-end"
                                                    id="wd-delete-course-click">
                                                    Delete
                                                </Button>
                                                <Button id="wd-edit-course-click"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCourse(course)
                                                    }}
                                                    className="btn btn-warning me-2 wd-card-edit-button float-end" >
                                                    Edit
                                                </Button>
                                            </>
                                        )}
                                        {currentUser && currentUser.role === "STUDENT" && showAll && isEnrolled(course._id) && (
                                            <>
                                                <Button className="btn btn-danger wd-card-delete-button" onClick={(e) => {
                                                    e.preventDefault();
                                                    unenrollInCourse(currentUser, course);
                                                }}>Unenroll
                                                </Button>
                                            </>
                                        )}
                                        {currentUser && currentUser.role === "STUDENT" && showAll && !isEnrolled(course._id) && (
                                            <>
                                                <Button className="btn btn-success wd-card-delete-button" onClick={(e) => {
                                                    e.preventDefault();
                                                    enrollInCourse(currentUser, course);
                                                }}>Enroll</Button>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </div>
        </div >
    );
}