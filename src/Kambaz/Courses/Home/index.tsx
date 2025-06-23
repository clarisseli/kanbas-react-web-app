import { useSelector } from "react-redux";
import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home({ viewContext }: { viewContext?: any }) {
    const reduxCurrentUser = useSelector((state: any) => state.accountReducer);
    const currentUser = viewContext?.currentUser || reduxCurrentUser;

    return (
        <div className="d-flex container-fluid px-0" id="wd-home">
            <div className="flex-fill">
                <Modules viewContext={viewContext} />
            </div>
            <div className="d-none d-xl-block px-4">
                {currentUser.role === "FACULTY" && <CourseStatus />}
            </div>
        </div>
    );
}