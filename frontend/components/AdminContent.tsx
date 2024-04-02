import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import { User } from '@/models/User';

interface AdminComponentProps {
    users: User[];
    adminEmail: string;
    apiCalls: number;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ users, adminEmail, apiCalls }) => {
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
                        <table className="min-w-full table-auto">
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
                                    <tr key={user.id}>
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
