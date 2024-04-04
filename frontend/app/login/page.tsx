"use client";
import { useState } from "react";
import TypeAnimation from "@/components/TypeAnimation";
import { useRouter } from 'next/navigation'
import { strings } from '@/lang/en/userfacingstrings';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(strings.login.email_error_message);
            return;
        }

        if (password.length < 3) {
            setError(strings.login.password_length_error_message);
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
                setError(strings.login.user_not_found_error_message);
                return;
            }

            if (response.status === 401) {
                setError(strings.login.incorrect_password_error_message);
                return;
            }

            if (!response.ok) {
                setError(strings.login.general_error_message);
                return;
            }

            if (response.status === 200) {
                router.push("/landing");
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
            setError(strings.login.general_error_message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <TypeAnimation
                className="text-5xl font-bold text-gray-800"
                sequence={[strings.login.welcome_message]}
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
                    placeholder={strings.login.email_address_form_placeholder}
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="relative block w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder={strings.login.password_form_placeholder}
                />
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="group relative w-64 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {strings.login.login_button_description}
                </button>
            </form>
        </div>
    );
}