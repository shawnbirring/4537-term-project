"use client";
import { useState } from 'react';
import TypeAnimation from "@/components/TypeAnimation"
import { strings } from '../lang/en/userfacingstrings'

const AIComponent = ({ initialState }: { initialState: number }) => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [remainingCalls, setRemainingCalls] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setResponse('');

        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ text: input }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.modelData[0]["generated_text"]);
            setRemainingCalls(data.apiCalls);
            setLoading(false)
        } catch (error) {
            console.error("Fetching error:", error);
            setError('An error occurred while accessing the API.');
            setLoading(false)
        }
    };

    return (
        <div className="p-5 shadow-lg">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="aiInput" className="block text-gray-700 text-sm font-bold mb-2">
                        {strings.loggedin_landing.AI_Input_heading}
                    </label>
                    <input
                        type="text"
                        id="aiInput"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {!loading && <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {strings.loggedin_landing.submit_button_description}
                </button>}
            </form>
            {response && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">{strings.loggedin_landing.AI_response_heading}</h3>
                    <TypeAnimation sequence={[response]} wrapper="p" />
                </div>
            )}

            {loading && (
                <div className="mt-4">
                    <TypeAnimation className='text-lg font-semibold' sequence={[strings.loggedin_landing.loading_message]} wrapper="span" />
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                </div>
            )}
            <h3 className="mt-4 text-lg font-semibold">
                {strings.loggedin_landing.remaining_api_calls}
                <span
                    className={`${remainingCalls >= 10 && remainingCalls <= 20
                        ? "text-green-500"
                        : remainingCalls >= 5 && remainingCalls < 10
                            ? "text-yellow-500"
                            : "text-red-500"
                        } font-normal`}
                >
                    {remainingCalls}
                </span>
            </h3>

        </div>
    );
};

export default AIComponent;