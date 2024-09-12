'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    InitiateAuthCommand,
    GetUserCommand,
    GlobalSignOutCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, CLIENT_ID, getSafeConfig } from '../aws-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const command = new GetUserCommand({ AccessToken: token });
                const userData = await cognitoClient.send(command);
                const userAttributes = {};
                userData.UserAttributes.forEach(attr => {
                    userAttributes[attr.Name] = attr.Value;
                });
                setUser({ ...userData, attributes: userAttributes });
            } catch (error) {
                console.error('Error checking user:', error);
                localStorage.removeItem('accessToken');
                setUser(null);
            }
        }
        setLoading(false);
    }

    async function checkConnection() {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: "test_user",
                    PASSWORD: "test_password"
                }
            });
            await cognitoClient.send(command);
            const safeConfig = getSafeConfig();
            return {
                success: true,
                message: 'Successfully connected to AWS Cognito',
                config: safeConfig
            };
        } catch (error) {
            console.error('Connection check failed:', error);
            const safeConfig = getSafeConfig();
            return {
                success: false,
                message: `Failed to connect to AWS Cognito: ${error.message}`,
                config: safeConfig,
                error: error.toString()
            };
        }
    }

    async function login(username, password) {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                },
            });
            const response = await cognitoClient.send(command);
            const token = response.AuthenticationResult.AccessToken;
            localStorage.setItem('accessToken', token);
            await checkUser(); // This will set the user state
            setError(null);
            return user;
        } catch (error) {
            setError('Failed to sign in. Please check your credentials.');
            console.error('Error signing in:', error);
            throw error;
        }
    }

    async function logout() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const command = new GlobalSignOutCommand({ AccessToken: token });
                await cognitoClient.send(command);
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
        localStorage.removeItem('accessToken');
        setUser(null);
        setError(null);
    }

    const signup = async (email, password, name, preferredUsername) => {
        try {
            const command = new SignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                Password: password,
                UserAttributes: [
                    { Name: "email", Value: email },
                    { Name: "name", Value: name },
                    { Name: "preferred_username", Value: preferredUsername }
                ]
            });
            const response = await cognitoClient.send(command);
            return response;
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const confirmSignUp = async (email, code) => {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                ConfirmationCode: code
            });
            const response = await cognitoClient.send(command);
            return response;
        } catch (error) {
            console.error('Error confirming sign up:', error);
            throw error;
        }
    };

    const resendConfirmationCode = async (email) => {
        try {
            const command = new ResendConfirmationCodeCommand({
                ClientId: CLIENT_ID,
                Username: email
            });
            const response = await cognitoClient.send(command);
            return response;
        } catch (error) {
            console.error('Error resending confirmation code:', error);
            throw error;
        }
    };

    const forgotPassword = async (username) => {
        try {
            const command = new ForgotPasswordCommand({
                ClientId: CLIENT_ID,
                Username: username
            });
            const response = await cognitoClient.send(command);
            return response;
        } catch (error) {
            console.error('Error initiating forgot password:', error);
            throw error;
        }
    };

    const confirmForgotPassword = async (username, code, newPassword) => {
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: CLIENT_ID,
                Username: username,
                ConfirmationCode: code,
                Password: newPassword
            });
            const response = await cognitoClient.send(command);
            return response;
        } catch (error) {
            console.error('Error confirming forgot password:', error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        loading,
        error,
        checkConnection,
        signup,
        confirmSignUp,
        resendConfirmationCode,
        forgotPassword,
        confirmForgotPassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);