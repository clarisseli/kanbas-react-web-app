import { ListGroup, Row, Col } from "react-bootstrap";
import { BsGripVertical, BsCaretDownFill } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import AssignmentsControls from "./AssignmentControls";
import AssignmentListControlButtons from "./AssignmentListControlButtons";
import AssignmentsControlButtons from "./AssignmentsControlButtons";

export default function Assignments() {
    return (
        <div className="container-fluid" id="wd-assignments">
            <Row>
                <Col xs={12}>
                    <AssignmentsControls />
                </Col>
            </Row>
            <br />
            <Row className="pt-4">
                <Col xs={12}>
                    <ListGroup className="rounded-0" id="wd-assignment-list">
                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <BsCaretDownFill className="me-2 fs-6" />
                                    <b>ASSIGNMENTS</b>
                                </div>
                                <AssignmentListControlButtons />
                            </div>

                            <div id="wd-assignment-list-items">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center flex-grow-1 me-3">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <FaRegFileAlt className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                            <div>
                                                <a className="fw-bold text-dark text-decoration-none" href="#/Kambaz/Courses/1234/Assignments/123">
                                                    A1
                                                </a>
                                                <div className="text-wrap">
                                                    <span className="text-danger">Multiple Modules</span>
                                                    <span> | <b>Not available until</b> May 6 at 12:00am | <b> Due</b> May 13 at 11:59pm | 100 pts
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <AssignmentsControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center flex-grow-1 me-3">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <FaRegFileAlt className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                            <div>
                                                <a className="fw-bold text-dark text-decoration-none" href="#/Kambaz/Courses/1234/Assignments/124">
                                                    A2 - CSS + BOOTSTRAP
                                                </a>
                                                <div className="text-wrap">
                                                    <span className="text-danger">Multiple Modules</span>
                                                    <span> | <b>Not available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | 100 pts</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <AssignmentsControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center flex-grow-1 me-3">
                                            <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                            <FaRegFileAlt className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                            <div>
                                                <a className="fw-bold text-dark text-decoration-none" href="#/Kambaz/Courses/1234/Assignments/125">
                                                    A3 - JAVASCRIPT + REACT
                                                </a>
                                                <div className="text-wrap">
                                                    <span className="text-danger">Multiple Modules</span>
                                                    <span> | <b>Not available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | 100 pts</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <AssignmentsControlButtons />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
}