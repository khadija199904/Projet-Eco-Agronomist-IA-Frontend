"use client";

import React, { useState } from 'react';
import { Sprout, Search, Camera } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import MobileScanner from '@/components/MobileScanner';

export default function DiagnosticProduitPage() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-emerald-950">Diagnostic Produit (IA)</h1>
                <p className="text-stone-500 mt-1">Contrôle qualité automatique des fruits et légumes arrivants.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-emerald-950">Lancer un scan caméra</p>
                        <p className="text-sm text-stone-500">Poste de contrôle fixe ou mobile</p>
                    </div>
                </div>

                <div className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Search className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-emerald-950">Analyser un lot par ID</p>
                        <p className="text-sm text-stone-500">Récupérer les scans existants pour ce lot</p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isScannerOpen && (
                    <MobileScanner
                        type="produit"
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
