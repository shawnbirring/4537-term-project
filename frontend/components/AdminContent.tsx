import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import {landingWelcome, table_heading_ID, table_heading_Email, table_heading_Password, table_heading_isAdmin, table_heading_apiCalls, table_heading_createdAt} from '../lang/en/userfacingstrings'

interface AdminComponentProps {
    users: User[];
    adminEmail: string;
    apiCalls: number;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ users, adminEmail, apiCalls }) => {
    const router = useRouter()

    return (
        <div className="container mx-auto my-8 p-5 shadow-lg">
            <div className="text-left text-4xl font-bold mb-8">
                <TypeAnimation
                    sequence={[`${landingWelcome} ${adminEmail}`, 1000]}
                    wrapper="h2"
                />
            </div>
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="table-container lg:w-1/2 mb-4 lg:mb-0 lg:mr-2">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">{table_heading_ID}</th>
                                    <th className="px-4 py-2">{table_heading_Email}</th>
                                    <th className="px-4 py-2">{table_heading_Password}</th>
                                    <th className="px-4 py-2">{table_heading_isAdmin}</th>
                                    <th className="px-4 py-2">{table_heading_apiCalls}</th>
                                    <th className="px-4 py-2">{table_heading_createdAt}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    
                                        <tr 
                                        key={user.id}
                                        onClick={(_) => router.push(`/manageUser/${user.id}`)}
                                        className='hover:bg-gray-100'>
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
