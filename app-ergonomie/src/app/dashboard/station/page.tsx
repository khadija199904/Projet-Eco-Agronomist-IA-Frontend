"use client";

import React from 'react';
import {
    BarChart3,
    Truck,
    ShieldCheck,
    Zap,
    LayoutGrid,
    Search
} from 'lucide-react';
import { motion } from 'motion/react';

export default function StationDashboard() {
    const stats = [
        { label: "Lots Arrivants", value: "8", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Lots À Valoriser", value: "3", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Vérifiés ONSSA", value: "100%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Qualité Moyenne", value: "88%", icon: BarChart3, color: "text-fresh-green", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950">Console Station</h1>
                    <p className="text-stone-500 mt-1">Surveillez les arrivages et optimisez la valorisation de la récolte.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="w-5 h-5 absolute left-3 top-3.5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un lot..."
                            className="pl-10 pr-4 py-3 bg-white border border-emerald-100/50 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-64"
                        />
                    </div>
                    <button className="p-3 bg-white border border-emerald-100/50 rounded-xl hover:bg-emerald-50 transition-all">
                        <LayoutGrid className="w-5 h-5 text-emerald-900" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-emerald-100/50 shadow-sm flex items-center gap-5"
                    >
                        <div className={cn("p-4 rounded-2xl", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-emerald-950">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-white rounded-3xl border border-emerald-100/50 p-8 shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-emerald-950 mb-6 font-serif text-xl border-b border-stone-50 pb-4">Lots Récents en Attente de Contrôle</h3>
                    <div className="text-center py-20 text-stone-400 flex flex-col items-center gap-4">
                        <Truck className="w-12 h-12 opacity-20" />
                        <p>Liste des lots entrants après scan en station...</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fresh-green/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
                        <h4 className="font-bold text-lg relative z-10">Optimisation Export</h4>
                        <p className="text-sm text-white/70 mt-2 relative z-10">Actuellement 68% de vos lots remplissent les critères Export Europe.</p>
                        <button className="w-full mt-6 py-3 bg-fresh-green text-emerald-950 font-bold rounded-xl hover:bg-emerald-400 transition-all relative z-10">
                            Voir l'analyse
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-emerald-100/50 p-6 shadow-sm">
                        <h4 className="font-bold text-emerald-950 mb-4">Météo Valorisation</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">☀️</div>
                            <div>
                                <p className="text-sm font-bold text-emerald-950">Saison Haute</p>
                                <p className="text-xs text-stone-500">Prix marché stables (+2% / sem)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper temporary for the mockup
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
