import React from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Terminal, Code2, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
  onExploreProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenQuote,
  onExploreProjects,
}) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Graphic: Factory + Circuit Traces + Neon Glow Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-b from-cyan-600/15 via-blue-700/10 to-transparent blur-[120px] rounded-full" />
        
        {/* Circuit grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        {/* Dynamic technological circuit vector behind the hero */}
        <svg
          className="absolute w-full h-full inset-0 opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Circuit Lines */}
          <path
            d="M-100 250 L350 250 L480 380 L960 380 L1100 240 L1600 240"
            stroke="#06b6d4"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          <path
            d="M-50 650 L280 650 L420 510 L880 510 L1020 650 L1550 650"
            stroke="#0284c7"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M720 100 L720 380 M720 510 L720 800"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Circuit Nodes with Pulsing Glow */}
          <circle cx="350" cy="250" r="4" fill="#06b6d4" />
          <circle cx="480" cy="380" r="5" fill="#38bdf8" />
          <circle cx="960" cy="380" r="5" fill="#06b6d4" />
          <circle cx="1100" cy="240" r="4" fill="#22d3ee" />
          <circle cx="420" cy="510" r="4" fill="#0284c7" />
          <circle cx="880" cy="510" r="5" fill="#06b6d4" />
        </svg>

        {/* Top & Bottom fade gradient masks */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#030712] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Eyebrow / Agency Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081226] border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)] animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Fábrica Digital & Soluciones Web de Alto Impacto</span>
        </div>

        {/* Main Headline with Bold Typography Theme */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter text-white leading-[0.95] mb-6 uppercase">
          TRANSFORMAMOS IDEAS EN{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            EXPERIENCIAS
          </span>{' '}
          QUE FUNCIONAN.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-10 text-balance">
          Diseñamos sitios web, e-commerce y plataformas digitales pensadas para{' '}
          <strong className="text-white font-semibold">convertir, crecer y escalar</strong>. 
          Desarrollo a medida con tecnología moderna y criterio editorial real.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onExploreProjects}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.55)] active:scale-95"
          >
            <span>Explorar proyectos</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={onOpenQuote}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#081226]/80 hover:bg-[#0c1a36] border border-cyan-500/40 hover:border-cyan-400 text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
          >
            <span>Solicitar cotización</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Value Props & Technological Specs Pill Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-[#050b18]/60 border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Ultra Rápido</div>
              <div className="text-[11px] text-slate-400 font-mono">0.5s Carga Core Vitals</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050b18]/60 border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Código a Medida</div>
              <div className="text-[11px] text-slate-400 font-mono">Sin plantillas genéricas</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050b18]/60 border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Administrable</div>
              <div className="text-[11px] text-slate-400 font-mono">Conectado a Supabase</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050b18]/60 border border-slate-800/80 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">Conversión Real</div>
              <div className="text-[11px] text-slate-400 font-mono">WhatsApp & Checkout</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
