import { FaBan } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";

export default function ModulesControls() {
    return (
        <div id="wd-modules-controls"
            className="d-flex flex-wrap justify-content-end align-items-center gap-2"
            style={{ overflow: "visible" }}
        >
            <Button variant="secondary" size="lg" id="wd-collapse-all" className="px-3 flex-shrink-0">
                Collapse All
            </Button>

            <Button variant="secondary" size="lg" id="wd-view-progress" className="px-3 flex-shrink-0">
                View Progress
            </Button>

            <Dropdown className="flex-shrink-0">
                <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn" className="px-3">
                    <GreenCheckmark /> Publish All
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                    <Dropdown.Item id="wd-publish-all-modules-and-items">
                        <GreenCheckmark /> Publish all modules and items
                    </Dropdown.Item>
                    <Dropdown.Item id="wd-publish-modules-only">
                        <GreenCheckmark /> Publish modules only
                    </Dropdown.Item>
                    <Dropdown.Item id="wd-unpublish-all-modules-and-items">
                        <FaBan className="fs-5 fw-bold me-2" />
                        Unpublish all modules and items
                    </Dropdown.Item>
                    <Dropdown.Item id="wd-unpublish-modules-only">
                        <FaBan className="fs-5 fw-bold me-2" />
                        Unpublish modules only
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Button variant="danger" size="lg" id="wd-add-module-btn" className="px-3 flex-shrink-0">
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Module
            </Button>
        </div>
    );
}