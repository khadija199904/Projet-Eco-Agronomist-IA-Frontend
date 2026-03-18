import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, Smartphone, Factory, User, Download, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from 'src/lib/utils';

interface NavbarProps {
  onNavigate: (view: 'home' | 'scanner' | 'dashboard') => void;
  onAppEnter: () => void;
  currentView: string;
}

export default function Navbar({ onNavigate, onAppEnter, currentView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'features', label: 'Features' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'scanner', label: 'Diagnostic' },
    { id: 'dashboard', label: 'Usine' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
      isScrolled ? "bg-emerald-950/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-fresh-green p-1.5 rounded-lg">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Eco Agronomist <span className="text-fresh-green">IA</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-fresh-green flex items-center gap-2",
                currentView === item.id ? "text-fresh-green" : "text-white/80"
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onAppEnter}
            className="px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
          >
            Plateforme
            <LayoutDashboard className="w-4 h-4 opacity-70" />
          </button>
          <button className="bg-fresh-green hover:bg-emerald-400 text-emerald-950 px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-fresh-green/20 text-sm">
            <Download className="w-4 h-4" />
            PWA
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-emerald-950 border-t border-white/10 p-4 md:hidden flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as any);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  currentView === item.id ? "bg-fresh-green/20 text-fresh-green" : "text-white/70 hover:bg-white/5"
                )}
              >
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={onAppEnter}
              className="w-full bg-white/5 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5 opacity-70" />
              Accéder à la plateforme
            </button>
            <button className="w-full bg-fresh-green text-emerald-950 p-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Installer l'App PWA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
