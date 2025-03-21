// FirebaseStore.jsx
import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { app } from '../Firebase';
// import { app } from '../FireBase/Firebase';

const db = getFirestore(app);

export default function FirebaseStore() {
    const [userData, setUserData] = useState({
        first: "",
        last: "",
        born: ""
    });

    function handleChange(e) {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }
    async function addData() {
        try {
            const docRef = await addDoc(collection(db, "users"), {
                first: userData.first,
                last: userData.last,
                born: parseInt(userData.born) || 0
            });
            alert('Data added Successfully');
            console.log("Document written with ID: ", docRef.id);
            setUserData({ first: "", last: "", born: "" }); // Reset form
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    return (
        <div>
            <h1>Firebase Firestore</h1>
            <input type="text" name="first" value={userData.first} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="last" value={userData.last} onChange={handleChange} placeholder="Last Name" />
            <input type="number" name="born" value={userData.born} onChange={handleChange} placeholder="Year of Birth" />
            <button onClick={addData}>Add Data</button>
        </div>
    );
}