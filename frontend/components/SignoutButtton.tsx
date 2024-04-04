"use client"
import { strings } from "@/lang/en/userfacingstrings"
import { useRouter } from "next/navigation"

export default function SignoutButton() {
    const router = useRouter()

    async function logout() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: "GET",
            credentials: 'include'
        })
        router.push('/')
    }

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={logout}>{strings.header.sign_out_button_description}</button>
    )
}

