export async function fetchEndpointUsage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpointUsage`, {
        method: "GET",
        credentials: "include",
    })
    return await res.json();
}