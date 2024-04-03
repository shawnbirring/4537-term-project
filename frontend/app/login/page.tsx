"use client";
import { useState } from "react";
import TypeAnimation from "@/components/TypeAnimation";
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 3) {
            setError("Password must be at least 3 characters long.");
            return;
        }

        setError("");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            if (response.status === 404) {
                setError("User not found. Please check your email and password.");
                return;
            }

            if (response.status === 401) {
                setError("Incorrect password. Please try again.");
                return;
            }

            if (!response.ok) {
                setError("An error occurred. Please try again.");
                return;
            }

            if (response.status === 200) {
                router.push("/landing");
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <TypeAnimation
                className="text-5xl font-bold text-gray-800"
                sequence={["Login, to be judged by AI..."]}
            />
            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
                action="#"
                method="POST"
            >
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative block w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="relative block w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                />
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="group relative w-64 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
        </div>
    );
}