import { useState } from "react";
export default function Counter() {
    // let count = 7;
    const [count, setCount] = useState(7);
    console.log(count);
    return (
        <div>
            <h2>Counter: {count}</h2>
            <button onClick={() => setCount(count + 1)}
                id="wd-counter-up-click" className="btn btn-success me-2">Up</button>
            <button onClick={() => setCount(count - 1)}
                id="wd-counter-down-click" className="btn btn-danger">Down</button>
            <hr />
        </div>
    );
}