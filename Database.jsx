import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';
import { app, auth, provider } from '../Firebase'; // Import Firebase services
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const database = getDatabase(app);

export default function FirebaseTodo() {
    const [user, setUser] = useState(null); 
    const [task, setTask] = useState({ title: '', body: '' });
    const [todos, setTodos] = useState([]); 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchTodos(currentUser.uid);
            } else {
                setTodos([]); 
            }
        });
        return () => unsubscribe(); 
    }, []);

   
    function fetchTodos(userId) {
        const todoRef = ref(database, users/${userId}/todos/);
        onValue(todoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const taskList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key]
                }));
                setTodos(taskList);
            } else {
                setTodos([]);
            }
        });
    }

    function handleGoogleSignIn() {
        signInWithPopup(auth, provider)
            .then((result) => console.log("User signed in:", result.user))
            .catch((error) => console.error("Error signing in:", error));
    }

    function handleLogout() {
        signOut(auth).catch((error) => console.error("Error signing out:", error));
    }

    function addTask() {
        if (!task.title.trim() || !task.body.trim()) {
            alert("Please enter both title and body!");
            return;
        }
        if (!user) {
            alert("You must be logged in to add a task.");
            return;
        }

        const userRef = ref(database, users/${user.uid}/todos/);
        push(userRef, { title: task.title, body: task.body });
        setTask({ title: '', body: '' }); // Clear input fields
    }

    function deleteTask(taskId) {
        if (!user) return;
        const taskRef = ref(database, users/${user.uid}/todos/${taskId});
        remove(taskRef);
    }

    function updateTask(taskId) {
        if (!user) return;
        const newTitle = prompt('Enter new title:');
        const newBody = prompt('Enter new body:');
        if (newTitle && newBody) {
            const taskRef = ref(database, users/${user.uid}/todos/${taskId});
            update(taskRef, { title: newTitle, body: newBody });
        }
    }

    return (
        <div>
            <h1>Firebase Todo App</h1>

            {/* Google Sign-In/Sign-Out */}
            {user ? (
                <div>
                    <p>Welcome, {user.displayName}!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            )}

            {/* Task Input */}
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" value={task.title} placeholder="Title"
                    onChange={(e) => setTask({ ...task, title: e.target.value })} />
                <input type="text" value={task.body} placeholder="Body"
                    onChange={(e) => setTask({ ...task, body: e.target.value })} />
                <button onClick={addTask}>Add Task</button>
            </form>

            {/* Task List */}
            <ul>
                {todos.map((t) => (
                    <li key={t.id}>
                        <p><strong>{t.title}</strong>: {t.body}</p>
                        <button onClick={() => updateTask(t.id)}>Edit</button>
                        <button onClick={() => deleteTask(t.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}