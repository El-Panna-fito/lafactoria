import React, { useState } from 'react';
import { Client } from '../types';
import { Building2, Quote, ExternalLink, ShieldCheck, ChevronRight, Star } from 'lucide-react';

interface ClientsSectionProps {
  clients: Client[];
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({ clients }) => {
  const activeClients = clients.filter((c) => c.active);
  const [selectedClient, setSelectedClient] = useState<Client | null>(activeClients[0] || null);

  return (
    <section id="clientes" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#081226] border border-cyan-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Casos Reales & Testimonios</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          CLIENTES QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">CONFÍAN EN NOSOTROS</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Acompañamos a instituciones educativas, empresas y marcas en su transformación digital.
        </p>
      </div>

      {/* Grid of Client Logos (Grayscale to Color on Hover) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {activeClients.map((client) => {
          const isSelected = selectedClient?.id === client.id;
          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 rounded-xl bg-[#050b18] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[110px] ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-[#081226]'
                  : 'border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#071020]'
              }`}
            >
              {/* Logo / Avatar with Grayscale to Color */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/80 mb-2 p-1 flex items-center justify-center">
                <img
                  src={client.logo_url}
                  alt={client.name}
                  className="w-full h-full object-cover rounded filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div className="text-xs font-bold text-slate-300 group-hover:text-white line-clamp-1">
                {client.name}
              </div>

              {client.sector && (
                <div className="text-[10px] font-mono text-slate-400 line-clamp-1">
                  {client.sector}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Featured Testimonial Card */}
      {selectedClient && selectedClient.testimonial && (
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#081226] to-[#040813] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          {/* Subtle Circuit accent */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Quote className="w-32 h-32 text-cyan-400" />
          </div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="flex items-center gap-1 text-cyan-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              ))}
            </div>

            <blockquote className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed italic">
              "{selectedClient.testimonial}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="font-bold font-display text-white text-base">
                  {selectedClient.author || selectedClient.name}
                </div>
                <div className="text-xs font-mono text-cyan-400">
                  {selectedClient.role ? `${selectedClient.role} — ` : ''}
                  {selectedClient.name}
                </div>
              </div>

              {selectedClient.website_url && (
                <a
                  href={selectedClient.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Visitar sitio web oficial</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
