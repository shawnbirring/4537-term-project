import { User } from "@/models/User"

export async function getUserData(userID: number) {
    console.log(userID)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userData/${userID}`, {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}

export async function updateUserData(user: User) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userData`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userData: user })
    })
    return await res.json()
}

export async function deleteUser(userID: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userData/${userID}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}
