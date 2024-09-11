'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSendMessage = (message) => {
        setMessages([...messages, { text: message, sender: 'user' }]);
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { text: "This is a simulated response.", sender: 'bot' }]);
        }, 1000);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return null; // This will prevent the chat page from rendering before redirect
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-surface rounded-lg shadow-lg">
            <div className="p-4 bg-primary text-white">
                <h2 className="text-xl font-bold">Welcome, {user.attributes.email}</h2>
            </div>
            <div className="flex-grow overflow-auto p-4">
                <ChatMessages messages={messages} />
            </div>
            <div className="p-4 border-t border-main">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}