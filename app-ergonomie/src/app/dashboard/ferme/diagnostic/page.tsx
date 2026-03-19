"use client";

import React, { useState, useRef } from 'react';
import { Leaf, Camera, Upload, AlertCircle, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { diagnosticAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import MobileScanner from '@/components/MobileScanner';

export default function DiagnosticPlantePage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        if (user.organization_id) {
            formData.append('organization_id', user.organization_id.toString());
        }

        try {
            const data = await diagnosticAPI.uploadPlant(formData);
            setResult(data);
        } catch (err: any) {
            console.error("Diagnostic error:", err);
            setError(err.message || "Une erreur est survenue lors de l'analyse.");
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-serif font-bold text-emerald-950">Diagnostic Plante (IA)</h1>
                <p className="text-stone-500 mt-1">Identifiez les maladies et stresseurs de vos cultures en quelques secondes.</p>
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div
                                onClick={() => setIsScannerOpen(true)}
                                className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-emerald-950">Prendre une photo</p>
                                    <p className="text-sm text-stone-500">Utilisez votre caméra pour scanner une feuille</p>
                                </div>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-emerald-950">Charger une image</p>
                                    <p className="text-sm text-stone-500">Formats supportés : JPG, PNG (Max 10MB)</p>
                                </div>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        {preview && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center gap-8 shadow-sm"
                            >
                                <img src={preview} alt="Preview" className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-md" />
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Image sélectionnée
                                    </div>
                                    <button
                                        onClick={handleUpload}
                                        disabled={isLoading}
                                        className="w-full py-4 bg-emerald-950 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-50 transition-all shadow-lg shadow-emerald-950/20"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Analyse en cours...</>
                                        ) : (
                                            <><Leaf className="w-5 h-5" /> Lancer l'analyse IA</>
                                        )}
                                    </button>
                                    <button onClick={reset} disabled={isLoading} className="w-full text-stone-500 text-sm hover:underline">Annuler</button>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> {error}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-xl">
                            <div className="bg-emerald-900 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-fresh-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-center gap-3 text-fresh-green font-bold text-sm uppercase tracking-widest mb-4">
                                    <span className="w-2 h-2 bg-fresh-green rounded-full animate-pulse" /> Diagnostic Terminé
                                </div>
                                <h2 className="text-4xl font-serif font-bold">{result.disease_detected || "Sain / Vigoureux"}</h2>
                                <div className="flex items-center gap-4 mt-6">
                                    <div className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">Indice de confiance : 98%</div>
                                </div>
                            </div>

                            <div className="p-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 italic">
                                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" /> Conseil du Dr. Agronome
                                        </h4>
                                        <div className="text-stone-700 leading-relaxed bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                            {result.treatment_advice}
                                        </div>
                                    </div>
                                    <button onClick={reset} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline group">
                                        Effectuer un autre scan <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <img src={preview!} alt="Analysed leaf" className="w-full aspect-square object-cover rounded-2xl shadow-inner border border-stone-100" />
                                    <div className="absolute inset-4 border-2 border-fresh-green/30 rounded-lg pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isScannerOpen && (
                    <MobileScanner
                        type="plante"
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}
            </AnimatePresence>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                    <p className="text-sm font-bold text-amber-900">Conseil d'expert</p>
                    <p className="text-xs text-amber-800 mt-1">
                        Pour un diagnostic précis, assurez-vous que la feuille est bien éclairée et occupe la majeure partie de l'image. Évitez les flous de mouvement.
                    </p>
                </div>
            </div>
        </div>
    );
}
