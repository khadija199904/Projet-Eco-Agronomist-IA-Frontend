"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Camera, Upload, AlertCircle, Loader2, CheckCircle2, ChevronRight, Package, BarChart3, Target, Truck, Scale } from 'lucide-react';
import { diagnosticAPI, productionAPI, valorisationAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import MobileScanner from '@/components/MobileScanner';

export default function ValorisationPage() {
  const { user } = useAuth();
  const [lots, setLots] = useState<any[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [receptionInfo, setReceptionInfo] = useState<any | null>(null);
  const [receptionLoading, setReceptionLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProcessed, setShowProcessed] = useState(false);
  const [processedLotIds, setProcessedLotIds] = useState<Set<number>>(new Set());
  // IDs des lots réceptionnés à la station (null = pas encore chargé ou erreur API)
  const [receivedLotIds, setReceivedLotIds] = useState<Set<number> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les lots, réceptions et l'historique
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myLots, historyRes] = await Promise.all([
          productionAPI.getMyLots(),
          diagnosticAPI.getHistory('produit')
        ]);

        setLots(myLots);

        // Identifier les lots déjà diagnostiqués
        const processed = new Set<number>(
          historyRes.diagnostics
            .filter((d: any) => d.lot_recolte_id)
            .map((d: any) => d.lot_recolte_id)
        );
        setProcessedLotIds(processed);

        // Charger les réceptions séparément — si ça échoue, on ne bloque pas l'affichage
        let received: Set<number> | null = null;
        try {
          const receptions = await valorisationAPI.getAllReceptions();
          received = new Set<number>(
            receptions
              .filter((r: any) => r.lot_recolte_id)
              .map((r: any) => r.lot_recolte_id)
          );
          setReceivedLotIds(received);
        } catch {
          console.warn("[Valorisation] Endpoint /receptions indisponible — affichage de tous les lots.");
          // received reste null → pas de filtrage par réception
        }

        // Sélectionner par défaut le premier lot non encore diagnostiqué
        // (parmi les réceptionnés si dispo, sinon tous)
        const lotsBase = received !== null
          ? myLots.filter((l: any) => received!.has(l.id))
          : myLots;
        const firstPending = lotsBase.find((l: any) => !processed.has(l.id));
        if (firstPending) {
          setSelectedLotId(firstPending.id.toString());
        } else if (lotsBase.length > 0) {
          setSelectedLotId(lotsBase[0].id.toString());
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
      }
    };
    fetchData();
  }, []);

  // Charger les infos de réception quand le lot change
  useEffect(() => {
    if (!selectedLotId) {
      setReceptionInfo(null);
      return;
    }
    const fetchReception = async () => {
      setReceptionLoading(true);
      try {
        const data = await valorisationAPI.getReception(parseInt(selectedLotId));
        setReceptionInfo(data);
      } catch {
        setReceptionInfo(null);
      } finally {
        setReceptionLoading(false);
      }
    };
    fetchReception();
  }, [selectedLotId]);

  // Afficher UNIQUEMENT les lots réceptionnés (si données dispo), sinon tous les lots
  const filteredLots = lots
    .filter(lot => {
      // Filtre réception : seulement si les données ont bien été chargées
      if (receivedLotIds !== null && !receivedLotIds.has(lot.id)) return false;

      // Filtre recherche textuelle
      const matchesSearch =
        lot.produit_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.num_BL?.toLowerCase().includes(searchTerm.toLowerCase());

      // Masquer les lots déjà diagnostiqués (sauf toggle activé)
      const isProcessed = processedLotIds.has(lot.id);
      if (!showProcessed && isProcessed) return false;

      return matchesSearch;
    })
    .sort((a, b) => new Date(b.date_recolte).getTime() - new Date(a.date_recolte).getTime());

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
    if (!file || !user || !selectedLotId) {
      setError("Veuillez sélectionner un lot et une image.");
      return;
    }

    if (!receptionInfo) {
      setError("Ce lot n'a pas encore été réceptionné à la station. Enregistrez d'abord sa réception.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lot_recolte_id', selectedLotId);

    if (user.organization_id) {
      formData.append('organization_id', user.organization_id.toString());
    }

    try {
      const data = await diagnosticAPI.uploadProduct(formData);
      setResult(data);
    } catch (err: any) {
      console.error("Valorisation error:", err);
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
        <h1 className="text-3xl font-serif font-bold text-emerald-950">Valorisation & Qualité</h1>
        <p className="text-stone-500 mt-1">Contrôlez la conformité des produits et optimisez les flux de sortie.</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* 1. Sélection du Lot */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-emerald-900 font-bold uppercase text-xs tracking-widest">
                  <Package className="w-4 h-4" /> Sélection du Lot de Récolte
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-stone-500 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProcessed}
                      onChange={(e) => setShowProcessed(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Voir lots déjà traités
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <input
                    type="text"
                    placeholder="Chercher par BL ou produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <select
                    value={selectedLotId}
                    onChange={(e) => setSelectedLotId(e.target.value)}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-fresh-green outline-none transition-all"
                  >
                    <option value="" disabled>Choisir un lot...</option>
                    {filteredLots.map(lot => (
                      <option key={lot.id} value={lot.id}>
                        {processedLotIds.has(lot.id) ? "✅ " : "⏳ "}
                        Lot #{lot.id} - {lot.produit_nom} [BL: {lot.num_BL}] - {new Date(lot.date_recolte).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredLots.length === 0 && (
                <p className="text-amber-600 text-xs italic bg-amber-50 p-3 rounded-lg border border-amber-100">
                  {receivedLotIds !== null && receivedLotIds.size === 0
                    ? "Aucun lot n'a encore été réceptionné à la station."
                    : showProcessed
                      ? "Aucun lot trouvé."
                      : "Aucun lot en attente de valorisation. Cochez 'Voir lots déjà traités'."}
                </p>
              )}

              {/* Informations de Réception du lot sélectionné */}
              {selectedLotId && (
                <div className="mt-4">
                  {receptionLoading ? (
                    <div className="flex items-center gap-2 text-stone-400 text-xs"><Loader2 className="w-4 h-4 animate-spin" /> Vérification réception...</div>
                  ) : receptionInfo ? (
                    <div className="flex flex-wrap items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <Truck className="w-4 h-4" /> Lot réceptionné
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-stone-100">
                        <Scale className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{receptionInfo.poids_reception} kg</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-stone-100">
                        État : <span className="font-medium ml-1">{receptionInfo.etat_initial}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-100 text-xs">
                        {new Date(receptionInfo.date_reception).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Ce lot n'a pas encore été réceptionné. Allez sur la page <strong className="mx-1">Réception</strong> pour l'enregistrer avant d'analyser.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Upload ou Scan */}
            <div className="grid md:grid-cols-2 gap-8">
              <div
                onClick={() => setIsScannerOpen(true)}
                className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-all group cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-950">Scanner le produit</p>
                  <p className="text-sm text-stone-500">Utilisez la caméra pour un contrôle rapide</p>
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
                  <p className="text-lg font-bold text-emerald-950">Charger une photo</p>
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Image prête pour analyse
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={isLoading || !selectedLotId || !receptionInfo}
                    className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${!receptionInfo
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50 shadow-emerald-950/20'
                      }`}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Contrôle qualité en cours...</>
                    ) : (
                      <><Target className="w-5 h-5" /> Lancer l'analyse IA</>
                    )}
                  </button>
                  <button onClick={reset} disabled={isLoading} className="w-full text-stone-500 text-sm hover:underline">Modifier</button>
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
              <div className={`p-8 text-white relative overflow-hidden ${result.decision_flux === 'DIRECT_EMBALLAGE' ? 'bg-emerald-900' : 'bg-amber-900'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest mb-4">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Rapport de Qualité IA
                </div>
                <h2 className="text-4xl font-serif font-bold">
                  {result.decision_flux === 'DIRECT_EMBALLAGE' ? "Conforme (Emballage)" : "Traitement Spécial (Tri)"}
                </h2>
                <div className="flex items-center gap-4 mt-6">
                  <div className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                    Score Santé : {(result.healthy_score * 100).toFixed(1)}%
                  </div>
                  <div className="px-4 py-1.5 bg-white/10 rounded-full text-sm border border-white/10">
                    Taux Défauts : {(result.taux_defauts_visuels * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2 uppercase text-xs tracking-wider">
                      <BarChart3 className="w-4 h-4 text-emerald-500" /> Analyse des Défauts
                    </h4>

                    <div className="space-y-4">
                      {result.visual_defects && Object.keys(result.visual_defects).length > 0 ? (
                        Object.entries(result.visual_defects).map(([label, count]: [string, any]) => (
                          <div key={label} className="flex justify-between items-center p-3 bg-white rounded-lg border border-stone-100">
                            <span className="text-sm font-medium text-stone-700 capitalize">{label}</span>
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">x{count}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Aucun défaut visuel majeur détecté
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 text-sm italic">
                      <Share2 className="w-4 h-4 text-emerald-500" /> Flux de Sortie Recommandé
                    </h4>
                    <p className="text-emerald-900 text-sm leading-relaxed">
                      {result.decision_flux === 'DIRECT_EMBALLAGE'
                        ? "Le lot présente une qualité supérieure. Il peut être dirigé vers l'emballage direct."
                        : "Le taux de défauts est trop important (>20%). Un passage par le tri mécanique est nécessaire."}
                    </p>
                  </div>

                  <button onClick={reset} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline group">
                    Analyser un autre produit <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="relative">
                  <img
                    src={result.image_url ? `http://localhost:8000/${result.image_url}` : preview!}
                    alt="Analysed product"
                    className="w-full aspect-square object-cover rounded-2xl shadow-inner border border-stone-100"
                  />
                  {result.image_url && (
                    <div className="absolute top-4 right-4 bg-emerald-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">
                      Annotation IA (Visual Quality)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScannerOpen && (
          <MobileScanner
            type="produit"
            onClose={() => setIsScannerOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900">Norme de Qualité (Station)</p>
          <p className="text-xs text-emerald-800 mt-1">
            Le système de valorisation analyse les défauts visuels externes (taches, pourriture, déformations) pour valider la catégorie du lot avant expédition.
          </p>
        </div>
      </div>
    </div>
  );
}
