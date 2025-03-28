import React, { useEffect, useState } from 'react';

export default function ApiHunter() {
    const [state, setState] = useState([]);
    const [task, setTask] = useState({ id: '', title: '', body: '' });

    useEffect(() => {
        fetch('http://localhost:3000/Todo')
            .then((res) => res.json())
            .then(setState);
    }, []);

    const addTask = (e) => {
        e.preventDefault();

        if (task.id) {
            fetch(`http://localhost:3000/Todo/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            })
            .then(() => {
                setState(state.map((item) => (item.id === task.id ? task : item)));
                setTask({ id: '', title: '', body: '' });
            });
        } else {
            fetch('http://localhost:3000/Todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            })
            .then((res) => res.json())
            .then((newTask) => {
                setState([...state, newTask]);
                setTask({ id: '', title: '', body: '' });
            });
        }
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:3000/Todo/${id}`, {
            method: 'DELETE'
        }).then(() => {
            setState(state.filter((task) => task.id !== id));
        });
    };

    const editTask = (task) => {
        setTask(task);
    };

    return (
        <div>
            <h1>API Hunter</h1>
            <form onSubmit={addTask}>
                <input type="text" placeholder="Title" value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })} />
                <input type="text" placeholder="Body" value={task.body}
                    onChange={(e) => setTask({ ...task, body: e.target.value })} />
                <button type="submit">{task.id ? 'Update' : 'Add'}</button>
            </form>

            {state.map((item) => (
                <div key={item.id}>
                    <p>Title : {item.title}</p>
                    <p>Body : {item.body}</p>
                    <button onClick={() => deleteTask(item.id)}>Delete</button>
                    <button onClick={() => editTask(item)}>Edit</button>
                </div>
            ))}
        </div>
    );
}
