"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Microscope, ShieldCheck, Zap } from 'lucide-react';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl border bg-white ${className}`}>
    {children}
  </div>
);

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Microscope />,
      title: "Diagnostic Phytosanitaire",
      desc: "Détection instantanée des maladies grâce à des modèles de vision par ordinateur de pointe."
    },
    {
      icon: <ShieldCheck />,
      title: "Traçabilité Totale",
      desc: "Suivez vos produits du champ à l'assiette avec une transparence garantie à chaque étape."
    },
    {
      icon: <Zap />,
      title: "Système de Traitement RAG",
      desc: "Recevez des protocoles de traitement précis et personnalisés selon votre culture et votre région."
    }
  ];

  return (
    <section id="features" className="py-32 bg-white px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-emerald-600" />
              <span className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-[10px]">Capacités Fondamentales</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] tracking-tighter text-emerald-950">
              Des outils de précision pour une <br />
              <span className="text-stone-300 italic font-display font-light">agriculture</span> résiliente.
            </h2>
          </div>
          <p className="text-stone-500 text-xl leading-relaxed max-w-sm font-light">
            Un écosystème unifié conçu pour sécuriser chaque récolte et optimiser la chaîne d'approvisionnement mondiale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Card className="group h-full p-10 border-stone-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-600/5 transition-all duration-500 bg-white/50 backdrop-blur-sm relative overflow-hidden cursor-default">
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm text-emerald-600">
                    {React.cloneElement(f.icon as React.ReactElement, { size: 28, className: "transition-colors duration-500" })}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-emerald-900">{f.title}</h3>
                  <p className="text-stone-500 leading-relaxed font-light mb-8 text-lg">{f.desc}</p>

                  {/* Removed En savoir plus link */}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}