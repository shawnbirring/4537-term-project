"use client"
import { toLogin } from "../lib/actions";
import { useEffect, useState } from "react"

export default function Page() {
    const [userData, setUserData] = useState<any>(null)

    const token = localStorage.getItem("token")
    if (!token) {
        toLogin()
        return
    }

    if (!userData) { loadUserData(token).then((res) => {setUserData(res)}) }

    useEffect(() => {
        if (userData && userData.error) {
            toLogin()
        }
    },
    [userData])

    return (
        <>
            <h1>Landing Page</h1>
            {userData && <div>Number of API Calls Remaining: {userData.apiCalls}</div>}
        </>
    )
}

async function loadUserData(token: string) {
    try {
        const response = await fetch('https://4537-term-project-backend.vercel.app/user', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
        return null
    }
}