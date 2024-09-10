'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ThemeToggle from '../components/ThemeToggle';

export default function Chat() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (message) => {
        setMessages([...messages, { text: message, sender: 'user' }]);
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { text: "This is a simulated response.", sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <div className="flex justify-between items-center p-4 bg-blue-600 dark:bg-blue-800 text-white">
                <h1 className="text-2xl font-bold">Chatbot</h1>
                <ThemeToggle />
            </div>
            <div className="flex-grow overflow-auto p-4">
                <ChatMessages messages={messages} />
            </div>
            <div className="p-4 border-t dark:border-gray-700">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}