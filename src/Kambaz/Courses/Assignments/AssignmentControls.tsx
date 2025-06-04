import { Form, Button } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { addAssignment }
    from "./reducer";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsControls() {
    const dispatch = useDispatch();
    const { cid } = useParams();
    const navigate = useNavigate();

    return (
        <div id="wd-assignments-controls"
            className="d-flex justify-content-between align-items-center gap-3 w-100 flex-wrap">
            <div className="position-relative flex-grow-1" >
                <Form.Control id="wd-search-assignment" size="lg" placeholder="Search..." className="ps-5 py-2 w-100" />
                <IoIosSearch className="fs-4 position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            </div>

            <div className="d-flex gap-2 flex-shrink-0">
                <Button variant="secondary" id="wd-add-assignment-group" size="lg" className="px-3 flex-shrink-0">
                    <FiPlus className="fs-4 " />
                    Group
                </Button>

                <Button variant="danger" id="wd-add-assignment" size="lg" className="px-3 flex-shrink-0"
                    onClick={() => {
                        const id = uuidv4()
                        dispatch(addAssignment({ course: cid, _id: id }));
                        navigate(`/Kambaz/Courses/${cid}/Assignments/${id}`);
                    }}>
                    <FiPlus className="fs-4" />
                    Assignment
                </Button>
            </div>
        </div>
    );
}