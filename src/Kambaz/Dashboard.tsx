import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import * as courseClient from "./Courses/client";

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const isEnrolled = (courseId: any) => {
        const found = courses.find((course: any) => course._id === courseId);
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

    // Helper function to get course image path
    const getCourseImage = (courseId: string) => {
        const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
        // Always try the course-specific image first
        // The onError handler will fallback to default.jpg if it doesn't exist
        return `${REMOTE_SERVER}/images/coursePics/${courseId}.jpg`;
    };

    // Handle image error to show default image
    const handleImageError = (e: any) => {
        const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
        // Fallback to default image
        e.target.src = `${REMOTE_SERVER}/images/coursePics/default.jpg`;
    };

    // Handle file upload for existing courses
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!course._id || course._id === "0") {
            return;
        }

        setUploading(true);
        try {
            const result = await courseClient.uploadCourseImage(course._id, file);

            if (result.success) {
                alert(`Image uploaded successfully!`);
                // Force a refresh to show the new image
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Error uploading image:", error);

            if (error.code === 'ERR_NETWORK') {
                alert("Network error. Make sure your server is running on port 4000.");
            } else if (error.response?.status === 413) {
                alert("File too large. Please use an image smaller than 5MB.");
            } else {
                alert("Failed to upload image. Please try again.");
            }
        } finally {
            setUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

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
                <div className="mb-4">
                    <h5>New Course
                        <Button className="btn btn-primary float-end align-items-center mb-2"
                            id="wd-add-new-course-click"
                            onClick={addNewCourse} >
                            Add
                        </Button>
                        <Button className="btn btn-warning float-end me-2 mb-2"
                            id="wd-update-course-click"
                            onClick={updateCourse}
                            disabled={!course._id || course._id === "0"} >
                            Update
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <Button
                            className="btn btn-primary float-end me-2 mb-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || !course._id || course._id === "0"}
                            title={!course._id || course._id === "0" ? "Please edit a course first" : "Upload image for selected course"}
                        >
                            {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                    </h5>

                    {/* Simple Course Form */}
                    <Form.Control
                        value={course.name}
                        className="mb-2"
                        placeholder="Course Name"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <Form.Control
                        as="textarea"
                        value={course.description}
                        className="mb-2"
                        placeholder="Course Description"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })} />

                    {course._id && course._id !== "0" && (
                        <div className="alert alert-warning">
                            <small>Editing: <strong>{course.name}</strong> (ID: {course._id})</small>
                        </div>
                    )}
                </div>
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
                                        <Card.Img
                                            variant="top"
                                            src={`${getCourseImage(course._id)}?t=${new Date().getTime()}`}
                                            width="100%"
                                            height={160}
                                            onError={handleImageError}
                                            key={`${course._id}-img`}
                                        />
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