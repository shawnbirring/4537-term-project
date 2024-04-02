import { AuthData } from "@/models/AuthData";

const fetchAuthStatus = async (): Promise<AuthData> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('An error occurred while fetching data.');
    }

    const data: AuthData = await response.json();
    return data;
};

export default fetchAuthStatus;