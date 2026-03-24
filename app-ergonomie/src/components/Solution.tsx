import React from 'react';
import { Smartphone, Factory, Eye, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from 'src/lib/utils';

const features = [
  {
    title: "Production",
    subtitle: "Mobile-first",
    description: "Diagnostic instantané des maladies et stress hydrique directement au champ.",
    icon: Smartphone,
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Valorisation",
    subtitle: "Dashboard-style",
    description: "Scoring fournisseurs et optimisation du taux de déchet en station de conditionnement.",
    icon: Factory,
    color: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Consommation",
    subtitle: "Transparence",
    description: "Traçabilité complète du champ à l'assiette pour rassurer le consommateur final.",
    icon: Eye,
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Solution() {
  return (
    <section id="solutions" className="py-32 bg-stone-50 relative overflow-hidden">
      {/* Subtle Leaf Pattern Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02] pointer-events-none">
        <Sprout size={400} className="rotate-12 translate-x-1/2" />
      </div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-[0.02] pointer-events-none">
        <Sprout size={400} className="-rotate-12 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] tracking-tighter text-emerald-950">
            L’Écosystème Digital de la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-fresh-green italic font-display font-light">
              Résilience Agricole
            </span>
          </h2>
          <p className="text-stone-500 text-xl leading-relaxed font-light mx-auto max-w-2xl">
            Eco Agronomist IA unifie chaque étape de la filière marocaine pour transformer
            le potentiel de nos terres en une sécurité durable.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn(
                "flex flex-col lg:items-center gap-12 lg:gap-24",
                idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              {/* Image Column */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-100/50 rounded-[40px] blur-2xl group-hover:bg-emerald-200/50 transition-colors duration-700" />
                  <div className="relative overflow-hidden rounded-[32px] aspect-[4/3] shadow-2xl shadow-emerald-950/10">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-emerald-900/10" />
                    <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-widest backdrop-blur-md">
                      {feature.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="flex-1 max-w-xl">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20`}>
                  <feature.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="text-4xl font-serif font-bold text-emerald-950 mb-6 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-xl leading-relaxed font-light mb-8">
                  {feature.description}
                </p>
                <ul className="space-y-4">
                  {["Performance optimisée", "Conformité garantie", "Analyse en temps réel"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-emerald-800 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-fresh-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
