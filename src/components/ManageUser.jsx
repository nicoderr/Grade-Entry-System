import React from 'react';
import { useState } from 'react';
import {usersAPI } from '../services/api';

function ManageUser({onUserAdded,}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');

    const handleAddUser = async (e) => {
        e.preventDefault();

    if(!fullName || !email) {
        alert ('Please fill in all fields');
        return;
    }
try {
    await usersAPI.create({fullName, email, role});
    setFullName('');
    setEmail('');
    setRole('student');

    if (onUserAdded)
        onUserAdded();
    alert ('User added successfully!');
} catch (err) {
    alert ('Failed to add user');
}
};
    return (
        <div className='card'>
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className='btn btn-success'>
                        Add User
                        </button>
                        </form>
                        </div>
                        );
                    }

export default ManageUser