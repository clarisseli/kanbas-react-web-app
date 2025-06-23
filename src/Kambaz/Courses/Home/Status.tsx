import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { BsHouseDoor, BsMegaphone } from "react-icons/bs";
import { AiOutlineBarChart } from "react-icons/ai";
import { IoNotificationsOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";

export default function CourseStatus() {
    const buttons = [
        { label: "Import Existing Content", icon: BiImport },
        { label: "Import from Commons", icon: LiaFileImportSolid },
        { label: "Choose Home Page", icon: BsHouseDoor },
        { label: "View Course Stream", icon: BiImport },
        { label: "New Announcement", icon: BsMegaphone },
        { label: "New Analytics", icon: AiOutlineBarChart },
        { label: "View Course Notifications", icon: IoNotificationsOutline }
    ];

    return (
        <div id="wd-course-status" style={{ width: "350px" }}>
            <h2>Course Status</h2>
            <div className="d-flex">
                <div className="w-50 pe-1">
                    <Button variant="secondary" size="lg" className="w-100 text-nowrap">
                        <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish
                    </Button>
                </div>
                <div className="w-50">
                    <Button variant="success" size="lg" className="w-100">
                        <FaCheckCircle className="me-2 fs-5" /> Publish
                    </Button>
                </div>
            </div>
            <br />
            {buttons.map(({ label, icon: Icon }) => (
                <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                    <Icon className="me-2 fs-5" />
                    {label}
                </Button>
            ))}
        </div>
    );
}
