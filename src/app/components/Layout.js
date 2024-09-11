'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

function NavContent() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            {user && <Link href="/chat" className="hover:underline">Chat</Link>}
            {!user && <Link href="/login" className="hover:underline">Login</Link>}
            {user && <button onClick={handleLogout} className="hover:underline">Logout</button>}
            <ThemeToggle />
        </nav>
    );
}

export default function Layout({ children }) {
    const { darkMode } = useTheme();

    return (
        <AuthProvider>
            <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
                <div className="flex flex-col min-h-screen bg-main text-main transition-colors duration-200">
                    <header className="bg-primary text-white p-4">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-2xl font-bold">My Chatbot App</h1>
                            <NavContent />
                        </div>
                    </header>
                    <main className="flex-grow container mx-auto p-4">
                        {children}
                    </main>
                    <footer className="bg-secondary text-secondary text-center p-4">
                        <p>© 2024 My Chatbot App</p>
                    </footer>
                </div>
            </div>
        </AuthProvider>
    );
}