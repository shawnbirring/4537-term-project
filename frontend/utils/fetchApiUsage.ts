export async function fetchApiUsage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apiUsage`, {
        method: "GET",
        credentials: "include",
    })
    return await res.json();
}