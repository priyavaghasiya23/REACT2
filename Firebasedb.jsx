import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update, set } from 'firebase/database';
import { app } from '../Firebase';

const database = getDatabase(app);

export default function FirebaseTodo() {
    const [state, setState] = useState({ title: '', body: '' });
    const [todo, setTodo] = useState([]);

    useEffect(() => {
        const todoRef = ref(database, 'Todo/');
        onValue(todoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newTodos = Object.keys(data).map((key) => ({
                    id: key,
                    title: data[key].title,
                    body: data[key].body
                }));
                setTodo(newTodos);
            } else {
                setTodo([]);
            }
        });
    }, []);

    function addData() {
        if (!state.title.trim() || !state.body.trim()) {
            alert("Please enter both title and body!");
            return;
        }

        const newTask = {
            title: state.title,
            body: state.body
        };

        const todoRef = ref(database, 'Todo/');
        push(todoRef, newTask);
        setState({ title: '', body: '' }); 
    }

   
    function deleteData(id) {
        const taskRef = ref(database, `Todo/${id}`);
        remove(taskRef);
    }

    
    function updateData(id) {
        const newTitle = prompt('Enter new title:');
        const newBody = prompt('Enter new body:');
        if (newTitle && newBody) {
            const taskRef = ref(database, `Todo/${id}`);
            update(taskRef, { title: newTitle, body: newBody });
        }
    }

    
    function sendTask() {
        set(ref(database, 'Todo users/'), {
            username: "priya",
            email: "priyavaghasiya23@gmail.com"
        });
    }

    return (
        <div>
            <h1>Todo List</h1>

            <button onClick={sendTask}>Send Task</button>

            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="text" 
                    value={state.title} 
                    placeholder="Title"
                    onChange={(e) => setState({ ...state, title: e.target.value })} 
                />
                <input 
                    type="text" 
                    value={state.body} 
                    placeholder="Body"
                    onChange={(e) => setState({ ...state, body: e.target.value })} 
                />
                <button onClick={addData}>Add</button>
            </form>

            <ul>
                {todo.map((el) => (
                    <li key={el.id}>
                        <p><strong>{el.title}</strong>: {el.body}</p>
                        <button onClick={() => updateData(el.id)}>Edit</button>
                        <button onClick={() => deleteData(el.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
