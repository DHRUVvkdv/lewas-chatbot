'use client';

import { useState } from 'react';

export default function ChatInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-main"
                placeholder="Type your message..."
            />
            <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark"
            >
                Send
            </button>
        </form>
    );
}