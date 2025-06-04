import { Link } from "react-router-dom";
import { Row, Col, Card, FormControl, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addNewCourse, deleteCourse, updateCourse } from "./Courses/reducer"
import { v4 as uuidv4 } from 'uuid';
import { enroll, unenroll } from "./enrollmentReducer";

export default function Dashboard() {
    const newCourse = {
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        description: "New Description",
        image: "images/reactjs.jpg"
    };
    const { courses } = useSelector((state: any) => state.coursesReducer);
    const [course, setCourse] = useState(newCourse);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
    const [showAll, setShowAll] = useState(false);
    const dispatch = useDispatch();
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard
                {currentUser.role !== "FACULTY" &&
                    <Button className="float-end" onClick={() => setShowAll(!showAll)}>
                        Enrollments
                    </Button>}
            </h1><hr />
            {currentUser.role === "FACULTY" && (
                <div>
                    <h5>New Course
                        <Button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={() => {
                                const updatedCourse = { ...course, _id: uuidv4(), image: "images/reactjs.jpg" }
                                setCourse(updatedCourse)
                                dispatch(addNewCourse({ course: updatedCourse }))
                                dispatch(enroll({ user: currentUser, course: updatedCourse }))
                            }}> Add </Button>
                        <Button className="btn btn-warning float-end me-2"
                            id="wd-update-course-click"
                            onClick={() => dispatch(updateCourse({ course }))} >
                            Update
                        </Button>
                    </h5>
                    <br />
                    <FormControl value={course.name} className="mb-2"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <FormControl value={course.description} as="textarea" rows={3}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                    <hr />
                </div>
            )}

            <h2 id="wd-dashboard-published">
                Published Courses ({
                    showAll
                        ? courses.length
                        : courses.filter((course: any) =>
                            enrollments.some(
                                (enrollment: any) =>
                                    enrollment.user === currentUser._id &&
                                    enrollment.course === course._id
                            )
                        ).length
                })
            </h2>
            <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses.filter((course: any) =>
                        showAll || enrollments.some(
                            (enrollment: any) =>
                                enrollment.user === currentUser._id &&
                                enrollment.course === course._id
                        ))
                        .map((course: any) => (
                            <Col className="wd-dashboard-course" style={{ width: "300px" }} key={course._id}>
                                <Card>
                                    <Link to={`/Kambaz/Courses/${course._id}/Home`}
                                        className="wd-dashboard-course-link text-decoration-none text-dark" >
                                        <Card.Img variant="top" src="images/reactjs.jpg" width="100%" height={160} /><br />
                                        <div className="card-body">
                                            <h5 className="wd-dashboard-course-title card-title overflow-hidden text-nowrap">
                                                {course.name} </h5>
                                            <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 50 }}>
                                                {course.description} </p>
                                            <Button className="btn btn-primary wd-go-button me-2"> Go </Button>
                                            {currentUser.role === "FACULTY" &&
                                                <>
                                                    <Button onClick={(event) => {
                                                        event.preventDefault();
                                                        dispatch(deleteCourse({ courseId: course._id }));
                                                    }} className="btn btn-danger wd-card-delete-button float-end"
                                                        id="wd-delete-course-click">
                                                        Delete
                                                    </Button>
                                                    <Button id="wd-edit-course-click"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setCourse(course)
                                                        }}
                                                        className="btn btn-warning me-2 wd-card-edit-button float-end" >
                                                        Edit
                                                    </Button>
                                                </>}
                                            {currentUser.role !== "FACULTY" && (
                                                enrollments.some((enrollment: any) => enrollment.user === currentUser._id && enrollment.course === course._id) ?
                                                    <Button className="btn btn-danger wd-card-delete-button" onClick={(e) => {
                                                        e.preventDefault();
                                                        dispatch(unenroll({ user: currentUser, course: course }))
                                                    }
                                                    }>Unenroll</Button>
                                                    :
                                                    <Button className="btn btn-success wd-card-delete-button" onClick={(e) => {
                                                        e.preventDefault();
                                                        dispatch(enroll({ user: currentUser, course: course }))
                                                    }}>Enroll</Button>
                                            )}
                                        </div>
                                    </Link>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </div>
        </div>
    );
}