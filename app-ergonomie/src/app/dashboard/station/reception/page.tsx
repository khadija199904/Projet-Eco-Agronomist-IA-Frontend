"use client";

import React, { useState, useEffect } from 'react';
import { Package, Truck, Scale, ClipboardList, CheckCircle2, Loader2, AlertCircle, ChevronRight, History, LayoutDashboard } from 'lucide-react';
import { productionAPI, valorisationAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function ReceptionPage() {
    const { user } = useAuth();
    const [farms, setFarms] = useState<any[]>([]);
    const [selectedFarmId, setSelectedFarmId] = useState<string>("");
    const [lots, setLots] = useState<any[]>([]);
    const [selectedLotId, setSelectedLotId] = useState<string>("");
    const [poids, setPoids] = useState<string>("");
    const [etat, setEtat] = useState<string>("Frais");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger les Fermes au montage
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8000/api/v1/organization/', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (!res.ok) {
                    console.error("Erreur HTTP organisations:", res.status);
                    return;
                }
                const data = await res.json();
                console.log("Organisations reçues:", data);
                // OrgType.FERME = "ferme" (enum backend, lowercase)
                const filteredFarms = data.filter((org: any) =>
                    org.type?.toLowerCase() === 'ferme'
                );
                console.log("Fermes filtrées:", filteredFarms);
                setFarms(filteredFarms);
                if (filteredFarms.length > 0) {
                    setSelectedFarmId(filteredFarms[0].id.toString());
                }
            } catch (err) {
                console.error("Erreur chargement fermes:", err);
            }
        };
        fetchFarms();
    }, []);

    // Charger les lots quand la ferme change
    useEffect(() => {
        if (!selectedFarmId) return;

        const fetchLots = async () => {
            try {
                // Utilise la nouvelle API de filtrage par ferme
                const res = await fetch(`http://localhost:8000/api/v1/production/lots?ferme_id=${selectedFarmId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setLots(data);
                if (data.length > 0) {
                    setSelectedLotId(data[0].id.toString());
                } else {
                    setSelectedLotId("");
                }
            } catch (err) {
                console.error("Erreur chargement lots:", err);
            }
        };
        fetchLots();
    }, [selectedFarmId]);

    const handleReception = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLotId || !poids) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await valorisationAPI.recordReception({
                lot_recolte_id: parseInt(selectedLotId),
                poids_reception: parseFloat(poids),
                etat_initial: etat
            });
            setIsSuccess(true);
            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
                setPoids("");
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'enregistrement.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-serif font-bold text-emerald-950">Réception des Lots</h1>
                <p className="text-stone-500 mt-1">Enregistrez l'arrivée physique des récoltes à la station.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Formulaire de Réception */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-3 text-emerald-900 font-bold uppercase text-xs tracking-widest">
                            <Truck className="w-4 h-4" /> Formulaire de Réception
                        </div>

                        <form onSubmit={handleReception} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Sélection de la Ferme */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                                        <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Ferme d'Origine
                                    </label>
                                    <select
                                        value={selectedFarmId}
                                        onChange={(e) => setSelectedFarmId(e.target.value)}
                                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    >
                                        <option value="" disabled>Choisir une ferme...</option>
                                        {farms.map(farm => (
                                            <option key={farm.id} value={farm.id}>
                                                {farm.name} (ID: {farm.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sélection du Lot */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-emerald-600" /> Lot de Récolte
                                    </label>
                                    <select
                                        value={selectedLotId}
                                        onChange={(e) => setSelectedLotId(e.target.value)}
                                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        disabled={!selectedFarmId}
                                    >
                                        <option value="" disabled>{selectedFarmId ? "Choisir un lot..." : "Sélectionnez d'abord une ferme"}</option>
                                        {lots.map(lot => (
                                            <option key={lot.id} value={lot.id}>
                                                Lot #{lot.id} - {lot.produit_nom} [BL: {lot.num_BL}]
                                            </option>
                                        ))}
                                    </select>
                                    {selectedFarmId && lots.length === 0 && <p className="text-amber-600 text-[10px] italic">Aucun lot trouvé pour cette ferme.</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Poids Constaté */}
                                <div className="space-y-2 text-fresh-green">
                                    <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-emerald-600" /> Poids Réceptionné (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ex: 450.5"
                                        value={poids}
                                        onChange={(e) => setPoids(e.target.value)}
                                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* État Initial */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-emerald-600" /> État Initial Constaté
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['Frais', 'Légèrement flétri', 'Terreux', 'Dégâts transport'].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setEtat(option)}
                                            className={`p-3 rounded-xl text-xs font-bold transition-all border ${etat === option
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-emerald-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || isSuccess}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isSuccess
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-emerald-950 text-white hover:bg-emerald-900 shadow-emerald-950/20'
                                    }`}
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
                                ) : isSuccess ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Réception Enregistrée !</>
                                ) : (
                                    <>Confirmer la Réception</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Aide & Stats */}
                <div className="space-y-6">
                    <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-xl font-serif font-bold mb-4">Importance de la Réception</h3>
                        <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                            Cette étape valide le transfert de responsabilité entre la ferme et la station. Elle conditionne la précision du diagnostic IA ultérieur.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-fresh-green" /> Validation du poids BL
                            </div>
                            <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-fresh-green" /> Traçabilité de l'opérateur
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Derniers Lots Reçus</h4>
                            <History className="w-4 h-4 text-stone-400" />
                        </div>
                        <div className="space-y-4">
                            {lots.slice(0, 3).map(lot => (
                                <div key={lot.id} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer group">
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">Lot #{lot.id}</p>
                                        <p className="text-[10px] text-stone-500">{lot.num_BL}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
