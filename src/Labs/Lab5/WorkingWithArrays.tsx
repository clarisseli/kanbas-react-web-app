import { useState } from "react";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export default function WorkingWithArrays() {
    const API = `${REMOTE_SERVER}/lab5/todos`;
    const [todo, setTodo] = useState({
        id: "1",
        title: "NodeJS Assignment",
        description: "Create a server",
        due: "2021-09-09", completed: false,
    });
    return (
        <div id="wd-working-with-arrays">
            <h3>Working with Arrays</h3>
            <h4>Retrieving Arrays</h4>
            <a className="btn btn-primary" href={API}>
                Get Todos </a>
            <hr />
            <h4>Retrieving an Item from an Array by ID</h4>
            <a className="btn btn-primary float-end"
                href={`${API}/${todo.id}`}>
                Get Todo by ID </a>
            <input defaultValue={todo.id} className="form-control w-50"
                onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
            <hr />
            <h3>Filtering Array Items</h3>
            <a className="btn btn-primary"
                href={`${API}?completed=true`}>
                Get Completed Todos
            </a><hr />
            <h3>Creating new Items in an Array</h3>
            <a className="btn btn-primary"
                href={`${API}/create`}>
                Create Todo
            </a><hr />
            <h3>Deleting from an Array</h3>
            <a className="btn btn-primary float-end"
                href={`${API}/${todo.id}/delete`}>
                Delete Todo with ID = {todo.id} </a>
            <input defaultValue={todo.id}
                className="form-control w-50"
                onChange={(e) => setTodo({
                    ...todo, id: e.target.value
                })} />
            <hr />
            <h3>Updating an Item in an Array</h3>
            <a href={`${API}/${todo.id}/title/${todo.title}`}
                className="btn btn-primary float-end">
                Update Todo</a>
            <input defaultValue={todo.id}
                className="form-control w-25 float-start me-2"
                onChange={(e) => setTodo({
                    ...todo, id: e.target.value
                })} />
            <input defaultValue={todo.title}
                className="form-control w-50 float-start"
                onChange={(e) => setTodo({
                    ...todo, title: e.target.value
                })} />
            <br /><br />
            <a href={`${API}/${todo.id}/completed/${todo.completed}`}
                className="btn btn-primary float-end">
                Update Completion Status</a>
            <input defaultValue={todo.id}
                className="form-control w-25 float-start me-2"
                onChange={(e) => setTodo({
                    ...todo, id: e.target.value
                })} />
            <input className="form-check-input" type="checkbox" id="completed-checkbox"
                defaultChecked={todo.completed}
                onChange={(e) => setTodo({
                    ...todo,
                    completed: e.target.checked
                })} />
            <br /><br />
            <a href={`${API}/${todo.id}/description/${todo.description}`}
                className="btn btn-primary float-end">
                Update Description</a>
            <input defaultValue={todo.id}
                className="form-control w-25 float-start me-2"
                onChange={(e) => setTodo({
                    ...todo, id: e.target.value
                })} />
            <input defaultValue={todo.description}
                className="form-control w-50 float-start"
                onChange={(e) => setTodo({
                    ...todo, description: e.target.value
                })} />
            <br /><br /><hr />
        </div>
    );
}