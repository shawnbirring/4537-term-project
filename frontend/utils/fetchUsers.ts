export async function fetchUsers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        credentials: "include",
    })
    return await res.json();
}