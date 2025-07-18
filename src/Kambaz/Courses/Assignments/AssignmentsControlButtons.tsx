import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function AssignmentsControlButtons() {
    return (
        <div className="float-end">
            <GreenCheckmark me-2 />
            <IoEllipsisVertical className="fs-4" />
        </div>);
}