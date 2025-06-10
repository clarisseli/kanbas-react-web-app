import { useState } from "react";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10",
        completed: false,
        score: 0,
    });
    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
    const [module, setModule] = useState({
        id: "M101",
        name: "Introduction to Rocket Propulsion",
        description: "Basic principles of rocket propulsion and rocket engines.",
        course: "RS101",
    });
    const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

    return (
        <div id="wd-working-with-objects" >
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>

            <div className="row mb-3 align-items-center" style={{ minHeight: "40px" }}>
                <div className="col-8">
                    <input className="form-control" defaultValue={assignment.title}
                        onChange={(e) => setAssignment({
                            ...assignment,
                            title: e.target.value
                        })} />
                </div>
                <div className="col-4">
                    <a className="btn btn-primary w-100"
                        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                        Update Title
                    </a>
                </div>
            </div>

            <div className="row mb-3 align-items-center" style={{ minHeight: "40px" }}>
                <div className="col-8">
                    <input className="form-control" defaultValue={assignment.score}
                        onChange={(e) => setAssignment({
                            ...assignment,
                            score: parseFloat(e.target.value)
                        })} />
                </div>
                <div className="col-4">
                    <a className="btn btn-primary w-100"
                        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                        Update Score
                    </a>
                </div>
            </div>

            <div className="row mb-3 align-items-center" style={{ minHeight: "40px" }}>
                <div className="col-8">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="completed-checkbox"
                            defaultChecked={assignment.completed}
                            onChange={(e) => setAssignment({
                                ...assignment,
                                completed: e.target.checked
                            })} />
                        <label className="form-check-label" htmlFor="completed-checkbox">
                            Completed
                        </label>
                    </div>
                </div>
                <div className="col-4">
                    <a className="btn btn-primary w-100"
                        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                        Update Completion Status
                    </a>
                </div>
            </div>

            <div className="row mb-3 align-items-center" style={{ minHeight: "40px" }}>
                <div className="col-8">
                    <input className="form-control" defaultValue={module.name}
                        onChange={(e) => setModule({
                            ...module,
                            name: e.target.value
                        })}
                    />
                </div>
                <div className="col-4">
                    <a className="btn btn-primary w-100"
                        href={`${MODULE_API_URL}/name/${module.name}`}>
                        Update Module Name
                    </a>
                </div>
            </div>

            <div className="row mb-3 align-items-center" style={{ minHeight: "40px" }}>
                <div className="col-8">
                    <input className="form-control" defaultValue={module.description}
                        onChange={(e) => setModule({
                            ...module,
                            description: e.target.value
                        })}
                    />
                </div>
                <div className="col-4">
                    <a className="btn btn-primary w-100"
                        href={`${MODULE_API_URL}/description/${module.description}`}>
                        Update Module Description
                    </a>
                </div>
            </div>
            <hr />

            <h4>Retrieving Objects</h4>
            <a className="btn btn-primary me-2"
                href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <a className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a>
            <hr />
            <h4>Retrieving Properties</h4>
            <a className="btn btn-primary me-2"
                href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Title
            </a>
            <a className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Module Name
            </a>
            <hr />
        </div >
    );
}