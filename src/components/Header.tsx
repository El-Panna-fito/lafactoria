import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles, Instagram, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenQuote: () => void;
  currentView: 'home' | 'project' | 'admin';
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuote,
  currentView,
  onNavigateHome,
  onNavigateAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-slate-800/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onNavigateHome}
          className="focus:outline-none transition-transform active:scale-95 text-left"
          aria-label="Ir a inicio"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <button
            onClick={() => handleNavClick('inicio')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('nosotros')}
            className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-300 font-bold"
          >
            Nosotros
          </button>
          <button
            onClick={() => handleNavClick('proyectos')}
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            Proyectos
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </button>
          <button
            onClick={() => handleNavClick('soluciones')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Soluciones
          </button>
          <button
            onClick={() => handleNavClick('proceso')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Proceso
          </button>
          <button
            onClick={() => handleNavClick('clientes')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Clientes
          </button>
          <button
            onClick={() => handleNavClick('sinergias')}
            className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-300 hover:text-cyan-300"
          >
            Sinergias
          </button>
          <button
            onClick={() => handleNavClick('contacto')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Contacto
          </button>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Social Quick Links */}
          <a
            href="https://instagram.com/la.factor.ia"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 text-slate-400 hover:text-pink-300 transition-colors"
            title="Instagram: @la.factor.ia"
            aria-label="Instagram La factorIA"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
          </a>

          {/* Primary CTA */}
          <button
            onClick={onOpenQuote}
            className="group relative px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] flex items-center gap-1.5 active:scale-95"
          >
            <span>Cotizá tu proyecto</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenQuote}
            className="px-3 py-1.5 rounded-md bg-cyan-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider"
          >
            Cotizar
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#050b18]/95 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            <button
              onClick={() => handleNavClick('inicio')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('nosotros')}
              className="text-left py-2 border-b border-slate-800 text-cyan-300 flex items-center justify-between"
            >
              <span>Nosotros · Ecosistema IEC</span>
              <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 font-mono">IA Lab</span>
            </button>
            <button
              onClick={() => handleNavClick('proyectos')}
              className="text-left py-2 border-b border-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-between"
            >
              <span>Proyectos & Demos</span>
              <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 font-mono">Marketplace</span>
            </button>
            <button
              onClick={() => handleNavClick('soluciones')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Soluciones
            </button>
            <button
              onClick={() => handleNavClick('proceso')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Proceso de Trabajo
            </button>
            <button
              onClick={() => handleNavClick('clientes')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Clientes
            </button>
            <button
              onClick={() => handleNavClick('sinergias')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Sinergias Internacionales
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="text-left py-2 border-b border-slate-800 hover:text-cyan-400"
            >
              Contacto
            </button>
          </div>

          {/* Social and Institutional links in mobile */}
          <div className="pt-3 flex items-center gap-2 border-t border-slate-800">
            <a
              href="https://instagram.com/la.factor.ia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 hover:text-pink-300"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>@la.factor.ia</span>
            </a>
            <a
              href="https://iec-ia.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>iec-ia.com.ar</span>
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Cotizá tu proyecto
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
