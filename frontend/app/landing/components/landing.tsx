"use client"
import { toLogin } from "../../lib/actions";
import { useEffect, useState } from "react"
import { loadUserData } from "@/app/lib/util"

export function Landing({admin} : {admin:boolean}) {
    const [userData, setUserData] = useState<any>(null)

    const token = localStorage.getItem("token")
    if (!token) {
        toLogin()
        return
    }

    if (!userData) { loadUserData(token, admin).then((res) => {setUserData(res)}) }

    useEffect(() => {
        if (userData && userData.error) {
            toLogin()
        }
    },
    [userData])

    return (
        <>
            <h1>{admin ? "Admin" : "User"} Landing Page</h1>
            {userData && <div>Number of API Calls Remaining: {userData.apiCalls}</div>}
        </>
    )
}