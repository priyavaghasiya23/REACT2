import React, { useState } from 'react';

export default function Controlled() {
    const [state, setState] = useState("");
    const [text, setText] = useState([]);

    function addText(e) {
        setState(e.target.value);
    }

    function submitForm(e) {
        e.preventDefault();
        if (state.trim() !== "") {
            const newItem = { id: Date.now(), value: state };
            setText([...text, newItem]);
            setState(""); // Clear input field after submission
        }
    }

    function deleteItem(id) {
        setText(text.filter((item) => item.id !== id));
    }

    function editItem(id) {
        const itemToEdit = text.find((item) => item.id === id);
        setState(itemToEdit.value); // Set the input value to the item value
        deleteItem(id); // Remove the item from the list
    }

    return (
        <div>
            <h1>Controlled</h1>
            <form onSubmit={submitForm}>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={state}
                    onChange={addText}
                />
                <input type="submit" value="Add" />
            </form>

            <ul>
                {text.map((el) => (
                    <li key={el.id}>
                        {el.value}
                        <button onClick={() => editItem(el.id)}>Edit</button>
                        <button onClick={() => deleteItem(el.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}