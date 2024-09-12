'use client';

import React, { useState, useEffect } from 'react';
import { Check, X } from "lucide-react";

const PasswordValidation = ({ onChange }) => {
    const [password, setPassword] = useState('');
    const [requirements, setRequirements] = useState([
        { text: "At least 8 characters long", met: false },
        { text: "Contains at least 1 number", met: false },
        { text: "Contains at least 1 special character", met: false },
        { text: "Contains at least 1 uppercase letter", met: false },
        { text: "Contains at least 1 lowercase letter", met: false },
    ]);

    useEffect(() => {
        const updatedRequirements = [
            { text: "At least 8 characters long", met: password.length >= 8 },
            { text: "Contains at least 1 number", met: /\d/.test(password) },
            { text: "Contains at least 1 special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
            { text: "Contains at least 1 uppercase letter", met: /[A-Z]/.test(password) },
            { text: "Contains at least 1 lowercase letter", met: /[a-z]/.test(password) },
        ];
        setRequirements(updatedRequirements);
        onChange(password, updatedRequirements.every(req => req.met));
    }, [password, onChange]);

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="space-y-2">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                            <Check className="text-green-500" size={16} />
                        ) : (
                            <X className="text-red-500" size={16} />
                        )}
                        <span className={`text-sm ${req.met ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordValidation;