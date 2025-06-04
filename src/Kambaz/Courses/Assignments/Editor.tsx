import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { updateAssignment, deleteAssignment, editAssignmentId }
    from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

export default function AssignmentEditor() {
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);

    const { cid, aid } = useParams();
    const assignment = assignments.find((assignment: any) => (assignment._id === aid && assignment.course === cid))
    const dispatch = useDispatch();
    const [assignmentData, setAssignmentData] = useState(assignment);
    const navigate = useNavigate();

    if (!assignment) {
        return <h2>Assignment not found</h2>;
    }

    return (
        <div className="container-fluid" id="wd-assignments-editor">
            <Row className="justify-content-center">
                <Col xs={12} md={10}>
                    <Form>
                        <h6 className="mb-3">Assignment Name</h6>
                        <Form.Control id="wd-name"
                            value={assignmentData.title}
                            className="mb-3"
                            onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })} />

                        <Row className="mb-3">
                            <Col sm={12}>
                                <Form.Control as="textarea" id="wd-description"
                                    value={assignmentData.description}
                                    className="border p-3 rounded bg-white"
                                    style={{ whiteSpace: "pre-wrap" }}
                                    onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label column xs={12} sm={3} htmlFor="wd-points" className="text-sm-end">
                                Points
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Control id="wd-points" type="number"
                                    value={assignmentData.points}
                                    onChange={(e) => setAssignmentData({ ...assignmentData, points: e.target.value })} />
                            </Col>
                        </Row>
                        <Row className="mb-3 align-items-center">
                            <Form.Label column xs={12} sm={3} htmlFor="wd-group" className="text-sm-end">
                                Assignment Group
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Select id="wd-group">
                                    <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                                    <option value="QUIZZES">QUIZZES</option>
                                    <option value="EXAMS">EXAMS</option>
                                    <option value="PROJECTS">PROJECTS</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label column xs={12} sm={3} htmlFor="wd-display-grade-as" className="text-sm-end">
                                Display Grade as
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Select id="wd-display-grade-as">
                                    <option>Percentage</option>
                                    <option>Points</option>
                                    <option>Letter Grade</option>
                                </Form.Select>
                            </Col>
                        </Row>


                        <Row className="mb-3 align-items-start">
                            <Form.Label column xs={12} sm={3} className="text-sm-end pt-sm-1">
                                Submission Type
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <div className="border rounded p-3">
                                    <Form.Select id="wd-submission-type">
                                        <option>Online</option>
                                    </Form.Select>

                                    <div className="mt-3 d-flex flex-column gap-2">
                                        <strong>Online Entry Options</strong>
                                        <Form.Check label="Text Entry" id="wd-text-entry" />
                                        <Form.Check label="Website URL" id="wd-website-url" defaultChecked />
                                        <Form.Check label="Media Recordings" id="wd-media-recordings" />
                                        <Form.Check label="Student Annotation" id="wd-student-annotation" />
                                        <Form.Check label="File Uploads" id="wd-file-upload" />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-start">
                            <Form.Label column xs={12} sm={3} className="text-sm-end pt-sm-1">
                                Assign
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <div className="border rounded p-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="wd-assign-to" className="fw-bold">Assign to</Form.Label>
                                        <Form.Control id="wd-assign-to" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
                                        <Form.Control id="wd-due-date" type="datetime-local"
                                            defaultValue={new Date(assignmentData.due_dt).toISOString().slice(0, 16)}
                                            onChange={(e) => setAssignmentData({ ...assignmentData, due_dt: e.target.value })} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Row className="gy-3">
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                                                <Form.Control id="wd-available-from" type="datetime-local"
                                                    defaultValue={new Date(assignmentData.available_dt).toISOString().slice(0, 16)}
                                                    onChange={(e) => setAssignmentData({ ...assignmentData, available_dt: e.target.value })} />
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                                                <Form.Control id="wd-available-until" type="datetime-local"
                                                    defaultValue={new Date(assignmentData.until_dt).toISOString().slice(0, 16)}
                                                    onChange={(e) => setAssignmentData({ ...assignmentData, until_dt: e.target.value })} />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                            </Col>
                        </Row>

                        <hr />
                        <div className="text-end mt-4">
                            <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
                                <Button variant="light" className="me-2"
                                    onClick={() => {
                                        if (!assignmentData._id.startsWith("A")) {
                                            dispatch(deleteAssignment({ assignment: assignmentData }));
                                        }
                                        navigate(`/Kambaz/Courses/${cid}/Assignments`)
                                    }}>
                                    Cancel
                                </Button>
                            </Link>
                            <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
                                <Button variant="danger"
                                    onClick={() => {
                                        if (!assignmentData._id.startsWith("A")) {
                                            dispatch(editAssignmentId({ assignment: assignmentData }))
                                            setAssignmentData({ ...assignmentData, _id: "A" + assignmentData._id })
                                        }
                                        dispatch(updateAssignment({ assignment: assignmentData }));
                                        navigate(`/Kambaz/Courses/${cid}/Assignments`)
                                    }}>
                                    Save
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}