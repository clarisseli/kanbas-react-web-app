import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import * as assignmentClient from "./client";

export default function AssignmentRemover({
    show,
    handleClose,
    dialogTitle,
    assignment,
}: {
    show: boolean;
    handleClose: () => void;
    dialogTitle: string;
    assignment: any;
}) {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (!assignment) return;
        await assignmentClient.deleteAssignment(assignment.course, assignment._id);
        dispatch(deleteAssignment({ assignment }));
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{dialogTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}