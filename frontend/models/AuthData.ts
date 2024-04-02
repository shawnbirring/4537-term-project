export type AuthData = {
    isAuthenticated: boolean;
    role: 'admin' | 'user';
    email: string;
    adminData: any;
    apiCalls: number;
};