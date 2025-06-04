import HelloRedux from "./HelloRedux";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
    return (
        <div>
            <h2>Redux Examples</h2>
            <HelloRedux /><hr />
            <CounterRedux /><hr />
            <AddRedux /><hr />
            <TodoList /><hr />
        </div>
    );
};