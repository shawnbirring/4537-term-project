"use client"
import { toLogin } from "../../lib/actions";
import { useEffect, useState } from "react"
import { loadUserData } from "@/app/lib/util"

export function Landing({admin} : {admin:boolean}) {
    const [userData, setUserData] = useState<any>(null)
    useEffect(() => {
        if (userData && userData.error) {
            toLogin()
        }
    },
    [userData])

    if (!userData) {loadUserData(admin).then(data => {
        console.log(data)
        // setUserData(data)
    })}

    return (
        <>
            <h1>{admin ? "Admin" : "User"} Landing Page</h1>
            {userData && <div>Number of API Calls Remaining: {userData.apiCalls}</div>}
        </>
    )
} 