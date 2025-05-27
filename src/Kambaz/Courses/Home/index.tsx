import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
    return (
        <div className="d-flex container-fluid px-0" id="wd-home">
            <div className="flex-fill">  {/* right padding on large screens */}
                <Modules />
            </div>
            <div className="d-none d-xl-block px-4">  {/* match spacing with left column */}
                <CourseStatus />
            </div>
        </div>
    );
}