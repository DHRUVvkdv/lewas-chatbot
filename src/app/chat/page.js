'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function Chat() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (message) => {
        setMessages([...messages, { text: message, sender: 'user' }]);
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { text: "This is a simulated response.", sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-surface rounded-lg shadow-lg">
            <div className="flex-grow overflow-auto p-4">
                <ChatMessages messages={messages} />
            </div>
            <div className="p-4 border-t border-main">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}