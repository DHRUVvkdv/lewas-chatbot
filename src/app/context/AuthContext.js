'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const userData = await Auth.currentAuthenticatedUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function checkConnection() {
        try {
            await Auth.currentCredentials();
            return { success: true, message: 'Successfully connected to AWS Cognito' };
        } catch (error) {
            console.error('Connection check failed:', error);
            return { success: false, message: 'Failed to connect to AWS Cognito. Please check your configuration.' };
        }
    }

    async function login(username, password) {
        try {
            const user = await Auth.signIn(username, password);
            setUser(user);
            setError(null);
            return user;
        } catch (error) {
            setError('Failed to sign in. Please check your credentials.');
            console.error('Error signing in:', error);
            throw error;
        }
    }

    async function logout() {
        try {
            await Auth.signOut();
            setUser(null);
            setError(null);
        } catch (error) {
            setError('Failed to sign out. Please try again.');
            console.error('Error signing out:', error);
        }
    }

    const value = {
        user,
        login,
        logout,
        loading,
        error,
        checkConnection
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);