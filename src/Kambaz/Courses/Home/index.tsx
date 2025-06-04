import { useSelector } from "react-redux";
import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div className="d-flex container-fluid px-0" id="wd-home">
            <div className="flex-fill">
                <Modules />
            </div>
            <div className="d-none d-xl-block px-4">
                {currentUser.role === "FACULTY" && <CourseStatus />}
            </div>
        </div>
    );
}