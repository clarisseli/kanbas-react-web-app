import { useState } from "react";
import { useParams } from "react-router";
import { FormControl, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);


    return (
        <div id="wd-modules-screen" className="container-fluid px-4 py-3">
            {currentUser.role === "FACULTY" && <ModulesControls moduleName={moduleName} setModuleName={setModuleName}
                addModule={() => {
                    dispatch(addModule({ name: moduleName, course: cid }));
                    setModuleName("");
                }} />}

            <ListGroup id="wd-modules" className="rounded-0 mt-4">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary justify-content-between wd-row-center">
                                <div className="wd-row-center flex-grow-1">
                                    <BsGripVertical className="me-2 fs-4 flex-shrink-0" />
                                    {!module.editing && module.name}
                                    {module.editing && (
                                        <FormControl className="w-50 d-inline-block"
                                            onChange={(e) =>
                                                dispatch(updateModule({ ...module, name: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch(updateModule({ ...module, editing: false }));
                                                }
                                            }}
                                            defaultValue={module.name} />
                                    )}
                                </div>

                                <div className="wd-row-center gap-2 flex-shrink-0">
                                    {currentUser.role === "FACULTY" && <ModuleControlButtons moduleId={module._id}
                                        deleteModule={(moduleId) => {
                                            dispatch(deleteModule(moduleId));
                                        }}
                                        editModule={(moduleId) => dispatch(editModule(moduleId))} />}
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