import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import * as assignmentClient from "./client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const [assignmentData, setAssignmentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const createNewAssignmentTemplate = (courseId: string, assignmentId: string) => {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

        return {
            _id: assignmentId,
            title: "",
            course: courseId,
            description: "",
            points: 100,
            due_dt: nextWeek,
            available_dt: today,
            until_dt: twoWeeksLater,
            group: "ASSIGNMENTS",
            displayGradeAs: "Percentage",
            submissionType: "Online",
            assignTo: "Everyone"
        };
    };

    useEffect(() => {
        const loadAssignment = async () => {
            if (!cid || !aid) return;

            setLoading(true);
            try {
                const fetchedData = await assignmentClient.fetchAssignment(cid, aid);
                const assignmentData = Array.isArray(fetchedData) ? fetchedData[0] : fetchedData;

                if (assignmentData) {
                    // Existing assignment
                    setAssignmentData(assignmentData);
                } else {
                    // New assignment
                    setAssignmentData(createNewAssignmentTemplate(cid, aid));
                }
            } catch (error) {
                console.error("Error loading assignment:", error);
                setAssignmentData(createNewAssignmentTemplate(cid, aid));
            } finally {
                setLoading(false);
            }
        };
        loadAssignment();
    }, [cid, aid]);

    const handleDataChange = (field: string, value: string) => {
        const newData = { ...assignmentData, [field]: value };
        setAssignmentData(newData);
    };

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    };

    const handleSave = async () => {
        if (!cid) {
            console.error("Course ID is missing");
            return;
        }
        try {
            const isNewAssignment = !assignmentData._id?.startsWith("A");
            if (isNewAssignment) {
                const assignmentToCreate = {
                    title: assignmentData.title,
                    course: cid,
                    available_dt: assignmentData.available_dt,
                    due_dt: assignmentData.due_dt,
                    until_dt: assignmentData.until_dt,
                    description: assignmentData.description,
                    points: assignmentData.points
                };
                await assignmentClient.createAssignment(cid, assignmentToCreate);
            } else {
                const assignmentToUpdate = {
                    _id: assignmentData._id,
                    title: assignmentData.title,
                    course: assignmentData.course,
                    available_dt: assignmentData.available_dt,
                    due_dt: assignmentData.due_dt,
                    until_dt: assignmentData.until_dt,
                    description: assignmentData.description,
                    points: assignmentData.points
                };
                await assignmentClient.updateAssignment(assignmentToUpdate);
            }
            navigate(`/Kambaz/Courses/${cid}/Assignments`);
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!assignmentData) {
        return <h2>Assignment not found</h2>;
    }

    return (
        <div className="container-fluid" id="wd-assignments-editor">
            <Row className="justify-content-center">
                <Col xs={12} md={10}>
                    <Form>
                        <h6 className="mb-3">Assignment Name</h6>
                        <Form.Control id="wd-name"
                            value={assignmentData.title || ""}
                            className="mb-3"
                            onChange={(e) => handleDataChange('title', e.target.value)} />

                        <Row className="mb-3">
                            <Col sm={12}>
                                <Form.Control as="textarea" id="wd-description"
                                    value={assignmentData.description || ""}
                                    className="border p-3 rounded bg-white"
                                    style={{ whiteSpace: "pre-wrap" }}
                                    onChange={(e) => handleDataChange('description', e.target.value)}>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label column xs={12} sm={3} htmlFor="wd-points" className="text-sm-end">
                                Points
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Control id="wd-points" type="number"
                                    value={assignmentData.points || ""}
                                    onChange={(e) => handleDataChange('points', e.target.value)} />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label column xs={12} sm={3} htmlFor="wd-group" className="text-sm-end">
                                Assignment Group
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Select id="wd-group"
                                    value={assignmentData.group || 'ASSIGNMENTS'}
                                    onChange={(e) => handleDataChange('group', e.target.value)}>
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
                                <Form.Select id="wd-display-grade-as"
                                    value={assignmentData.displayGradeAs || 'Percentage'}
                                    onChange={(e) => handleDataChange('displayGradeAs', e.target.value)}>
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
                                    <Form.Select id="wd-submission-type"
                                        value={assignmentData.submissionType || 'Online'}
                                        onChange={(e) => handleDataChange('submissionType', e.target.value)}>
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
                                        <Form.Control id="wd-assign-to"
                                            value={assignmentData.assignTo || ''}
                                            onChange={(e) => handleDataChange('assignTo', e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
                                        <Form.Control id="wd-due-date" type="datetime-local"
                                            value={assignmentData.due_dt ? new Date(assignmentData.due_dt).toISOString().slice(0, 16) : ""}
                                            onChange={(e) => handleDataChange('due_dt', e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Row className="gy-3">
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                                                <Form.Control id="wd-available-from" type="datetime-local"
                                                    value={assignmentData.available_dt ? new Date(assignmentData.available_dt).toISOString().slice(0, 16) : ""}
                                                    onChange={(e) => handleDataChange('available_dt', e.target.value)} />
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                                                <Form.Control id="wd-available-until" type="datetime-local"
                                                    value={assignmentData.until_dt ? new Date(assignmentData.until_dt).toISOString().slice(0, 16) : ""}
                                                    onChange={(e) => handleDataChange('until_dt', e.target.value)} />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                            </Col>
                        </Row>

                        <hr />
                        <div className="text-end mt-4">
                            <Button variant="light" className="me-2" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}