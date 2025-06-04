import { ListGroup, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
    const { todo } = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    return (
        <ListGroup.Item className="border-light-subtle">
            <div className="d-flex justify-content-between align-items-center">
                <FormControl value={todo.title} className="flex-grow-1"
                    onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))} />
                <Button onClick={() => dispatch(updateTodo(todo))}
                    id="wd-update-todo-click" className="btn btn-warning ms-2"> Update </Button>
                <Button onClick={() => dispatch(addTodo(todo))}
                    id="wd-add-todo-click" className="btn btn-success ms-2"> Add </Button>
            </div>
        </ListGroup.Item>
    );
}