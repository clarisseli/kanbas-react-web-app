import { FaBan } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { useState } from "react";


export default function ModulesControls({
    moduleName, setModuleName, addModule }: {
        moduleName: string;
        setModuleName: (title: string) => void;
        addModule: () => void;
    }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div id="wd-modules-controls"
            className="wd-row-center flex-wrap justify-content-end gap-2"
            style={{ overflow: "visible" }}>
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

            <Button variant="danger" size="lg" id="wd-add-module-btn" className="px-3 flex-shrink-0" onClick={handleShow}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Module
            </Button>

            <ModuleEditor
                show={show}
                handleClose={handleClose}
                dialogTitle="Add Module"
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={addModule} />
        </div>
    );
}