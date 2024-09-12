'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import build from 'next/dist/build';

export default function Signup({ onSignupSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [preferredUsername, setPreferredUsername] = useState('');
    const [error, setError] = useState(null);
    const [passwordRequirements, setPasswordRequirements] = useState([
        { text: "At least 8 characters long", met: false },
        { text: "Contains at least 1 number", met: false },
        { text: "Contains at least 1 special character", met: false },
        { text: "Contains at least 1 uppercase letter", met: false },
        { text: "Contains at least 1 lowercase letter", met: false },
    ]);
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const { signup, confirmSignUp, resendConfirmationCode } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const updatedRequirements = [
            { text: "At least 8 characters long", met: password.length >= 8 },
            { text: "Contains at least 1 number", met: /\d/.test(password) },
            { text: "Contains at least 1 special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
            { text: "Contains at least 1 uppercase letter", met: /[A-Z]/.test(password) },
            { text: "Contains at least 1 lowercase letter", met: /[a-z]/.test(password) },
        ];
        setPasswordRequirements(updatedRequirements);
    }, [password]);

    useEffect(() => {
        let redirectTimer;
        if (verificationSuccess && router) {
            redirectTimer = setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
        return () => clearTimeout(redirectTimer);
    }, [verificationSuccess, router]);
    // trigger for amplify build

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || !confirmPassword || !name || !preferredUsername) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (!passwordRequirements.every(req => req.met)) {
            setError('Please ensure your password meets all requirements.');
            return;
        }

        try {
            await signup(email, password, name, preferredUsername);
            setVerificationSent(true);
        } catch (error) {
            console.error('Signup failed:', error);
            if (error.code === 'UsernameExistsException') {
                setError('An account with this email already exists. If you haven\'t confirmed your email, click "Resend Code".');
                setVerificationSent(true);
            } else {
                setError(error.message || 'Signup failed. Please try again.');
            }
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            await confirmSignUp(email, verificationCode);
            setVerificationSuccess(true);
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

    return (
        <>
            {verificationSuccess ? (
                <div className="text-center">
                    <p className="text-green-600 font-bold mb-4">Email verified successfully!</p>
                    <p className="text-gray-700 dark:text-gray-300">Redirecting to login page in 3 seconds...</p>
                </div>
            ) : verificationSent ? (
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
            ) : (
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
                        <label htmlFor="preferredUsername" className="block mb-1 text-gray-700 dark:text-gray-300">Preferred Username</label>
                        <input
                            type="text"
                            id="preferredUsername"
                            value={preferredUsername}
                            onChange={(e) => setPreferredUsername(e.target.value)}
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

                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Sign Up</button>
                    {error && error.includes('already exists') && (
                        <button type="button" onClick={handleResendCode} className="w-full p-2 mt-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Resend Verification Code
                        </button>
                    )}
                </form>
            )}
        </>
    );
}
