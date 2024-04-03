"use server"

export async function getUserData(userID: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return res
}
