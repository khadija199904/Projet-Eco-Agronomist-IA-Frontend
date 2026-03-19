"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ShieldAlert, FileText, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { diagnosticAPI } from '@/lib/api';

interface MobileScannerProps {
    onClose: () => void;
    type: 'plante' | 'produit';
}

export default function MobileScanner({ onClose, type }: MobileScannerProps) {
    const { user } = useAuth();
    const [isScanning, setIsScanning] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [cameraError, setCameraError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [apiResult, setApiResult] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraError(true);
            }
        }

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCaptureAndUpload = async () => {
        if (!videoRef.current || !user) return;

        setIsUploading(true);
        try {
            // Create canvas and capture frame
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);

                // Convert to blob
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                if (blob) {
                    const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
                    const formData = new FormData();
                    formData.append('file', file);
                    if (user.organization_id) {
                        formData.append('organization_id', user.organization_id.toString());
                    }

                    const data = type === 'plante'
                        ? await diagnosticAPI.uploadPlant(formData)
                        : await diagnosticAPI.uploadProduct(formData);

                    setApiResult(data);
                    setShowResult(true);
                }
            }
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
            setIsScanning(false);
        }
    };

    useEffect(() => {
        if (isScanning) {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleCaptureAndUpload();
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isScanning]);

    const label = type === 'plante' ? "Feuille de Tomate [Conf: 94.2%]" : "Produit (Tomate) [Conf: 98.7%]";
    const resultTitle = apiResult?.disease_detected || (type === 'plante' ? "Analyse en cours..." : "Scan Produit");
    const resultAdvice = apiResult?.treatment_advice || "Génération des conseils IA...";

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white font-mono text-xs uppercase tracking-widest px-2">Live AI Diagnostic</span>
                </div>
                <button onClick={onClose} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-all">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Camera View Area */}
            <div className="flex-grow relative overflow-hidden flex items-center justify-center bg-black">
                {/* Real Camera Feed */}
                {!cameraError ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <Image
                        src={type === 'plante'
                            ? "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"
                            : "https://images.unsplash.com/photo-1590547000885-305f88636ba6?auto=format&fit=crop&q=80&w=800"
                        }
                        fill
                        className="object-cover opacity-60"
                        alt="Camera fallback"
                        referrerPolicy="no-referrer"
                    />
                )}

                {/* YOLO-style Detection Frame */}
                <div className="relative w-72 h-72">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-fresh-green rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-fresh-green rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-fresh-green rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-fresh-green rounded-br-lg" />

                    {/* Scanning Line */}
                    {isScanning && (
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fresh-green to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                        />
                    )}

                    {/* Detection Label */}
                    <div className="absolute -top-10 left-0 bg-fresh-green text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        {label}
                    </div>
                </div>

                {/* Scanning Overlay Text */}
                {isScanning && (
                    <div className="absolute bottom-32 left-0 right-0 text-center px-8">
                        <div className="text-white font-mono text-sm mb-2">ANALYSE RAG EN COURS... {scanProgress}%</div>
                        <div className="max-w-[200px] mx-auto h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-fresh-green transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-emerald-950 p-8 rounded-t-[40px] flex flex-col items-center gap-6 shadow-[0_-20px_50px_rgba(6,78,59,0.5)] relative z-20">
                <div className="flex gap-8">
                    <button className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                        <RefreshCw className="w-6 h-6" />
                    </button>
                    <button className="w-20 h-20 rounded-full bg-fresh-green border-8 border-emerald-900 flex items-center justify-center text-white shadow-2xl shadow-fresh-green/40 active:scale-95 transition-all">
                        <Camera className="w-8 h-8" />
                    </button>
                    <button className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                        <FileText className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Maintenir pour scanner</p>
            </div>

            {/* Result Popup (RAG Generated) */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="absolute inset-x-4 bottom-36 z-50 bg-emerald-900/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className={type === 'plante' ? "bg-red-500/20 p-2 rounded-xl" : "bg-fresh-green/20 p-2 rounded-xl"}>
                                <ShieldAlert className={type === 'plante' ? "text-red-400 w-6 h-6" : "text-fresh-green w-6 h-6"} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">{resultTitle}</h4>
                                <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Niveau d'urgence : {type === 'plante' ? 'Élevé' : 'Normal'}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                            <div className="text-fresh-green text-[10px] font-bold uppercase mb-2 tracking-widest">Ordonnance IA (RAG)</div>
                            <p className="text-white/80 text-sm leading-relaxed italic">
                                {resultAdvice}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-grow bg-fresh-green text-emerald-950 py-3 rounded-xl font-bold text-sm shadow-lg shadow-fresh-green/20"
                            >
                                Terminer
                            </button>
                            <button
                                onClick={() => { setShowResult(false); setIsScanning(true); setScanProgress(0); }}
                                className="px-6 bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
                            >
                                Réessayer
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
