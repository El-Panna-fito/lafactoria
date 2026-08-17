import React from 'react';
import { GitCommit, Compass, Code, Layout, Rocket, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Descubrimiento',
      subtitle: 'Entendimiento del negocio',
      desc: 'Analizamos tus objetivos, tu cliente ideal, la competencia y los requerimientos funcionales clave.',
      icon: Compass,
    },
    {
      step: '02',
      title: 'Estrategia',
      subtitle: 'Arquitectura & Alcance',
      desc: 'Definimos la estructura de la web, wireframes conceptuales, stack tecnológico y cronograma de entrega.',
      icon: GitCommit,
    },
    {
      step: '03',
      title: 'Diseño UX/UI',
      subtitle: 'Prototipo interactivo',
      desc: 'Creamos interfaces visuales modernas, accesibles y pensadas para la conversión en desktop y mobile.',
      icon: Layout,
    },
    {
      step: '04',
      title: 'Desarrollo',
      subtitle: 'Ingeniería a medida',
      desc: 'Programamos con Next.js, Tailwind y Supabase. Código limpio, sin plantillas lentas ni sobrecargadas.',
      icon: Code,
    },
    {
      step: '05',
      title: 'Lanzamiento',
      subtitle: 'Puesta en producción',
      desc: 'Testing de velocidad, configuración de dominio personalizado, certificados SSL y verificación SEO.',
      icon: Rocket,
    },
    {
      step: '06',
      title: 'Evolución',
      subtitle: 'Soporte & Crecimiento',
      desc: 'Monitoreo de analíticas, acompañamiento técnico, optimizaciones de conversión y soporte continuo.',
      icon: RefreshCw,
    },
  ];

  return (
    <section id="proceso" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#081226] border border-cyan-500/30">
          <span>Metodología de Trabajo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          DE UNA IDEA A UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">PRODUCTO DIGITAL</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Un proceso ágil, transparente y orientado a la excelencia técnica en cada etapa.
        </p>
      </div>

      {/* Desktop Horizontal Stepper / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#050b18] border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
            >
              <div>
                {/* Step Top Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-black font-mono text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-400/40 transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-500 font-bold mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Entregable verificado</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
