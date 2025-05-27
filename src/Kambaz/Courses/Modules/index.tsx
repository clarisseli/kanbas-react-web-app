import { useParams } from "react-router";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import * as db from "../../Database";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

export default function Modules() {
    const { cid } = useParams();
    const modules = db.modules;

    return (
        <div id="wd-modules-screen" className="container-fluid px-4 py-3">
            <ModulesControls />

            <ListGroup id="wd-modules" className="rounded-0 mt-4">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary justify-content-between wd-row-center">
                                <div className="wd-row-center">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    {module.name}
                                </div>
                                <div className="wd-row-center gap-2 flex-shrink-0">
                                    <ModuleControlButtons />
                                </div>
                            </div>

                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson: any) => (
                                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                                            <div className="wd-row-center justify-content-between">
                                                <div className="wd-row-center justify-content-between">
                                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                                    <span className="ms-4">{lesson.name}</span>
                                                </div>
                                                <div className="wd-row-center justify-content-between gap-2 flex-shrink-0">
                                                    <LessonControlButtons />
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    ))}
            </ListGroup>
        </div>
    );
}