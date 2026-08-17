import React from 'react';
import {
  Globe,
  ShoppingBag,
  Zap,
  Layers,
  Cpu,
  Palette,
  MessageSquareCode,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface SolutionsSectionProps {
  onOpenQuote: (serviceName?: string) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onOpenQuote }) => {
  const solutions = [
    {
      number: '01',
      title: 'Sitios Institucionales & Corporativos',
      tagline: 'Presencia digital sólida, rápida y confiable',
      description:
        'Desarrollamos la vidriera digital de tu empresa u organización. Arquitectura moderna con carga instantánea, SEO técnico de primer nivel y diseño que proyecta autoridad.',
      tags: ['Next.js', 'SEO Ultra', 'Panel Autogestionable', 'Multi-idioma'],
      icon: Globe,
    },
    {
      number: '02',
      title: 'E-commerce & Tiendas de Alta Conversión',
      tagline: 'Ventas 24/7 sin fricciones de checkout',
      description:
        'Tiendas online optimizadas para maximizar el ticket promedio. Integración con pasarelas de pago (Mercado Pago, Stripe, Ualá), gestión de stock, variantes de producto y cálculo de envíos.',
      tags: ['Mercado Pago', 'Control de Stock', 'Checkout Rápido', 'Notificaciones'],
      icon: ShoppingBag,
    },
    {
      number: '03',
      title: 'Landing Pages & Campañas de Performance',
      tagline: 'Páginas concebidas exclusivamente para convertir tráfico en leads',
      description:
        'Estructura persuasiva, llamados a la acción estratégicos y tests de velocidad. Formularios con validación en tiempo real y conexión directa a tu WhatsApp y CRM.',
      tags: ['Ultra Liviana', 'A/B Ready', 'WhatsApp Direct', 'Pixel & Analytics'],
      icon: Zap,
    },
    {
      number: '04',
      title: 'Plataformas Web & Dashboards SaaS',
      tagline: 'Sistemas a medida para digitalizar y automatizar operaciones',
      description:
        'Portales para clientes, sistemas de gestión interna, tableros de control con métricas en tiempo real y paneles de administración con roles y permisos seguros.',
      tags: ['Supabase / PostgreSQL', 'Auth & Roles', 'Reportería en Vivo', 'APIs'],
      icon: Layers,
    },
    {
      number: '05',
      title: 'Automatizaciones & WhatsApp API',
      tagline: 'Flujos automáticos que ahorran horas de trabajo humano',
      description:
        'Conexión entre tu web, bases de datos y canales de mensajería. Envío automático de presupuestos, confirmación de pedidos, recordatorio de turnos e inscripciones.',
      tags: ['WhatsApp Cloud API', 'Webhooks', 'Notificaciones Email', 'CRM Sync'],
      icon: MessageSquareCode,
    },
    {
      number: '06',
      title: 'Diseño UX/UI & Rediseño de Marca Digital',
      tagline: 'Estética tecnológica con criterio editorial y humano',
      description:
        'Prototipado interactivo en Figma, diseño de sistemas de diseño escalables, iconografía a medida y animaciones sutiles que elevan la percepción de valor de tu marca.',
      tags: ['Figma Prototyping', 'Design Systems', 'Microinteracciones', 'Accesibilidad'],
      icon: Palette,
    },
  ];

  return (
    <section id="soluciones" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Servicios de Ingeniería Digital</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
            SOLUCIONES <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">QUE CONSTRUIMOS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Desarrollo web sin atajos. Combinamos ingeniería de software robusta, diseño visual de alto nivel y foco obsesivo en resultados comerciales.
          </p>
        </div>

        <button
          onClick={() => onOpenQuote('Solución a Medida')}
          className="px-6 py-3 rounded-xl bg-[#081226] hover:bg-[#0d1e3d] border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all self-start md:self-auto shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <span>Cotizar una solución</span>
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Editorial Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {solutions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="group relative rounded-2xl bg-[#050b18] border border-slate-800/90 hover:border-cyan-500/50 p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            >
              {/* Circuit Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              </div>

              <div>
                {/* Header: Number + Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black font-mono text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                    {item.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:text-white group-hover:bg-cyan-500/10 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {item.title}
                </h3>

                {/* Tagline */}
                <div className="text-xs font-mono text-cyan-400/90 font-medium mb-3">
                  {item.tagline}
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80 mb-5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <button
                  onClick={() => onOpenQuote(item.title)}
                  className="w-full py-2.5 rounded-lg bg-slate-900 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-slate-800 group-hover:border-transparent cursor-pointer"
                >
                  <span>Consultar por este servicio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
