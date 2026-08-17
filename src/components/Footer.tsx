import React from 'react';
import { Logo } from './Logo';
import { Mail, MapPin, MessageSquare, ShieldCheck, ArrowUpRight, Globe, Instagram, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAdmin,
  onOpenQuote,
}) => {
  const handleScroll = (id: string) => {
    onNavigateHome();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <button onClick={onNavigateHome} className="text-left focus:outline-none">
            <Logo size="lg" />
          </button>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
            Fábrica de soluciones digitales, e-commerce y plataformas web de alto impacto. Brazo de innovación y desarrollo del <a href="https://iec-ia.com.ar" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Ecosistema IEC</a>.
          </p>

          <div className="pt-2 flex flex-col space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Gualeguaychú 449, Paraná, Entre Ríos, Argentina</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <a href="mailto:contacto@factor.ia.com.ar" className="hover:text-cyan-300 transition-colors">
                contacto@factor.ia.com.ar
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <a
                href="https://wa.me/543434664964"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition-colors"
              >
                +54 343 466-4964 (WhatsApp)
              </a>
            </div>
          </div>

          {/* Social & Ecosistema Links */}
          <div className="pt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
            <a
              href="https://instagram.com/la.factor.ia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050b18] border border-slate-800 hover:border-pink-500/50 text-slate-300 hover:text-pink-300 transition-colors"
            >
              <Instagram className="w-3 h-3 text-pink-400" />
              <span>@la.factor.ia</span>
            </a>

            <a
              href="https://iec-ia.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 transition-colors"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>iec-ia.com.ar</span>
            </a>

            <a
              href="https://instagram.com/iecparana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#050b18] border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              <Instagram className="w-3 h-3 text-cyan-400" />
              <span>@iecparana</span>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Navegación
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleScroll('inicio')} className="hover:text-cyan-300 transition-colors">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('nosotros')} className="hover:text-cyan-300 transition-colors text-cyan-400 font-semibold">
                Sobre Nosotros · Ecosistema IEC
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('proyectos')} className="hover:text-cyan-300 transition-colors">
                Catálogo de Proyectos
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('soluciones')} className="hover:text-cyan-300 transition-colors">
                Soluciones & Servicios
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('proceso')} className="hover:text-cyan-300 transition-colors">
                Proceso de Trabajo
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('clientes')} className="hover:text-cyan-300 transition-colors">
                Clientes & Testimonios
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll('sinergias')} className="hover:text-cyan-300 transition-colors">
                Sinergias Internacionales
              </button>
            </li>
          </ul>
        </div>

        {/* Soluciones */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Servicios
          </h4>
          <ul className="space-y-2 text-xs">
            <li>Sitios Institucionales</li>
            <li>E-commerce & Tiendas Online</li>
            <li>Landing Pages de Alta Conversión</li>
            <li>Portales Educativos & Escolares</li>
            <li>Plataformas SaaS & Dashboards</li>
            <li>Automatizaciones & WhatsApp API</li>
          </ul>
        </div>

        {/* Direct Access */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Empezar
          </h4>
          <div className="space-y-2.5">
            <button
              onClick={onOpenQuote}
              className="w-full py-2.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
            >
              <span>Cotizar Proyecto</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Respuesta en menos de 24 hs hábiles con estimación y propuesta.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar with mandatory phrase */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="font-display font-semibold text-slate-300">
          Diseñado y desarrollado por <span className="text-cyan-400 font-bold">La factorIA</span>.
        </div>

        <div className="font-mono text-slate-400 text-[11px]">
          © {new Date().getFullYear()} La factorIA — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
