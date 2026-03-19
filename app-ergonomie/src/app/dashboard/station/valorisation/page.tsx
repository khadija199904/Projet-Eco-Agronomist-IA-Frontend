"use client";

import React, { useState } from 'react';
import { Zap, Share2, Camera } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import MobileScanner from '@/components/MobileScanner';

export default function ValorisationPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-emerald-950">Valorisation</h1>
        <p className="text-stone-500 mt-1">Optimisation des circuits de distribution basés sur la qualité.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div
          onClick={() => setIsScannerOpen(true)}
          className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer"
        >
          <div className="w-16 h-16 bg-fresh-green/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-fresh-green" />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-950">Scanner un produit fini</p>
            <p className="text-sm text-stone-500">Vérifier l'étiquetage et le conditionnement</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100/50 p-12 text-center space-y-4 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-stone-300" />
          </div>
          <p className="text-stone-500 italic">[ Module Valorisation en cours de développement ]</p>
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
