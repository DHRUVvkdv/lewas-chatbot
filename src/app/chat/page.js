'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Get API Key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [fullResponse, setFullResponse] = useState(null);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSendMessage = async (message) => {
        // Add user's message to the chat
        setMessages([...messages, { text: message, sender: 'user' }]);

        try {
            // Make a request to your Lambda API
            const response = await fetch(API_ENDPOINT + "/query_documents", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'API-Key': API_KEY,
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ query_text: message }),
            });
            const data = await response.json();
            console.log(data);

            // Set the full response
            setFullResponse(data);

            // Add a simple bot response to the chat
            setMessages(prevMessages => [...prevMessages, { text: "Response received. See full details below.", sender: 'bot' }]);
        } catch (error) {
            console.error("Error while calling the Lambda API:", error);
            setMessages(prevMessages => [...prevMessages, { text: "Error: Could not contact the server.", sender: 'bot' }]);
            setFullResponse(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return null; // This will prevent the chat page from rendering before redirect
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-2">Welcome, {user.attributes.preferred_username}</h2>
                <div className="h-64 overflow-auto mb-4 border border-gray-200 rounded p-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        className="flex-grow mr-2 p-2 border border-gray-300 rounded"
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            const input = document.querySelector('input');
                            handleSendMessage(input.value);
                            input.value = '';
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
            {fullResponse && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-bold mb-2">Full Response from Backend:</h3>
                    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                        {JSON.stringify(fullResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}