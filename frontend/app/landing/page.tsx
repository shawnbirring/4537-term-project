"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminComponent from '@/components/AdminContent';
import UserComponent from '@/components/UserContent';
import fetchAuthStatus from '@/utils/auth';
import { AuthData } from '@/models/AuthData';
import { ApiUsage } from '@/models/ApiUsage';
import {fetchApiUsage} from '@/utils/fetchApiUsage'
import { strings } from '@/lang/en/userfacingstrings';

export default function Landing() {
    const [data, setData] = useState<AuthData | null>(null);
    const [apiUsage, setapiUsage] = useState<ApiUsage | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        fetchAuthStatus().then(data => {
            setData(data);
            fetchApiUsage().then((apicalldata:ApiUsage)  => {
                setapiUsage(apicalldata)
                setIsLoading(false);
            })
           
        }).catch(() => {
            router.push('/login');
        });
    }, [router]);

    if (isLoading) {
        return <p
            className="text-5xl font-bold text-gray-800"
        >{strings.loggedin_landing.loading_message}</p>;
    }

    if (!data?.isAuthenticated) {
        return <main><p>{strings.loggedin_landing.authorization_error_message}</p></main>;
    }

    if (data.role === 'admin' && apiUsage) {
        return (
            <AdminComponent
                initialUsers={data.adminData}
                adminEmail={data.email}
                apiCalls={data.apiCalls}
                intial_apiUsageData={apiUsage}
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
