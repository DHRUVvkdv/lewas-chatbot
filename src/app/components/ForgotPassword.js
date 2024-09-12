'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword({ onResetSuccess }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { forgotPassword, confirmForgotPassword } = useAuth();

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
        try {
            await confirmForgotPassword(email, code, newPassword);
            setSuccess('Password reset successful. You can now log in with your new password.');
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
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Reset Password
                    </button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleConfirmNewPassword} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block mb-1 text-sm font-medium text-gray-700">Verification Code</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Confirm New Password
                    </button>
                </form>
            )}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
        </div>
    );
}