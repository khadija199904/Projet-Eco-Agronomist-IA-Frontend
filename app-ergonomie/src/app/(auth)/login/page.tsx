"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { loginState } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "true";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const data = await authAPI.login(params);
            loginState(data.access_token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Identifiants incorrects");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-950/5 skew-x-12 translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-900/10 p-8 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
                        <Sprout className="text-white w-8 h-8" />
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950 text-center">
                        Bon retour
                    </h1>
                    <p className="text-stone-500 text-center mt-2">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {isRegistered && !error && (
                        <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Compte créé avec succès ! Connectez-vous.
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-emerald-900 mb-2">Email ou Identifiant</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Votre email"
                                required
                            />
                            <Mail className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-emerald-900">Mot de passe</label>
                            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Oublié ?</a>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-fresh-green text-emerald-950 font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Se connecter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-stone-500 mt-8">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="text-emerald-600 font-bold hover:underline">
                        Créer un compte
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
