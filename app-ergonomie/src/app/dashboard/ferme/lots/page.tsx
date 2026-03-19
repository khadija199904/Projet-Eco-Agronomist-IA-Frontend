"use client";

import React from 'react';
import { Package, Plus, ClipboardList } from 'lucide-react';

export default function LotsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950">Gestion des Lots</h1>
                    <p className="text-stone-500 mt-1">Gérez vos récoltes et préparez les envois en station.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-950/20">
                    <Plus className="w-5 h-5" />
                    Créer un Lot
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-emerald-100/50 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto">
                    <ClipboardList className="w-8 h-8 text-stone-300" />
                </div>
                <div>
                    <p className="text-lg font-bold text-emerald-950">Aucun lot actif</p>
                    <p className="text-sm text-stone-500">Commencez par créer votre premier lot de récolte.</p>
                </div>
            </div>
        </div>
    );
}
