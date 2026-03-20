"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Leaf,
    Package,
    Activity,
    Sprout,
    BarChart3,
    Zap,
    Settings,
    LogOut,
    ChevronRight,
    User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const agriculteurItems = [
        { name: 'Tableau de Bord', href: '/dashboard/ferme', icon: LayoutDashboard },
        { name: 'Diagnostic Plante', href: '/dashboard/ferme/diagnostic', icon: Leaf },
        { name: 'Mes Lots', href: '/dashboard/ferme/lots', icon: Package },
    ];

    const qualiteItems = [
        { name: 'Console Station', href: '/dashboard/station', icon: LayoutDashboard },
        { name: 'Diagnostic Produit', href: '/dashboard/station/diagnostic', icon: Sprout },
        { name: 'Rapports d\'Agréage', href: '/dashboard/station/rapports', icon: BarChart3 },
        { name: 'Valorisation', href: '/dashboard/station/valorisation', icon: Zap },
    ];

    const menuItems = user?.role === 'agriculteur' ? agriculteurItems : qualiteItems;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-emerald-950 text-white flex flex-col z-50 border-r border-white/5">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="bg-fresh-green p-1.5 rounded-lg">
                    <Leaf className="text-emerald-950 w-6 h-6" />
                </div>
                <span className="font-bold text-xl tracking-tight">EcoAgri <span className="text-fresh-green">IA</span></span>
            </div>

            {/* User Quick Profile */}
            <div className="p-4 mx-4 my-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
                        {user?.username?.substring(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-white/50 capitalize truncate">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-fresh-green text-emerald-950 font-bold shadow-lg shadow-fresh-green/10"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-950" : "text-white/40 group-hover:text-white")} />
                                <span className="text-sm">{item.name}</span>
                            </div>
                            {isActive && <motion.div layoutId="activeInd" className="w-1 h-4 bg-emerald-900 rounded-full" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">Paramètres</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
