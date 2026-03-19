"use client";

import React from 'react';
import {
    Sprout,
    Leaf,
    Package,
    TrendingUp,
    AlertCircle,
    Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export default function FermeDashboard() {
    const stats = [
        { label: "Cultures Actives", value: "4", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Alertes Maladies", value: "1", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Lots Prêts", value: "12", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Santé Moyenne", value: "92%", icon: TrendingUp, color: "text-fresh-green", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950">Espace Ferme</h1>
                    <p className="text-stone-500 mt-1">Gérez votre exploitation et surveillez la santé de vos cultures.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-950/20">
                    <Plus className="w-5 h-5" />
                    Nouveau Diagnostic
                </button>
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
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-emerald-100/50 p-8 shadow-sm h-96 flex items-center justify-center text-stone-400 italic">
                        [ Graphique d'évolution de la santé des cultures ]
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-emerald-100/50 p-8 shadow-sm">
                    <h3 className="font-bold text-emerald-950 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" /> Notifications Récentes
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                            <p className="text-sm font-bold text-amber-900">Mildiou détecté (Zone B2)</p>
                            <p className="text-xs text-amber-700 mt-1">Il y a 2 heures • Tension modérée</p>
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <p className="text-sm font-bold text-emerald-900">Lot #4552 Finalisé</p>
                            <p className="text-xs text-emerald-700 mt-1">Prêt pour expédition en station</p>
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
