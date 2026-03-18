import { ShieldCheck, Zap, CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onNavigate: (id: string) => void;
  onAppEnter: () => void;
}

export default function HeroSimple({ onNavigate, onAppEnter }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000"
          alt="Agriculture marocaine"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/60 to-slate-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-fresh-green/20 text-fresh-green px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-fresh-green/30">
              Agriculture 4.0 Maroc
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              De la Ferme à la Fourchette :<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-green to-emerald-400">
                L'IA au service de l'agriculture
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              Optimisez chaque récolte, garantissez la qualité ONSSA et réduisez vos pertes en station, tout en offrant une transparence totale au consommateur, de l'origine à l'assiette.            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {/* BOUTON : GET STARTED */}
              <button
                onClick={() => onNavigate('scanner')}
                className="px-8 py-4 bg-fresh-green text-emerald-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
              >
                Démarrer l'expérience
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* BOUTON : ENTER PLATFORM */}
              <button
                onClick={onAppEnter}
                className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Accéder à la plateforme
                <LayoutDashboard className="w-5 h-5 opacity-70" />
              </button>
            </div>
          </motion.div>

          {/* Stats Banner */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Seuil de confiance IA", value: "> 80%", icon: ShieldCheck },
              { label: "Diagnostic", value: "< 2s", icon: Zap },
              { label: "Conformité ONSSA", value: "100%", icon: CheckCircle },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 border border-white/10">
                <div className="bg-fresh-green/20 p-3 rounded-xl">
                  <stat.icon className="text-fresh-green w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}