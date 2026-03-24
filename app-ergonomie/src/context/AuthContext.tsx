"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api';

interface AuthContextType {
    token: string | null;
    user: User | null;
    loginState: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom helper to decode JWT without external libraries
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const decoded = parseJwt(storedToken);
            if (decoded) {
                // The token payload usually contains sub (username) and sometimes role.
                // We set a minimal user object based on the JWT payload.
                console.log("Decoded Token Payload:", decoded);
                const userObj: User = {
                    id: decoded.id || 0,
                    email: decoded.email || '',
                    username: decoded.sub || '',
                    role: decoded.role || 'user',
                    organization_id: decoded.organization_id || null,
                    is_active: true
                };
                console.log("Setting user from token:", userObj);
                setUser(userObj);
            }
        }
        setIsInitialized(true);
    }, []);

    const loginState = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = parseJwt(newToken);
        if (decoded) {
            console.log("Decoded Token Payload (Login):", decoded);
            const userObj: User = {
                id: decoded.id || 0,
                email: decoded.email || '',
                username: decoded.sub || '',
                role: decoded.role || 'user',
                organization_id: decoded.organization_id || null,
                is_active: true
            };
            console.log("Setting user from login token:", userObj);
            setUser(userObj);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            loginState,
            logout,
            isAuthenticated: !!token,
            isInitialized
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
