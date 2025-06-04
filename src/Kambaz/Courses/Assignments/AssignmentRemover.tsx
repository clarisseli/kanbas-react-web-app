import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";

export default function AssignmentRemover({ show, handleClose, dialogTitle, assignment, }: {
    show: boolean; handleClose: () => void; dialogTitle: string; assignment: any;
}) {
    const dispatch = useDispatch()
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{dialogTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Cancel </Button>
                <Button variant="danger"
                    onClick={() => {
                        dispatch(deleteAssignment({ assignment }))
                        handleClose();
                    }} > Yes </Button>
            </Modal.Footer>
        </Modal>
    );
}