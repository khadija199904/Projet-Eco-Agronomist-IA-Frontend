"use client";

import React, { useState, useEffect } from 'react';
import { Package, Plus, ClipboardList, X, Check, Loader2, AlertCircle, Trash2, QrCode, Download, Printer } from 'lucide-react';
import { productionAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

export default function LotsPage() {
    const { user } = useAuth();
    const [lots, setLots] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        num_BL: '',
        produit_nom: 'Tomate',
        poids_brut: 0,
        poids_net: 0,
        nombre_unit_transport: 0,
        ferme_id: user?.organization_id || 0
    });

    useEffect(() => {
        if (user?.organization_id) {
            fetchLots();
            setFormData(prev => ({ ...prev, ferme_id: user.organization_id! }));
        }
    }, [user]);

    const fetchLots = async () => {
        try {
            const data = await productionAPI.getMyLots();
            setLots(data);
        } catch (err) {
            console.error("Error fetching lots:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleCreateLot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await productionAPI.createLotRecolte(formData);
            setIsModalOpen(false);
            fetchLots(); // Refresh list
            // Reset form
            setFormData({
                num_BL: '',
                produit_nom: 'Tomate',
                poids_brut: 0,
                poids_net: 0,
                nombre_unit_transport: 0,
                ferme_id: user?.organization_id || 0
            });
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du lot");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950">Gestion des Lots</h1>
                    <p className="text-stone-500 mt-1">Gérez vos récoltes et préparez les envois en station.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-950/20"
                >
                    <Plus className="w-5 h-5" />
                    Créer un Lot
                </button>
            </div>

            {isFetching ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
            ) : lots.length > 0 ? (
                <div className="grid gap-4">
                    {lots.map((lot) => (
                        <div key={lot.id} className="bg-white p-6 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-950">Lot #{lot.num_BL}</p>
                                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                                        <span>{lot.produit_nom}</span>
                                        <span className="w-1 h-1 bg-stone-300 rounded-full" />
                                        <span>{lot.poids_net} kg</span>
                                        <span className="w-1 h-1 bg-stone-300 rounded-full" />
                                        <span>{new Date(lot.date_recolte).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => setSelectedQR(lot.code_qr_initial)}
                                    className="cursor-pointer group relative bg-emerald-50 p-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all"
                                >
                                    <QRCodeSVG value={lot.code_qr_initial} size={40} />
                                    <div className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] text-white px-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">Zoom</div>
                                </div>
                                <div className="flex flex-col items-end mr-4">
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">QR INITIAL</span>
                                    <span className="text-xs font-mono font-bold text-emerald-800">{lot.code_qr_initial}</span>
                                </div>
                                <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-emerald-100/50 p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto">
                        <ClipboardList className="w-8 h-8 text-stone-300" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-emerald-950">Aucun lot actif</p>
                        <p className="text-sm text-stone-500">Commencez par créer votre premier lot de récolte.</p>
                    </div>
                </div>
            )}

            {/* Modal de Création */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-serif font-bold text-emerald-950 text-center">Nouveau Lot de Récolte</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-stone-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateLot} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Numéro BL</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.num_BL}
                                                onChange={(e) => setFormData({ ...formData, num_BL: e.target.value })}
                                                placeholder="Ex: BL-2024-001"
                                                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Produit</label>
                                            <select
                                                value={formData.produit_nom}
                                                onChange={(e) => setFormData({ ...formData, produit_nom: e.target.value })}
                                                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                                            >
                                                <option value="Tomate">Tomate</option>
                                                <option value="Poivron">Poivron</option>
                                                <option value="Concombre">Concombre</option>
                                                <option value="Fraise">Fraise</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Poids Brut (kg)</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.poids_brut}
                                                onChange={(e) => setFormData({ ...formData, poids_brut: parseFloat(e.target.value) })}
                                                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Poids Net (kg)</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.poids_net}
                                                onChange={(e) => setFormData({ ...formData, poids_net: parseFloat(e.target.value) })}
                                                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Nombre Unités</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.nombre_unit_transport}
                                                onChange={(e) => setFormData({ ...formData, nombre_unit_transport: parseInt(e.target.value) })}
                                                className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" /> {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-emerald-950 text-fresh-green font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-50 transition-all shadow-xl shadow-emerald-950/20 mt-4"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Création...</>
                                        ) : (
                                            <><Check className="w-5 h-5" /> Confirmer la Création</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Zoom QR */}
            <AnimatePresence>
                {selectedQR && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedQR(null)}
                            className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-6"
                        >
                            <h3 className="text-xl font-bold text-emerald-950">Identification du Lot</h3>
                            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-inner">
                                <QRCodeSVG value={selectedQR} size={200} />
                            </div>
                            <p className="font-mono text-emerald-800 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{selectedQR}</p>
                            <div className="flex gap-4 w-full">
                                <button className="flex-1 py-3 bg-stone-100 text-stone-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-200 transition-all">
                                    <Download className="w-5 h-5" /> Télécharger
                                </button>
                                <button className="flex-1 py-3 bg-emerald-950 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all">
                                    <Printer className="w-5 h-5" /> Imprimer
                                </button>
                            </div>
                            <button onClick={() => setSelectedQR(null)} className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg border border-stone-100">
                                <X className="w-5 h-5 text-stone-400" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
