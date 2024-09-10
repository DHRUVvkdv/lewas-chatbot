'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        // Here you would typically handle the logout logic
        console.log('Logging out...');
        // After logout, redirect to home page
        setTimeout(() => router.push('/'), 2000);
    }, [router]);

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Logging Out</h2>
            <p>You are being logged out. Redirecting to home page...</p>
        </div>
    );
}