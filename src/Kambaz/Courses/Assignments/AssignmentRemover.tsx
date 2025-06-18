import { Modal, Button } from "react-bootstrap";
import * as assignmentClient from "./client";

export default function AssignmentRemover({
    show,
    handleClose,
    dialogTitle,
    assignment,
    onDelete,
}: {
    show: boolean;
    handleClose: () => void;
    dialogTitle: string;
    assignment: any;
    onDelete: (assignmentId: string) => void;
}) {
    const handleDelete = async () => {
        if (!assignment) return;
        try {
            await assignmentClient.deleteAssignment(assignment.course, assignment._id);
            onDelete(assignment._id);
            handleClose();
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
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