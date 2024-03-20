export async function loadUserData(token: string, admin: boolean) {
    try {
        const response = await fetch(`https://4537-term-project-backend.vercel.app/${admin ? "admin" : "user"}`, {
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