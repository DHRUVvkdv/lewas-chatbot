'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ForgotPassword from '../components/ForgotPassword';

export default function LoginSignup() {
    const [activeTab, setActiveTab] = useState('login');
    const [connectionStatus, setConnectionStatus] = useState(null);
    const { checkConnection } = useAuth();

    const handleConnectionCheck = async () => {
        const result = await checkConnection();
        setConnectionStatus(result);
    };

    const handleSignupSuccess = () => {
        setActiveTab('login');
    };

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'login':
                return (
                    <>
                        <Login />
                        <button
                            onClick={() => setActiveTab('forgotPassword')}
                            className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                        >
                            Forgot Password?
                        </button>
                    </>
                );
            case 'signup':
                return <Signup onSignupSuccess={handleSignupSuccess} />;
            case 'forgotPassword':
                return <ForgotPassword onResetSuccess={() => setActiveTab('login')} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2 ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-lg`}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 py-2 ${activeTab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-lg`}
                >
                    Sign Up
                </button>
            </div>
            {/* This is the button that checks the connection status */}
            {/* <button
                onClick={handleConnectionCheck}
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Check Connection
            </button> */}
            {/* {connectionStatus && (
                <div className="mb-4">
                    <p className={`${connectionStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                        {connectionStatus.message}
                    </p>
                    {connectionStatus.config && (
                        <div className="mt-2 text-sm">
                            <p>Region: {connectionStatus.config.region}</p>
                            <p>User Pool ID: {connectionStatus.config.userPoolId}</p>
                            <p>Client ID: {connectionStatus.config.clientId}</p>
                        </div>
                    )}
                    {connectionStatus.error && (
                        <p className="mt-2 text-sm text-red-500">
                            Error details: {connectionStatus.error}
                        </p>
                    )}
                </div>
            )} */}
            {renderActiveComponent()}
        </div>
    );
}