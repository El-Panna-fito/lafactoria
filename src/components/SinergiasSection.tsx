import React from 'react';
import { Partnership } from '../types';
import { Globe2, Sparkles, ExternalLink, Network, MapPin, Handshake } from 'lucide-react';

interface SinergiasSectionProps {
  partnerships: Partnership[];
}

export const SinergiasSection: React.FC<SinergiasSectionProps> = ({ partnerships }) => {
  const activePartnerships = partnerships.filter((p) => p.active);

  return (
    <section id="sinergias" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Alianzas Estratégicas & Expansión</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
            SINERGIAS QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">TRANSFORMAN</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Colaboramos con empresas, organizaciones y hubs tecnológicos internacionales para potenciar proyectos de software y desarrollo conjunto.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#050b18] border border-cyan-500/30 px-4 py-2.5 rounded-xl self-start md:self-auto font-mono text-xs text-slate-300">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>Hubs: Argentina · México · Latam</span>
        </div>
      </div>

      {/* Network / Strategic Bridge Graphic & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Node Map Concept */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#050b18] border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          {/* Circuit map background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Red de Alianzas Activas
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              Conexión Tecnológica Internacional
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integración de talento, conocimiento y alcance territorial para entregar soluciones robustas a escala global.
            </p>
          </div>

          {/* Node Connections Graphic */}
          <div className="relative z-10 py-6 my-2">
            <div className="flex items-center justify-between gap-4">
              {/* Node Argentina */}
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-center flex-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <div className="text-xs font-bold text-white font-display">Argentina</div>
                <div className="text-[10px] font-mono text-cyan-400">Headquarters Lab</div>
              </div>

              {/* Connecting animated line */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                </div>
                <span className="text-[9px] font-mono text-cyan-500 mt-1 uppercase">Sinergia</span>
              </div>

              {/* Node Mexico (Panatec) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-center flex-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <div className="text-xs font-bold text-white font-display">México</div>
                <div className="text-[10px] font-mono text-cyan-400">Hub Panatec</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
            <span>Modelos de Colaboración</span>
            <span className="text-cyan-400 font-bold">100% Sinérgico</span>
          </div>
        </div>

        {/* Right Cards */}
        <div className="lg:col-span-7 space-y-6">
          {activePartnerships.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#081226] border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Badge + Country */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                    {item.partnership_type}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.country} {item.city ? `(${item.city})` : ''}</span>
                  </div>
                </div>

                {/* Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-mono">
                    <Handshake className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </h4>
                    {item.highlight && (
                      <span className="text-[11px] font-mono text-cyan-400">
                        {item.highlight}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Action / Website */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Alianza estratégica activa
                </span>
                {item.website_url && (
                  <a
                    href={item.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Conocer Panatec</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
