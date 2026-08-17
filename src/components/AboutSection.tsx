import React from 'react';
import {
  Cpu,
  Zap,
  Layers,
  Network,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Code2,
  Building2,
  Workflow,
  ArrowRight,
  Globe,
  ExternalLink,
  Instagram,
} from 'lucide-react';

interface AboutSectionProps {
  onOpenQuote?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenQuote }) => {
  return (
    <section id="nosotros" className="py-24 bg-[#020617] relative overflow-hidden border-t border-slate-800/80">
      {/* Subtle Background Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0813290a_1px,transparent_1px),linear-gradient(to_bottom,#0813290a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sobre Nosotros · La factorIA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase leading-[1.05]">
            PROGRAMADORES EXPERTOS EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">IA Y DESARROLLO EN SERIE</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Somos un equipo de programadores e ingenieros de software especializados en inteligencia artificial. A partir del estudio exhaustivo de las herramientas más avanzadas de IA, diseñamos un <strong>sistema de desarrollo y construcción en serie</strong> que nos permite crear páginas web y soluciones digitales completas y de máxima calidad en <strong>30 días</strong>.
          </p>

          {/* Social Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://instagram.com/la.factor.ia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050b18] border border-slate-700 hover:border-pink-500/50 text-xs font-mono text-slate-300 hover:text-pink-300 transition-colors shadow-sm group"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>@la.factor.ia</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-pink-400" />
            </a>

            <a
              href="https://iec-ia.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-500/10 text-xs font-mono text-cyan-300 transition-colors shadow-sm group"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>iec-ia.com.ar</span>
              <ExternalLink className="w-3 h-3 text-cyan-500" />
            </a>

            <a
              href="https://instagram.com/iecparana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050b18] border border-slate-700 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors shadow-sm group"
            >
              <Instagram className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>@iecparana</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Highlight Banner: Sistema de Construcción en Serie en 30 Días */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#081226] via-[#050b18] to-[#081226] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="flex items-start gap-4 pt-4 md:pt-0">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Plazos Garantizados</div>
                <div className="text-xl font-bold font-display text-white">Despliegue en 30 Días</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Metodología ágil que elimina la incertidumbre de tiempos largos de desarrollo tradicional.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Workflow className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Ingeniería & IA</div>
                <div className="text-xl font-bold font-display text-white">Construcción en Serie</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Arquitectura modular, componentes preprobados y pipelines asistidos por IA para máxima solidez.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Calidad de Agencia</div>
                <div className="text-xl font-bold font-display text-white">100% Funcionales y Escalables</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diseño visual premium, integración con bases de datos, analítica y optimización total.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosistema IEC Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Block: Institutional Core Message */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#050b18] border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Network className="w-4 h-4" />
                <span>La factorIA dentro del Ecosistema IEC</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight leading-tight">
                El brazo de innovación, desarrollo tecnológico y producción digital de IEC
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>La factorIA</strong> es el espacio donde las ideas, necesidades y oportunidades que circulan dentro del ecosistema se convierten en <strong>soluciones digitales concretas, funcionales y escalables</strong>.
                </p>
                <p>
                  A través de inteligencia artificial, automatización, desarrollo web, software, bases de datos e integraciones, transformamos procesos en herramientas capaces de mejorar la gestión, la comunicación, la comercialización y el crecimiento de empresas, instituciones y organizaciones.
                </p>
              </div>

              {/* Strategic Quote Callout */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#081226] to-[#050b18] border-l-4 border-cyan-500 text-slate-200">
                <p className="text-sm sm:text-base font-semibold italic text-cyan-100">
                  “Su función dentro del Ecosistema IEC es estratégica: IEC articula, conecta y genera oportunidades; La factorIA las transforma en tecnología.”
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Pero La factorIA no representa solamente desarrollo tecnológico. También conecta <strong>formación, talento y producción real</strong>. Los conocimientos generados dentro del <strong>Instituto IEC</strong> se convierten en proyectos concretos, experiencia profesional de primer nivel, portfolio y nuevas oportunidades laborales dentro del propio ecosistema.
                </p>
              </div>

              {/* IEC Direct Navigation & Social Link Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#081226] to-[#030712] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Conocé el Ecosistema IEC</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Descubrí todos los programas, formación y empresas del grupo.
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href="https://iec-ia.com.ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer group shrink-0"
                  >
                    <span>Visitar iec-ia.com.ar</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href="https://instagram.com/iecparana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-pink-500/50 text-slate-300 hover:text-pink-300 transition-colors cursor-pointer"
                    title="Instagram IEC: @iecparana"
                    aria-label="Instagram IEC"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Fábrica inteligente de soluciones digitales
              </div>
              {onOpenQuote && (
                <button
                  onClick={onOpenQuote}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Iniciar un proyecto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Block: Capabilities & Connection Matrix */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Card 1: Lo que construimos */}
            <div className="p-6 rounded-2xl bg-[#050b18] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Code2 className="w-4 h-4" />
                <span>Qué Desarrollamos</span>
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Soluciones Integrales de Software
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Páginas web institucionales & Landing pages de alta conversión</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>E-commerce y tiendas digitales integradas con pasarelas de pago</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Plataformas de gestión ERP y paneles administrativos a medida</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Formularios inteligentes, cotizadores y automatizaciones con IA</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Talento & Formación IEC */}
            <div className="p-6 rounded-2xl bg-[#050b18] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <GraduationCap className="w-4 h-4" />
                  <span>Instituto IEC · Formación & Talento</span>
                </div>
                <a
                  href="https://iec-ia.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>iec-ia.com.ar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Del Conocimiento a la Producción Real
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Conectamos los programas de capacitación y especialización de IEC con desarrollos del mundo real, creando un semillero de profesionales capacitados en las últimas tecnologías de inteligencia artificial y desarrollo.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://instagram.com/iecparana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram: @iecparana</span>
                </a>
              </div>
            </div>

            {/* Card 3: Conclusión Ecosistema */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#081226] to-[#050b18] border border-cyan-500/40 text-center sm:text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Ecosistema Conectado</span>
                </div>
                <a
                  href="https://instagram.com/la.factor.ia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-slate-300 hover:text-pink-300 flex items-center gap-1 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>@la.factor.ia</span>
                </a>
              </div>
              <p className="text-sm font-bold text-white leading-snug">
                Dentro del Ecosistema IEC, La factorIA es el punto donde la inteligencia, las alianzas y las oportunidades se convierten en soluciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

