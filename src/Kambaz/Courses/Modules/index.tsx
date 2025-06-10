import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { FormControl, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

export default function Modules() {
    const { cid } = useParams();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const [moduleName, setModuleName] = useState("");
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const fetchModules = async () => {
        const modules = await coursesClient.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };
    useEffect(() => {
        fetchModules();
    }, []);
    const createModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { name: moduleName, course: cid };
        const module = await coursesClient.createModuleForCourse(cid, newModule);
        dispatch(addModule(module));
        fetchModules();
    };
    const removeModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };
    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    return (
        <div id="wd-modules-screen" className="container-fluid px-4 py-3">
            {currentUser.role === "FACULTY" &&
                <ModulesControls
                    moduleName={moduleName}
                    setModuleName={setModuleName}
                    addModule={createModuleForCourse} />}

            <ListGroup id="wd-modules" className="rounded-0 mt-4">
                {modules
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
                                                    saveModule({ ...module, editing: false });
                                                }
                                            }}
                                            defaultValue={module.name} />
                                    )}
                                </div>

                                <div className="wd-row-center gap-2 flex-shrink-0">
                                    {currentUser.role === "FACULTY" &&
                                        <ModuleControlButtons
                                            moduleId={module._id}
                                            deleteModule={(moduleId) => removeModule(moduleId)}
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