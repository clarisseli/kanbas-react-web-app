import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function ModuleControlButtons(
    { moduleId, deleteModule, editModule }: {
        moduleId: string; deleteModule: (moduleId: string) => void;
        editModule: (moduleId: string) => void;
    }
) {
    return (
        <div className="float-end">
            <FaPencil onClick={() => editModule(moduleId)} className="me-3" />
            <FaTrash className="me-3" onClick={() => deleteModule(moduleId)} />
            <GreenCheckmark />
            <BsPlus style={{ fontSize: "36px" }} />
            <IoEllipsisVertical style={{ fontSize: "24px" }} />
        </div>);
}