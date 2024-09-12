'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PasswordValidation from '../components/PasswordValidation';

export default function Signup({ onSignupSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const { signup, confirmSignUp, resendConfirmationCode } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (!isPasswordValid) {
            setError('Please ensure your password meets all requirements.');
            return;
        }

        try {
            await signup(email, password, name);
            setVerificationSent(true);
        } catch (error) {
            console.error('Signup failed:', error);
            setError(error.message || 'Signup failed. Please try again.');
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            await confirmSignUp(email, verificationCode);
            onSignupSuccess();
        } catch (error) {
            console.error('Verification failed:', error);
            setError(error.message || 'Verification failed. Please try again.');
        }
    };

    const handleResendCode = async () => {
        try {
            await resendConfirmationCode(email);
            setError('A new verification code has been sent to your email.');
        } catch (error) {
            console.error('Resend code failed:', error);
            setError(error.message || 'Failed to resend code. Please try again.');
        }
    };

    const handlePasswordChange = (newPassword, isValid) => {
        setPassword(newPassword);
        setIsPasswordValid(isValid);
    };

    if (verificationSent) {
        return (
            <form onSubmit={handleVerification} className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">Please check your email for a verification code.</p>
                <div>
                    <label htmlFor="verificationCode" className="block mb-1 text-gray-700 dark:text-gray-300">Verification Code</label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Verify Email</button>
                <button type="button" onClick={handleResendCode} className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Resend Code</button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                />
            </div>
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
                    onChange={(e) => handlePasswordChange(e.target.value, isPasswordValid)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                />
            </div>
            <PasswordValidation onChange={handlePasswordChange} />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Sign Up</button>
        </form>
    );
}