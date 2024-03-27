"use client"
import { useState } from 'react';

export default function TestAuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle registration
    const handleRegister = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch('https://4537-term-project-backend.vercel.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Necessary for cookies to be set
            });
            const data = await res.json();
            alert(JSON.stringify(data));
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    // Handle login
    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch('https://4537-term-project-backend.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Necessary for cookies to be set
            });
            const data = await res.json();
            alert(JSON.stringify(data));
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    // Fetch data from a protected route
    const fetchProtectedData = async () => {
        try {
            const res = await fetch('https://4537-term-project-backend.vercel.app/user', {
                credentials: 'include', // Necessary for cookies to be sent
            });
            const data = await res.json();
            alert(JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching protected data:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Register</button>
            </form>

            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
            </form>

            <button onClick={fetchProtectedData}>Fetch Protected Data</button>
        </div>
    );
}
