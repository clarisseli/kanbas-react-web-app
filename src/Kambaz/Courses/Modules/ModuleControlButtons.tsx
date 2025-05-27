import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { BsPlus } from "react-icons/bs";
export default function ModuleControlButtons() {
    return (
        <div className="float-end">
            <GreenCheckmark />
            <BsPlus style={{ fontSize: "36px" }} />
            <IoEllipsisVertical style={{ fontSize: "24px" }} />
        </div>);
}