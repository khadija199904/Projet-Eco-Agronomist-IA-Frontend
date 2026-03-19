"use client";

import React from 'react';
import { BarChart3, FileText } from 'lucide-react';

export default function RapportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-emerald-950">Rapports d'Agréage</h1>
                <p className="text-stone-500 mt-1">Synthèse des analyses qualité et taux de conformité.</p>
            </div>

            <div className="bg-white rounded-3xl border border-emerald-100/50 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-stone-300" />
                </div>
                <p className="text-stone-500 italic">[ Historique des rapports en attente de données ]</p>
            </div>
        </div>
    );
}
