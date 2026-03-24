"use client";

import React, { useState } from 'react';
import { 
    Search, 
    QrCode, 
    Leaf, 
    ShieldCheck, 
    ChevronRight, 
    Calendar, 
    MapPin, 
    Droplets, 
    Wind,
    ArrowRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { diagnosticAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function ConsumerDashboard() {
    const { user } = useAuth();
    const [qrCode, setQrCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [diagnostic, setDiagnostic] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Charger l'historique au montage
    React.useEffect(() => {
        const saved = localStorage.getItem('freshness_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setDiagnostic(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await diagnosticAPI.uploadConsumerDiagnostic(formData);
            setDiagnostic(data);
            
            // Sauvegarder dans l'historique (max 3)
            const newHistory = [data, ...history.slice(0, 2)];
            setHistory(newHistory);
            localStorage.setItem('freshness_history', JSON.stringify(newHistory));
            
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Erreur lors de l'analyse du produit.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Hero Section - Modern & Clean */}
            <section className="relative overflow-hidden bg-emerald-950 rounded-[48px] p-10 text-white min-h-[300px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-fresh-green/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
                
                <div className="relative z-10 max-w-2xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6"
                    >
                        <span className="w-2 h-2 bg-fresh-green rounded-full animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-fresh-green">Consommation Responsable</span>
                    </motion.div>
                    
                    <h1 className="text-5xl font-serif font-bold leading-tight">
                        Bonjour, <span className="text-fresh-green">{user?.full_name || user?.username}</span>.
                    </h1>
                    <p className="text-xl text-white/70 mt-4 font-light leading-relaxed">
                        Suivez le voyage de vos aliments du champ à votre assiette. Transparence totale, qualité certifiée.
                    </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
                    {[
                        { label: "Produits Scannés", val: "12", icon: QrCode },
                        { label: "Score Éco-Global", val: "A+", icon: Leaf },
                        { label: "Fermes Soutenues", val: "04", icon: MapPin },
                        { label: "Labels Qualité", val: "03", icon: ShieldCheck },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm">
                            <s.icon className="w-5 h-5 text-fresh-green mb-2" />
                            <div className="text-2xl font-bold">{s.val}</div>
                            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Interaction Area */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Search & Scan Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-emerald-100 shadow-sm">
                        <h3 className="text-xl font-bold text-emerald-950 mb-6 font-serif">Diagnostic Fraîcheur</h3>
                        
                        <div className="space-y-4">
                            <input 
                                type="file"
                                id="product-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            
                            <button 
                                onClick={() => document.getElementById('product-upload')?.click()}
                                disabled={isLoading}
                                className="w-full py-4 bg-emerald-950 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all disabled:opacity-50 shadow-xl shadow-emerald-950/20"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Leaf className="w-5 h-5" /> Analyser une Photo</>}
                            </button>

                            <p className="text-[10px] text-center text-stone-400 font-medium px-4 leading-relaxed">
                                Prenez une photo de votre fruit ou légume pour détecter instantanément son état de fraîcheur via notre IA.
                            </p>
                        </div>
                    </div>

                    {/* Recent History List */}
                    {history.length > 0 && (
                        <div className="bg-white rounded-[32px] p-8 border border-emerald-100 shadow-sm">
                            <h3 className="text-sm font-bold text-emerald-950 mb-4 font-serif uppercase tracking-wider">Scans Récents</h3>
                            <div className="space-y-3">
                                {history.map((item, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setDiagnostic(item)}
                                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-50 transition-all border border-transparent hover:border-emerald-100 text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.image_url ? `http://localhost:8000/${item.image_url.replace(/\\/g, '/')}` : "/placeholder.png"} 
                                                className="w-full h-full object-cover"
                                                alt="History"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-emerald-900 truncate">
                                                {(item.detection_details?.label?.toLowerCase() === 'rotten' || item.detection_details?.status_code === 'RED') ? 'Altéré' : 'Frais'}
                                            </p>
                                            <p className="text-[10px] text-stone-400">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {diagnostic ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Main Product Info */}
                                <div className="bg-white rounded-[40px] border border-emerald-100 overflow-hidden shadow-xl">
                                    <div className="grid md:grid-cols-5 h-full">
                                        <div className="md:col-span-2 bg-stone-50 flex items-center justify-center p-4">
                                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-emerald-100 shadow-inner">
                                                <img 
                                                    src={diagnostic.image_url ? `http://localhost:8000/${diagnostic.image_url.replace(/\\/g, '/')}` : "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"} 
                                                    className="w-full h-full object-contain"
                                                    alt="Product Analysis"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-fresh-green text-emerald-950 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">VÉRIFIÉ PAR IA</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="md:col-span-3 p-8 md:p-10 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-3xl font-serif font-bold text-emerald-950 uppercase tracking-tight">
                                                        {(diagnostic.detection_details?.label?.toLowerCase() === 'rotten' || diagnostic.detection_details?.status_code === 'RED') ? 'Produit Altéré' : 'Produit Frais'}
                                                    </h2>
                                                    <p className="text-stone-500 font-medium tracking-tight">
                                                        Analysé le {new Date(diagnostic.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "p-3 rounded-2xl flex flex-col items-center border",
                                                    diagnostic.detection_details?.status_code === 'RED' 
                                                        ? "bg-red-50 border-red-100" 
                                                        : "bg-emerald-50 border-emerald-100"
                                                )}>
                                                    <span className={cn(
                                                        "text-[8px] font-bold uppercase tracking-widest",
                                                        diagnostic.detection_details?.status_code === 'RED' ? "text-red-600" : "text-emerald-600"
                                                    )}>Indice Fraîcheur</span>
                                                    <span className={cn(
                                                        "text-2xl font-black",
                                                        diagnostic.detection_details?.status_code === 'RED' ? "text-red-900" : "text-emerald-900"
                                                    )}>{Math.round((diagnostic.freshness_score || 0) * 100)}%</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {diagnostic.is_edible ? (
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5 uppercase">
                                                        <CheckCircle2 className="w-3 h-3" /> Consommable
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100 flex items-center gap-1.5 uppercase">
                                                        <AlertCircle className="w-3 h-3" /> Non Consommable
                                                    </span>
                                                )}
                                                <span className="px-3 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-lg border border-sky-100 flex items-center gap-1.5 uppercase">
                                                    <ShieldCheck className="w-3 h-3" /> IA-Verfied
                                                </span>
                                                <span className="px-3 py-1 bg-stone-50 text-stone-700 text-[10px] font-bold rounded-lg border border-stone-100 flex items-center gap-1.5 uppercase">
                                                    <Leaf className="w-3 h-3" /> Zéro Pesticide
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
                                                        <MapPin className="text-stone-400 w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Origine</p>
                                                        <p className="text-sm font-bold text-stone-800">Souss-Massa, Maroc</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
                                                        <Wind className="text-stone-400 w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">État Détecté</p>
                                                        <p className="text-sm font-bold text-stone-800 capitalize">{diagnostic.detection_details?.label || "Inconnu"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Traceability Timeline */}
                                <div className="bg-white rounded-[32px] p-8 border border-emerald-100">
                                    <h4 className="font-bold text-emerald-950 mb-8 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-fresh-green" /> Le Parcours du Produit
                                    </h4>
                                    
                                    <div className="relative space-y-10 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-50">
                                        {/* Step 1 */}
                                        <div className="relative pl-12">
                                            <div className="absolute left-0 w-10 h-10 bg-white border-2 border-fresh-green rounded-full flex items-center justify-center z-10">
                                                <CheckCircle2 className="w-6 h-6 text-fresh-green" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Étape 01 : Récolte</p>
                                                <p className="text-sm font-bold text-emerald-950 uppercase">Agri-Ferme Bio Souss</p>
                                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">Récolte manuelle à maturité optimale. Aucun produit chimique appliqué post-récolte.</p>
                                            </div>
                                        </div>
                                        
                                        {/* Step 2 */}
                                        <div className="relative pl-12">
                                            <div className="absolute left-0 w-10 h-10 bg-white border-2 border-emerald-800 rounded-full flex items-center justify-center z-10 shadow-lg">
                                                <ShieldCheck className="w-6 h-6 text-emerald-800" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Étape 02 : Contrôle IA</p>
                                                <p className="text-sm font-bold text-emerald-950 uppercase">Station d'Excellence Agadir</p>
                                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">Diagnostic multi-spectral via EcoAgri IA. Score de conformité export : 98%.</p>
                                            </div>
                                        </div>
                                        
                                        {/* Step 3 */}
                                        <div className="relative pl-12">
                                            <div className="absolute left-0 w-10 h-10 bg-fresh-green rounded-full flex items-center justify-center z-10 ring-8 ring-emerald-50">
                                                <Calendar className="w-5 h-5 text-emerald-950" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Étape 03 : Vente</p>
                                                <p className="text-sm font-bold text-emerald-950 uppercase">Votre Panier Consom'</p>
                                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">Livré à la station locale ou supermarché partenaire.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : error ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-100 p-8 rounded-[32px] flex flex-col items-center text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-950">Oups ! Produit introuvable</h3>
                                    <p className="text-sm text-red-800/70 mt-1">{error}</p>
                                </div>
                                <button 
                                    onClick={() => { setError(null); setQrCode(""); }}
                                    className="bg-white border border-red-200 px-6 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-white/50 transition-all"
                                >
                                    Fermer
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-white/50 backdrop-blur-sm border border-dashed border-stone-200 rounded-[40px] p-20 flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center">
                                    <Leaf className="w-10 h-10 text-stone-300" />
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-lg font-bold text-emerald-950">En attente d'analyse</h3>
                                    <p className="text-sm text-stone-400 mt-1">Téléchargez une photo pour voir les détails de fraîcheur du produit.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
