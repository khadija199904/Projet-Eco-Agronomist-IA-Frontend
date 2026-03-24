"use client";

import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

export default function ProductionPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-emerald-950">Suivi Production</h1>
                <p className="text-stone-500 mt-1">Analyse des rendements et planification de la production.</p>
            </div>

            <div className="bg-white rounded-3xl border border-emerald-100/50 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto">
                    <Activity className="w-8 h-8 text-stone-300" />
                </div>
                <p className="text-stone-500 italic">[ Module Production en cours de développement ]</p>
            </div>
        </div>
    );
}
