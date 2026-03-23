"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user, isInitialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized) {
            console.log("Dashboard redirect - User Role:", user?.role);
            if (user?.role === 'agriculteur') {
                router.push('/dashboard/ferme');
            } else if (user?.role === 'consommateur') {
                router.push('/dashboard/consommateur');
            } else {
                // Default to station for qualite or unknown roles
                router.push('/dashboard/station');
            }
        }
    }, [user, isInitialized, router]);

    return null;
}
