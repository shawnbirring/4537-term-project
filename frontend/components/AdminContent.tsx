import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import { User } from '@/models/User';
import { ApiUsage } from '@/models/ApiUsage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchUsers } from '@/utils/fetchUsers';


import {strings} from '../lang/en/userfacingstrings'
import { fetchApiUsage } from '@/utils/fetchApiUsage';

interface AdminComponentProps {
    initialUsers: User[];
    adminEmail: string;
    apiCalls: number;
    intial_apiUsageData: any;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ initialUsers, adminEmail, apiCalls, intial_apiUsageData }) => {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [apiUsageStats, setapiUsageStats] = useState<ApiUsage[]>(intial_apiUsageData);
    const [usertable_loading, setusertable_Loading] = useState<boolean>(false);
    const [apitable_loading, setapitable_loading] = useState<boolean>(false);

    const callFetchApiUsage = async () => {
        setapitable_loading(true);
        const data = await fetchApiUsage();
        setapiUsageStats(data);
        setapitable_loading(false);
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
    
            <div className="flex flex-col mb-4 ml-3">
               
                <div className="flex items-center mt-4 mb-4">
                    <h2 className="text-xl font-bold mr-4">{strings.loggedin_landing.apiUsage_heading}</h2>
                    <button onClick={callFetchApiUsage} className="text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded" disabled={apitable_loading}>{strings.loggedin_landing.refresh_button_description}</button>
                </div>
                <div className="api-table">
                {apitable_loading ? <TypeAnimation sequence={[strings.loggedin_landing.loading_message]} wrapper="p" /> : <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_ID}</th>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_GET_requests}</th>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_POST_requests}</th>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_DELETE_requests}</th>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_PATCH_requests}</th>
                                <th className="px-4 py-2">{strings.loggedin_landing.api_usage_table_heading_total_requests}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiUsageStats.map((apiUsageData) => (
    
                                <tr
                                    key={apiUsageData.id}>
                                    <td className="border px-4 py-2">{apiUsageData.id}</td>
                                    <td className="border px-4 py-2">{apiUsageData.getTotal}</td>
                                    <td className="border px-4 py-2">{apiUsageData.postTotal}</td>
                                    <td className="border px-4 py-2">{apiUsageData.deleteTotal}</td>
                                    <td className="border px-4 py-2">{apiUsageData.patchTotal}</td>
                                    <td className="border px-4 py-2">{apiUsageData.getTotal + + apiUsageData.postTotal + apiUsageData.patchTotal + apiUsageData.deleteTotal}</td>
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
