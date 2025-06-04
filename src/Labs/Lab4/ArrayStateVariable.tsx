import { useState } from "react";
export default function ArrayStateVariable() {
    const [array, setArray] = useState([1, 2, 3, 4, 5]);
    const addElement = () => {
        setArray([...array, Math.floor(Math.random() * 100)]);
    };
    const deleteElement = (index: number) => {
        setArray(array.filter((_, i) => i !== index));
    };
    return (
        <div id="wd-array-state-variables">
            <h2>Array State Variable</h2>
            <button onClick={addElement} className="btn btn-success mb-3">
                Add Element
            </button>

            <div className="border rounded overflow-hidden" style={{ width: "220px" }}>
                {array.map((item, index) => (
                    <div
                        key={index}
                        className="d-flex justify-content-between align-items-center border-bottom"
                        style={{
                            height: "55px",
                            width: "220px",
                            padding: "10px",
                            paddingLeft: "20px",
                        }}
                    >
                        <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{item}</span>
                        <button onClick={() => deleteElement(index)} className="btn btn-danger me-2">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
}