"use client"
import { deleteUser, getUserData, updateUserData } from "@/utils/manageUser"
import { useRouter } from "next/navigation"
import { useState, useEffect, FormEvent } from "react"
import { User } from "@/models/User"

interface Params {
    params: {
        id: number
    }
}

export default function Page({ params }: Params) {
    const router = useRouter()
    const [userData, setUserData] = useState<User | null>(null)

    useEffect(() => {
        getUserData(params.id)
            .then(data => setUserData(data))
            .catch(() => router.push('/login'));
    }, [router]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (userData) updateUserData(userData).then(res => {if (res.success) router.refresh()})
    }

    function handleDelete() {
        if (userData) deleteUser(userData.id).then(res => {if (res.success) router.push("/landing")})
    }

    if (userData) {
        return (
            <>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" name="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input type="text" id="password" name="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            name="isAdmin"
                            checked={userData.isAdmin}
                            onChange={(e) => setUserData({ ...userData, isAdmin: e.target.checked })}
                            className="form-checkbox h-5 w-5 text-indigo-600 border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <label htmlFor="isAdmin" className="ml-2 block text-sm font-medium text-gray-700">Is Admin</label>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="apiCalls" className="block text-sm font-medium text-gray-700">API Calls:</label>
                        <input type="number" id="apiCalls" name="apiCalls" value={userData.apiCalls} onChange={(e) => setUserData({ ...userData, apiCalls: Number(e.target.value) })} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Submit</button>
                </form>
                <button
                    onClick={handleDelete}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700">
                        Delete User
                </button>
            </>

        )
    } else {
        return (<h1 className="text-5xl font-bold text-gray-800">Loading...</h1>)
    }
}

