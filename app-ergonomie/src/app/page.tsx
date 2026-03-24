"use client";

import React, { useState, useEffect } from 'react';
import Navbar from 'src/components/Navbar';
import HeroSimple from 'src/components/Hero';
import FeaturesGrid from 'src/components/Features';
import Solution from 'src/components/Solution';
import { motion } from 'motion/react';
import { Sprout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'solutions'];
      let currentSection = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            currentSection = section;
          }
        }
      }
      setCurrentView(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentView(id);
    }
  };

  const handleAppEnter = () => {
    if (isAuthenticated) {
      router.push('/dashboard'); // Or the actual platform route
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar avec scroll fluide vers les sections */}
      <Navbar
        onNavigate={scrollToSection}
        onAppEnter={handleAppEnter}
        currentView={currentView}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Le Hero avec les nouveaux boutons d'action */}
        <HeroSimple
          onNavigate={scrollToSection}
          onAppEnter={handleAppEnter}
        />

        {/* Vos fonctionnalités restent visibles en dessous */}
        <FeaturesGrid />

        {/* Decorative Divider */}
        <div className="relative py-12 bg-white">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-emerald-100/50" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce-slow">
                <Sprout className="text-emerald-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <Solution />

        {/* Footer */}
        <footer className="bg-stone-950 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Sprout size={18} />
                </div>
                <span className="text-xl font-bold">EcoAgronomistIA</span>
              </div>
              <p className="text-stone-400 max-w-sm mb-8">
                Accompagner la transition vers une agriculture intelligente et durable grâce à une intelligence artificielle avancée et des diagnostics en temps réel.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Plateforme</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Diagnostic</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Traçabilité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Système RAG</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarification</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Entreprise</h4>
              <ul className="space-y-4 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
            © 2026 EcoAgronomistIA. Tous droits réservés.
          </div>
        </footer>
      </motion.div>
    </main>
  );
}