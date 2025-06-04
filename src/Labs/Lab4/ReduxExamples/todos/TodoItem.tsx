import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroup, Button } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: any }) {
    const dispatch = useDispatch();
    return (
        <ListGroup.Item className="border-light-subtle">
            {todo.title}
            <Button onClick={() => dispatch(deleteTodo(todo.id))}
                id="wd-delete-todo-click" className="btn btn-danger ms-2 float-end"> Delete </Button>
            <Button onClick={() => dispatch(setTodo(todo))}
                id="wd-set-todo-click" className="btn ms-2 float-end"> Edit </Button>
        </ListGroup.Item>
    );
}