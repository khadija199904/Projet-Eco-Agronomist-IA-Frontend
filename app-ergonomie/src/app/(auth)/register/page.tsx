"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authAPI, organizationAPI, Organization } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Sprout, Mail, Lock, User, Building, ArrowRight, Loader2, PlusCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function RegisterPage() {
    // User Form
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("agriculteur");

    // Organization Logic
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<number | "new">("new");

    // New Organization Form
    const [orgName, setOrgName] = useState("");
    const [orgType, setOrgType] = useState("ferme");

    // States
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { loginState } = useAuth();

    useEffect(() => {
        // Fetch organizations on mount
        organizationAPI.getOrganizations().then((res) => {
            const orgs = Array.isArray(res) ? res : res.organizations || [];
            setOrganizations(orgs);
            if (orgs.length > 0) {
                setSelectedOrgId(orgs[0].id);
            } else {
                setSelectedOrgId("new");
            }
        }).catch(err => {
            console.error("Failed to fetch organizations:", err);
            setSelectedOrgId("new");
        });
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            console.log("Starting registration process...");
            let finalOrgId = selectedOrgId;

            // 1. Create Organization if needed
            if (selectedOrgId === "new") {
                console.log("Creating new organization:", orgName);
                if (!orgName.trim()) throw new Error("Le nom de l'organisation est requis.");
                const newOrg = await organizationAPI.createOrganization({
                    name: orgName,
                    type: orgType,
                    is_certified: false
                });
                console.log("Organization created successfully, ID:", newOrg.id);
                finalOrgId = newOrg.id;
            }

            // 2. Register User
            console.log("Registering user:", username);
            const newUser = await authAPI.register({
                email,
                username,
                password,
                role,
                full_name: fullName,
                organization_id: finalOrgId
            });
            console.log("User registered successfully:", newUser);

            // 3. Success -> Redirect to Login
            console.log("Registration successful, redirecting to login page...");
            router.push("/login?registered=true");
        } catch (err: any) {
            console.error("Registration error details:", err);
            let errorMessage = "Une erreur est survenue lors de l'inscription.";
            if (err.message) {
                try {
                    const parsedError = JSON.parse(err.message);
                    errorMessage = parsedError.detail || errorMessage;
                    if (Array.isArray(errorMessage)) {
                        errorMessage = errorMessage.map(e => e.msg).join(", ");
                    }
                } catch (e) {
                    errorMessage = err.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative py-12">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-fresh-green/5 -skew-x-12 -translate-x-1/4" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-emerald-900/10 p-8 md:p-12 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
                        <Sprout className="text-white w-8 h-8" />
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-emerald-950 text-center">
                        Rejoignez l'Écosystème
                    </h1>
                    <p className="text-stone-500 text-center mt-2 max-w-sm">
                        Créez votre compte et connectez votre exploitation à l’IA d’Eco Agronomist.
                    </p>
                </div>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">

                    {/* Section 1: Informations Personnelles */}
                    <div className="space-y-5">
                        <h3 className="text-emerald-900 font-bold uppercase tracking-wider text-sm mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                            <User className="w-4 h-4" /> Informations Personnelles
                        </h3>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-2">Nom Complet</label>
                                <div className="relative">
                                    <input
                                        type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="El Amrani..." required
                                    />
                                    <User className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-2">Identifiant (Username)</label>
                                <div className="relative">
                                    <input
                                        type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="elamrani.agri" required
                                    />
                                    <User className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-emerald-900 mb-2">Email</label>
                                <div className="relative">
                                    <input
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="votre@email.com" required
                                    />
                                    <Mail className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-2">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••" required minLength={6}
                                    />
                                    <Lock className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-2">Votre Rôle</label>
                                <select
                                    value={role} onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                >
                                    <option value="agriculteur">Agriculteur / Fermier</option>
                                    <option value="responsable_qualite">Responsable Qualité</option>
                                    <option value="admin">Administrateur</option>
                                    <option value="consommateur">Consommateur</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Organisation */}
                    <div className="space-y-5">
                        <h3 className="text-emerald-900 font-bold uppercase tracking-wider text-sm mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                            <Building className="w-4 h-4" /> Organisation Associée
                        </h3>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedOrgId !== "new" ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium" : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"}`}
                                onClick={() => {
                                    if (organizations.length > 0) {
                                        setSelectedOrgId(organizations[0].id);
                                    }
                                }}
                                disabled={organizations.length === 0}
                            >
                                <CheckCircle className="w-4 h-4" /> Rejoindre existante
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedOrgId === "new" ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium" : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"}`}
                                onClick={() => setSelectedOrgId("new")}
                            >
                                <PlusCircle className="w-4 h-4" /> Créer nouvelle
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedOrgId === "new" ? (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid md:grid-cols-2 gap-5 pt-2">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-emerald-900 mb-2">Nom de l'Organisation</label>
                                        <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Domaines Agricoles SA" required={selectedOrgId === "new"} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-emerald-900 mb-2">Type d'Organisation</label>
                                        <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                                            <option value="ferme">Ferme / Exploitation</option>
                                            <option value="station">Station de Conditionnement</option>
                                            <option value="cooperative">Coopérative</option>
                                        </select>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                                    <label className="block text-sm font-medium text-emerald-900 mb-2">Sélectionnez votre organisation</label>
                                    <select
                                        value={selectedOrgId as number}
                                        onChange={(e) => setSelectedOrgId(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                    >
                                        {organizations.map(org => (
                                            <option key={org.id} value={org.id}>{org.name} - ({org.type})</option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit" disabled={isLoading}
                        className="w-full py-4 px-6 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-6"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Créer mon compte
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-stone-500 mt-8">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-emerald-600 font-bold hover:underline">
                        Se connecter
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
