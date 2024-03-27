"use client"
import { redirectClient } from "@/app/lib/actions";
import { useState } from 'react';

export default function Page() {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleRegisterSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const response = await fetch('https://4537-term-project-backend.vercel.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: registerEmail, password: registerPassword })
            });
            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLoginSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const response = await fetch('https://4537-term-project-backend.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await response.json();
            console.log(data);
            alert(data.message);
            redirectClient("/landing/user")
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleTestToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token not found. Please login first.');
            return;
        }

        try {
            const response = await fetch('https://4537-term-project-backend.vercel.app/user', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <h1>User Authentication Frontend</h1>

            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
                <label htmlFor="registerEmail">Email:</label>
                <input type="email" id="registerEmail" name="registerEmail" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required /><br />
                <label htmlFor="registerPassword">Password:</label>
                <input type="password" id="registerPassword" name="registerPassword" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required /><br />
                <button type="submit">Register</button>
            </form>

            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <label htmlFor="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="loginEmail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required /><br />
                <label htmlFor="loginPassword">Password:</label>
                <input type="password" id="loginPassword" name="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /><br />
                <button type="submit">Login</button>
            </form>

            <h2>Test Token</h2>
            <button onClick={handleTestToken}>Test Token</button>
        </>
    );
}
