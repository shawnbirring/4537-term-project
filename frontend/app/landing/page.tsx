"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminComponent from '@/components/AdminContent';
import UserComponent from '@/components/UserContent';
import fetchAuthStatus from '@/utils/auth';
import { AuthData } from '@/models/AuthData';

import { strings } from '@/lang/en/userfacingstrings';
import { fetchEndpointUsage } from '@/utils/fetchEndpoints';
import { EndpointUsage } from '@/models/EndpointUsage';

export default function Landing() {
    const [data, setData] = useState<AuthData | null>(null);
    const [endpointUsage, setapiUsage] = useState<EndpointUsage | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        fetchAuthStatus().then(data => {
            setData(data);
            fetchEndpointUsage().then((endpointdata:EndpointUsage)  => {
                setapiUsage(endpointdata)
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

    if (data.role === 'admin' && endpointUsage) {
        return (
            <AdminComponent
                initialUsers={data.adminData}
                adminEmail={data.email}
                apiCalls={data.apiCalls}
                intial_endpointUsageData={endpointUsage}
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
