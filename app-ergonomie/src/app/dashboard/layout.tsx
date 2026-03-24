"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isInitialized } = useAuth();
    const router = useRouter();

    // Basic route protection
    React.useEffect(() => {
        // If we're not authenticated, we shouldn't be here
        // But we check for window to avoid SSR issues
        if (isInitialized && !isAuthenticated) {
            router.push('/login');
        }
    }, [isInitialized, isAuthenticated, router]);

    if (!isInitialized || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-stone-100 font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
