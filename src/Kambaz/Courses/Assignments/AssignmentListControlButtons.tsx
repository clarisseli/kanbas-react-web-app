import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";

export default function AssignmentListControlButtons() {
    return (
        <div className="d-flex align-items-center gap-3">
            <span className="border border-dark rounded-pill px-3 py-1">40% of Total</span>
            <BsPlus className="fs-2" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}