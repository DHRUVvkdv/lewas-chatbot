'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword({ onResetSuccess }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [passwordRequirements, setPasswordRequirements] = useState([
        { text: "At least 8 characters long", met: false },
        { text: "Contains at least 1 number", met: false },
        { text: "Contains at least 1 special character", met: false },
        { text: "Contains at least 1 uppercase letter", met: false },
        { text: "Contains at least 1 lowercase letter", met: false },
    ]);

    const { forgotPassword, confirmForgotPassword } = useAuth();

    useEffect(() => {
        const updatedRequirements = [
            { text: "At least 8 characters long", met: newPassword.length >= 8 },
            { text: "Contains at least 1 number", met: /\d/.test(newPassword) },
            { text: "Contains at least 1 special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
            { text: "Contains at least 1 uppercase letter", met: /[A-Z]/.test(newPassword) },
            { text: "Contains at least 1 lowercase letter", met: /[a-z]/.test(newPassword) },
        ];
        setPasswordRequirements(updatedRequirements);
    }, [newPassword]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await forgotPassword(email);
            setSuccess('Verification code sent to your email.');
            setStep(2);
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        }
    };

    const handleConfirmNewPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmNewPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (!passwordRequirements.every(req => req.met)) {
            setError('Please ensure your new password meets all the requirements.');
            return;
        }

        try {
            await confirmForgotPassword(email, code, newPassword);
            setSuccess('Password reset successful. Redirecting to login page! You can now log in with your new password.');
            setTimeout(() => {
                onResetSuccess();
            }, 3000);
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div>
            {step === 1 && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Reset Password
                    </button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleConfirmNewPassword} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            required
                        />
                    </div>

                    {/* Password Requirements Section */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Password requirements:</p>
                        {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {req.met ? (
                                    <svg className="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <p className={`${req.met ? 'text-green-500' : 'text-red-500'} text-sm`}>{req.text}</p>
                            </div>
                        ))}
                    </div>

                    {error && <p className="mt-4 text-sm text-red-600 dark:text-red-500">{error}</p>}
                    {success && <p className="mt-4 text-sm text-green-600 dark:text-green-500">{success}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Confirm New Password
                    </button>
                </form>
            )}
        </div>
    );
}
