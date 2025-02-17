import React, { useEffect, useState } from 'react';

export default function LocalStorage() {
    const [state, setState] = useState({ name: "", email: "" });
    const [data, setData] = useState(() => {
        const savedData = JSON.parse(localStorage.getItem("data"));
        return savedData || [];
    });
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
    }, [data]);

    function submitForm(e) {
        e.preventDefault();
        if (editIndex !== null) {
            const updatedData = data.map((item, index) =>
                index === editIndex ? state : item
            );
            setData(updatedData);
            setEditIndex(null);
        } else {
            setData([...data, state]);
        }
        setState({ name: "", email: "" });
    }

    function deleteForm(i) {
        const updated = data.filter((_, index) => index !== i);
        setData(updated);
    }

    function editForm(i) {
        setState(data[i]);
        setEditIndex(i);
    }

    return (
        <div> []
            <h1>Local Storage</h1>
            <form onSubmit={submitForm}>
                <label>First name: </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                />
                <br />
                <label>Email: </label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    value={state.email}
                    onChange={(e) => setState({ ...state, email: e.target.value })}
                />
                <button type="submit">{editIndex !== null ? "Update" : "Submit"}</button>
            </form>

            <ul>
                {data.map((el, i) => (
                    <li key={i}>
                        {el.name} - {el.email}
                        <button onClick={() => deleteForm(i)}>Delete</button>
                        <button onClick={() => editForm(i)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}