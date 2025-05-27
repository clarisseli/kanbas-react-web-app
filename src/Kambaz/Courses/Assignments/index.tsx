import { useParams } from "react-router";
import { ListGroup, Row, Col } from "react-bootstrap";
import { BsGripVertical, BsCaretDownFill } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import * as db from "../../Database";
import AssignmentsControls from "./AssignmentControls";
import AssignmentListControlButtons from "./AssignmentListControlButtons";
import AssignmentsControlButtons from "./AssignmentsControlButtons";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments.filter((a: any) => a.course === cid);

    return (
        <div className="container-fluid px-4 py-3" id="wd-assignments">
            <Row>
                <Col xs={12}>
                    <AssignmentsControls />
                </Col>
            </Row>

            <Row className="pt-4">
                <Col xs={12}>
                    <ListGroup className="rounded-0" id="wd-assignment-list">
                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-4 bg-secondary wd-row-center justify-content-between">
                                <div>
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    <BsCaretDownFill className="me-2 fs-6" />
                                    <b>ASSIGNMENTS</b>
                                </div>
                                <AssignmentListControlButtons />
                            </div>

                            <div id="wd-assignment-list-items">
                                {assignments.map((a: any) => (
                                    <ListGroup.Item key={a._id} className="wd-assignment p-3 ps-1">
                                        <div className="wd-row-center justify-content-between">
                                            <div className="wd-row-center flex-grow-1 me-3">
                                                <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                                <FaRegFileAlt className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                                <div>
                                                    <a
                                                        className="fw-bold text-dark text-decoration-none"
                                                        href={`#/Kambaz/Courses/${cid}/Assignments/${a._id}`}
                                                    >
                                                        {a.title}
                                                    </a>
                                                    <div className="text-wrap">
                                                        <span className="text-danger">Multiple Modules</span>
                                                        <span>
                                                            {" "} | <b>Not available until</b> {a.available}
                                                            {" "} | <b>Due</b> {a.due} | {a.points} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <AssignmentsControlButtons />
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
}