import TypeAnimation from '@/components/TypeAnimation';
import AIComponent from '@/components/AIComponent';
import {strings} from '@/lang/en/userfacingstrings'
interface UserContentProps {
    userEmail: string;
    apiCalls: number;
}

const UserContent: React.FC<UserContentProps> = ({ userEmail, apiCalls }) => {
    return (
        <div className="container mx-auto my-8 p-5">
            <div className="text-left text-4xl font-bold mb-8">
                <TypeAnimation
                    sequence={[`${strings.loggedin_landing.welcome_message} ${userEmail}`, 1000]}
                    wrapper="h2"
                />
            </div>
            <div className="flex justify-center">
                <div className="ai-container w-full lg:w-1/2">
                    <AIComponent initialState={apiCalls} />
                </div>
            </div>
        </div>
    );
};

export default UserContent;
