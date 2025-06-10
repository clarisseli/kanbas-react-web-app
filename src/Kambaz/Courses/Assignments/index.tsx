import { useParams } from "react-router";
import { ListGroup, Row, Col } from "react-bootstrap";
import { BsGripVertical, BsCaretDownFill } from "react-icons/bs";
import { FaRegFileAlt, FaTrash } from "react-icons/fa";
import AssignmentsControls from "./AssignmentControls";
import AssignmentListControlButtons from "./AssignmentListControlButtons";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import AssignmentRemover from "./AssignmentRemover";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as assignmentClient from "./client"
import { setAssignments } from "./reducer";


export default function Assignments() {
    const { cid } = useParams();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);
    const formatDate = (dateString: any) => {
        return new Date(dateString)
            .toLocaleString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
            .replace(',', '')
    };;
    const handleClose = () => setShow(false);
    const handleShow = (assignment: any) => {
        setAssignmentToDelete(assignment);
        setShow(true);
    };
    const fetchAssignments = async () => {
        const assignments = await assignmentClient.fetchAssignmentsForCourse(cid);
        dispatch(setAssignments(assignments));
    };

    useEffect(() => {
        fetchAssignments();
    }, [cid]);

    return (
        <div className="container-fluid px-4 py-3" id="wd-assignments">
            <Row>
                <Col xs={12}>
                    {currentUser.role === "FACULTY" && <span className="float-end"><AssignmentsControls /></span>}
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
                                {assignments
                                    .filter((assignment: any) => assignment.course === cid)
                                    .map((assignment: any) => (
                                        <ListGroup.Item key={assignment._id} className="wd-assignment p-3 ps-1">
                                            <div className="wd-row-center justify-content-between">
                                                <div className="wd-row-center flex-grow-1 me-3">
                                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                                    <FaRegFileAlt className="me-3 fs-4 text-success lh-1 flex-shrink-0" />
                                                    <div>
                                                        {currentUser.role === "FACULTY" ? (
                                                            <a href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                                                className="fw-bold text-dark text-decoration-none">
                                                                {assignment.title}
                                                            </a>
                                                        ) : (
                                                            <span className="wd-assignment-name">{assignment.title}</span>
                                                        )}
                                                        <div className="text-wrap">
                                                            <span className="text-danger">Multiple Modules</span>
                                                            <span>
                                                                {" "} | <b>Not available until</b> {formatDate(assignment.available_dt)}
                                                                {" "} | <b>Due</b> {formatDate(assignment.due_dt)} | {assignment.points} pts
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {currentUser.role === "FACULTY" && (
                                                        < FaTrash className="me-2"
                                                            onClick={() => handleShow(assignment)}>
                                                        </FaTrash>)}
                                                    {currentUser.role === "FACULTY" && (
                                                        assignmentToDelete &&
                                                        <AssignmentRemover
                                                            show={show}
                                                            handleClose={handleClose}
                                                            dialogTitle={`Delete assignment \"${assignmentToDelete.title}\"?`}
                                                            assignment={assignmentToDelete}>
                                                        </AssignmentRemover>)}
                                                    {currentUser.role === "FACULTY" && <AssignmentsControlButtons />}
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row >
        </div >
    );
}