import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchUsers } from '@/utils/fetchUsers';


import {strings} from '../lang/en/userfacingstrings'

import { fetchEndpointUsage } from '@/utils/fetchEndpoints';
import { EndpointUsage } from '@/models/EndpointUsage';

interface AdminComponentProps {
    initialUsers: User[];
    adminEmail: string;
    apiCalls: number;
    intial_endpointUsageData: any;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ initialUsers, adminEmail, apiCalls, intial_endpointUsageData }) => {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [endpointUsageStats, setendpointUsageStats] = useState<EndpointUsage[]>(intial_endpointUsageData);
    const [usertable_loading, setusertable_Loading] = useState<boolean>(false);
    const [endpointtable_loading, setendpointtable_loading] = useState<boolean>(false);

    const callFetchEndpointUsage = async () => {
        setendpointtable_loading(true);
        const data = await fetchEndpointUsage();
        setendpointUsageStats(data);
        setendpointtable_loading(false);
    };

    const callFetchUsers = async () => {
        setusertable_Loading(true);
        const data = await fetchUsers();
        setUsers(data);
        setusertable_Loading(false);
    };

    return (
        <div className="container mx-auto my-8 p-5 shadow-lg">
        <div className="text-left text-4xl font-bold mb-8">
            <TypeAnimation
                sequence={[`${strings.loggedin_landing.welcome_message} ${adminEmail}`, 1000]}
                wrapper="h2"
            />
        </div>
        <div className="flex flex-col lg:flex-row justify-between">
            
            <div className="table-container lg:w-1/2 mb-4 lg:mb-0 lg:mr-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{strings.loggedin_landing.users_heading}</h2>
                        <button onClick={callFetchUsers} className="text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded" disabled={usertable_loading}>{strings.loggedin_landing.refresh_button_description}</button>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">{strings.loggedin_landing.table_editing_instructions}</p>
                <div className="overflow-x-auto">
                   
                    {
                        usertable_loading ? <TypeAnimation sequence={[strings.loggedin_landing.loading_message]} wrapper="p" /> : <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_ID}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_Email}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_Password}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_isAdmin}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_apiCalls}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.user_table_heading_createdAt}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
    
                                    <tr
                                        key={user.id}
                                        onClick={(_) => router.push(`/manageUser/${user.id}`)}
                                        className='hover:bg-gray-100 cursor-pointer'>
                                        <td className="border px-4 py-2">{user.id}</td>
                                        <td className="border px-4 py-2">{user.email}</td>
                                        <td className="border px-4 py-2">{user.password}</td>
                                        <td className="border px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                                        <td className="border px-4 py-2">{user.apiCalls}</td>
                                        <td className="border px-4 py-2">{user.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
    
                </div>
            </div>
    
    
            <div className="flex flex-col mb-4 ml-3 items-center flex-grow">
   
                <div className="flex items-center mt-4 mb-4">
                    <h2 className="text-xl font-bold mr-4">{strings.loggedin_landing.endpointUsage_heading}</h2>
                    <button onClick={callFetchEndpointUsage} className="text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded" disabled={endpointtable_loading}>{strings.loggedin_landing.refresh_button_description}</button>
                </div>
                <div className="endpoint-table w-full">
                    {endpointtable_loading ? <TypeAnimation sequence={[strings.loggedin_landing.loading_message]} wrapper="p" /> : <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">{strings.loggedin_landing.endpoint_usage_table_heading_ID}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.endpoint_usage_table_heading_Method}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.endpoint_usage_table_heading_Endpoint_name}</th>
                                    <th className="px-4 py-2">{strings.loggedin_landing.endpoint_usage_table_heading_num_of_requests}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {endpointUsageStats.map((endpointUsageData) => (

                                    <tr
                                        key={endpointUsageData.id}>
                                        <td className="border px-4 py-2">{endpointUsageData.id}</td>
                                        <td className="border px-4 py-2">{endpointUsageData.method}</td>
                                        <td className="border px-4 py-2">{endpointUsageData.endpointName}</td>
                                        <td className="border px-4 py-2">{endpointUsageData.numberofRequests}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        }
                </div>
            
                <div className="ai-container min-w-full mb-5">
                    <AIComponent initialState={apiCalls} />
                </div>
            </div>
        </div>
    </div>
    
    );
};

export default AdminComponent;
