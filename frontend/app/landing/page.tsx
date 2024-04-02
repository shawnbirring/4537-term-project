"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminComponent from '@/components/AdminContent';
import UserComponent from '@/components/UserContent';
import fetchAuthStatus from '@/utils/auth';
import { AuthData } from '@/models/AuthData';

export default function Landing() {
    const [data, setData] = useState<AuthData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        fetchAuthStatus().then(data => {
            setData(data);
            setIsLoading(false);
        }).catch(() => {
            router.push('/login');
        });
    }, [router]);

    if (isLoading) {
        return <p
            className="text-5xl font-bold text-gray-800"
        >Loading...</p>;
    }

    if (!data?.isAuthenticated) {
        return <main><p>You are not authorized to view this content.</p></main>;
    }

    if (data.role === 'admin') {
        return (
            <AdminComponent
                users={data.adminData}
                adminEmail={data.email}
                apiCalls={data.apiCalls}
            />
        );
    } else if (data.role === 'user') {
        return (
            <UserComponent
                userEmail={data.email}
                apiCalls={data.apiCalls}
            />
        );
    }
};
