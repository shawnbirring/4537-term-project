"use client";
import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchUsers } from '@/utils/fetchUsers';

interface AdminComponentProps {
    initialUsers: User[];
    adminEmail: string;
    apiCalls: number;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ initialUsers, adminEmail, apiCalls }) => {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState<boolean>(false);

    const callFetchUsers = async () => {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
        setLoading(false);
    };

    return (
        <div className="container mx-auto my-8 p-5 shadow-lg">
            <div className="text-left text-4xl font-bold mb-8">
                <TypeAnimation
                    sequence={[`Welcome ${adminEmail}`, 1000]}
                    wrapper="h2"
                />
            </div>
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="table-container lg:w-1/2 mb-4 lg:mb-0 lg:mr-2">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Users</h2>
                            <button onClick={callFetchUsers} className="text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded">Refresh</button>
                        </div>
                        <p className="mb-4 text-sm text-gray-500">Click on a row to manage the corresponding user.</p>
                        {
                            loading ? <TypeAnimation sequence={['Loading...']} wrapper="p" repeat={Infinity} /> : <table className="min-w-full table-auto">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Password</th>
                                        <th className="px-4 py-2">Is Admin</th>
                                        <th className="px-4 py-2">API Calls</th>
                                        <th className="px-4 py-2">Created At</th>
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
                <div className="ai-container lg:w-1/2 lg:ml-2">
                    <AIComponent initialState={apiCalls} />
                </div>
            </div>
        </div>
    );
};

export default AdminComponent;
