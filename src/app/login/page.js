'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [connectionStatus, setConnectionStatus] = useState(null);
    const { login, checkConnection } = useAuth();
    const router = useRouter();

    const handleConnectionCheck = async () => {
        const result = await checkConnection();
        setConnectionStatus(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (connectionStatus && connectionStatus.success) {
            try {
                await login(email, password);
                router.push('/chat');
            } catch (error) {
                console.error('Login failed:', error);
            }
        } else {
            setConnectionStatus({ success: false, message: 'Please check the connection first.' });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login</h2>
            <button
                onClick={handleConnectionCheck}
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Check Connection
            </button>
            {connectionStatus && (
                <p className={`mb-4 ${connectionStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                    {connectionStatus.message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Login</button>
            </form>
        </div>
    );
}