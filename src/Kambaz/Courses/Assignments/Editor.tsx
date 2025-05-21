import { Button, Col, Form, Row } from "react-bootstrap";

export default function AssignmentEditor() {
    return (
        <div className="container-fluid" id="wd-assignments-editor">
            <Row className="justify-content-center">
                <Col xs={12} md={10}>
                    <Form>
                        <h6 className="mb-3">Assignment Name</h6>
                        <Form.Control
                            id="wd-name"
                            value="A1 - ENV + HTML"
                            className="mb-3"
                        />

                        <Row className="mb-3">
                            <Col sm={12}>
                                <Form.Control
                                    as="div"
                                    plaintext
                                    readOnly
                                    className="border p-3 rounded bg-white"
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    <div>
                                        <span>The assignment is </span>
                                        <span className="text-danger">available online</span>
                                        <br /><br />
                                        Submit a link to the landing page of your Web application running on Netlify.
                                        <br /><br />
                                        The landing page should include the following:
                                        <ul>
                                            <li>Your full name and section</li>
                                            <li>Links to each of the lab assignments</li>
                                            <li>Link to the Kanbas application</li>
                                            <li>Links to all relevant source code repositories</li>
                                        </ul>
                                        The Kanbas application should include a link to navigate back to the landing page.
                                    </div>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label
                                column
                                xs={12}
                                sm={3}
                                htmlFor="wd-points"
                                className="text-sm-end"
                            >
                                Points
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Control id="wd-points" type="number" defaultValue={100} />
                            </Col>
                        </Row>
                        <Row className="mb-3 align-items-center">
                            <Form.Label
                                column
                                xs={12}
                                sm={3}
                                htmlFor="wd-group"
                                className="text-sm-end"
                            >
                                Assignment Group
                            </Form.Label>
                            <Col xs={12} sm={9}>
                                <Form.Select id="wd-group">
                                    <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Form.Label
                                column
                                xs={12}
                                sm={3}
                                htmlFor="wd-display-grade-as"
                                className="text-sm-end"
                            >
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
                                        <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                                        <Form.Control id="wd-assign-to" defaultValue="Everyone" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="wd-due-date">Due</Form.Label>
                                        <Form.Control id="wd-due-date" type="datetime-local" defaultValue="2024-05-13T23:59" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Row className="gy-3">
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-from">Available from</Form.Label>
                                                <Form.Control id="wd-available-from" type="datetime-local" defaultValue="2024-05-06T12:00" />
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Label htmlFor="wd-available-until">Until</Form.Label>
                                                <Form.Control id="wd-available-until" type="datetime-local" defaultValue="2024-05-20T23:59" />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                            </Col>
                        </Row>


                        <div className="text-end mt-4">
                            <Button variant="light" className="me-2">Cancel</Button>
                            <Button variant="danger">Save</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}