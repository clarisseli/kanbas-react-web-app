import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Dashboard({ courses, course, allCourses, setCourse, addNewCourse,
    deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment }: {
        courses: any[]; course: any; allCourses: any;
        setCourse: (course: any) => void;
        addNewCourse: () => void;
        deleteCourse: (course: any) => void;
        updateCourse: () => void;
        enrolling: boolean;
        setEnrolling: (enrolling: boolean) => void;
        updateEnrollment: (courseId: string, enrolled: boolean) => void;
    }
) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [showAll, setShowAll] = useState(false);

    const isEnrolled = (courseId: any) => {
        const found = courses.find((course: any) => course._id === courseId);
        console.log("isEnrolled check:", { courseId, found, courses });
        return found;
    };
    const [coursesToShow, setCoursesToShow] = useState<any[]>([]);

    useEffect(() => {
        if (enrolling) {
            const coursesWithEnrollmentStatus = allCourses.map((course: any) => ({
                ...course,
                enrolled: isEnrolled(course._id) ? true : false
            }));
            setCoursesToShow(coursesWithEnrollmentStatus);
        } else {
            setCoursesToShow(showAll ? allCourses : courses);
        }
    }, [courses, allCourses, showAll, enrolling]);

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard
                {currentUser && currentUser.role === "STUDENT" && (
                    <Button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary">
                        {enrolling ? "Display My Courses" : "Display All Courses"}
                    </Button>
                )}
            </h1><hr />

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

            {currentUser && currentUser.role === "STUDENT" && !enrolling && (
                <Button className="float-end" onClick={() => setShowAll(!showAll)}>
                    Enrollments
                </Button>
            )}

            <h2 id="wd-dashboard-published">
                Published Courses ({
                    enrolling ? allCourses.length : courses.length
                })
            </h2> <hr />
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
                                                {course.name}
                                            </h5>
                                            <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ height: "50px" }}>
                                                {course.description} </p>
                                            <Button className="btn btn-primary wd-go-button me-2"> Go </Button>
                                        </Link>
                                        {enrolling && currentUser && currentUser.role === "STUDENT" && (
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    updateEnrollment(course._id, !course.enrolled);
                                                }}
                                                className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} wd-card-delete-button float-end`}>
                                                {course.enrolled ? "Unenroll" : "Enroll"}
                                            </Button>
                                        )}
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
                                        {currentUser && currentUser.role === "STUDENT" && showAll && !enrolling && isEnrolled(course._id) && (
                                            <>
                                                <Button className="btn btn-danger wd-card-delete-button float-end" onClick={(e) => {
                                                    e.preventDefault();
                                                    updateEnrollment(course._id, false);
                                                }}>Unenroll
                                                </Button>
                                            </>
                                        )}
                                        {currentUser && currentUser.role === "STUDENT" && showAll && !enrolling && !isEnrolled(course._id) && (
                                            <>
                                                <Button className="btn btn-success wd-card-delete-button float-end" onClick={(e) => {
                                                    e.preventDefault();
                                                    updateEnrollment(course._id, true);
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