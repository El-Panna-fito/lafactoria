import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectImage } from '../types';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  Tag,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Send,
  Layers,
  TrendingUp,
  Play,
  Monitor,
} from 'lucide-react';
import { InteractiveDemoViewer } from './InteractiveDemoViewer';
import { MercadoLibreGallery } from './MercadoLibreGallery';

interface ProjectPageProps {
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenQuote: (project: Project) => void;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject,
  onOpenQuote,
}) => {
  // Gallery images (default fallback to cover image if none in project.images)
  const images: ProjectImage[] =
    project.images && project.images.length > 0
      ? project.images
      : [
          {
            id: 'img-main',
            project_id: project.id,
            image_url: project.cover_image,
            alt_text: project.title,
            sort_order: 0,
            caption: 'Vista principal del proyecto.',
          },
        ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const demoSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setIsDemoModalOpen(false);
  }, [project.id]);

  // Related projects
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleScrollToDemo = (inModal = false) => {
    if (inModal) {
      setIsDemoModalOpen(true);
    } else {
      demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al catálogo</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-[#050b18] border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir ficha'}</span>
          </button>

          <button
            onClick={() => handleScrollToDemo(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Probar Demo Interactiva</span>
          </button>
        </div>
      </div>

      {/* Project Main Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
              {project.category_name || 'Desarrollo Web'}
            </span>
            {project.featured && (
              <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Caso de Éxito
              </span>
            )}
            <span className="text-xs font-mono text-slate-400">
              ID: {project.slug}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.05]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {project.short_description}
          </p>

          {/* Project Meta Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#050b18] border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                Cliente
              </div>
              <div className="text-sm font-bold text-white">
                {project.client_name || 'La factorIA Lab'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Año / Versión
              </div>
              <div className="text-sm font-bold text-white">
                {project.year || '2024'}
              </div>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Estado
              </div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Demo 100% Funcional
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-cyan-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA / Metrics Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#081226] border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
          {/* Subtle Circuit Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Impacto & Rendimiento
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Auditoría Web
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {project.metrics && project.metrics.length > 0 ? (
                project.metrics.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.label}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-2xl font-black font-mono text-cyan-300">0.5s</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Tiempo de carga</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-2xl font-black font-mono text-cyan-300">100%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Mobile First</div>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Live Demo Launcher Action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleScrollToDemo(false)}
                className="w-full py-3.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer active:scale-95"
              >
                <Monitor className="w-4 h-4" />
                <span>Ir a la demo interactiva en vivo</span>
              </button>
              
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
                <button
                  onClick={() => handleScrollToDemo(true)}
                  className="hover:text-cyan-300 flex items-center gap-1 underline transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-cyan-400" />
                  <span>Abrir en ventana maximizada</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Quote trigger */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">¿Te interesa este modelo?</div>
              <div className="text-[11px] text-slate-400">Cotizá una versión para tu empresa</div>
            </div>
            <button
              onClick={() => onOpenQuote(project)}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cotizar
            </button>
          </div>
        </div>
      </div>

      {/* 1. FIRST: Mercado Libre Style Image Gallery */}
      <div ref={gallerySectionRef} className="my-12 space-y-4">
        <MercadoLibreGallery
          images={images}
          projectTitle={project.title}
          onOpenLightbox={() => setIsLightboxOpen(true)}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
        />
      </div>

      {/* 2. SECOND (BELOW): Embedded Interactive Live Demo Section */}
      <div ref={demoSectionRef} className="my-16 space-y-4 scroll-mt-28">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
                <span>Demo Interactiva en Vivo</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Interactuá directamente con la web funcional abajo o cambialo a vista tablet/móvil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#050b18] border border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modo Ventana Maximizada</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Viewer */}
        <InteractiveDemoViewer
          project={project}
          onOpenQuote={onOpenQuote}
          isModal={false}
        />
      </div>

      {/* Floating / Pop-out Fullscreen Interactive Demo Window */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="w-full h-full max-w-7xl flex flex-col">
            <InteractiveDemoViewer
              project={project}
              onClose={() => setIsDemoModalOpen(false)}
              onOpenQuote={onOpenQuote}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Lightbox Modal for Gallery */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center z-50 cursor-pointer"
            aria-label="Cerrar lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center">
            <img
              src={images[activeImageIndex]?.image_url}
              alt={images[activeImageIndex]?.alt_text}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl border border-slate-800"
            />

            {images.length > 1 && (
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handlePrevImage}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={handleNextImage}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Description & Architecture Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 my-16">
        {/* Story / Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Arquitectura & Desarrollo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Sobre el proyecto y alcance técnico
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        </div>

        {/* Features List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-[#050b18] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Características Incluidas
            </h3>

            <div className="space-y-2.5">
              {project.features && project.features.length > 0 ? (
                project.features.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">{feat.title}</div>
                      {feat.description && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{feat.description}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">
                  Características estándar: Responsive design, optimización SEO, panel autogestionable y analítica web.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Callout Box: ¿Querés una web como esta? */}
      <div className="my-16 p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#081226] via-[#050b18] to-[#020617] border border-cyan-500/40 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Propuesta a Medida
          </div>
          <h3 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            ¿Querés una web como <span className="text-cyan-300">"{project.title}"</span>?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            Cotizamos tu proyecto identificando este trabajo como referencia técnica y visual. Recibí una estimación de tiempos y presupuesto sin compromiso.
          </p>
        </div>

        <button
          onClick={() => onOpenQuote(project)}
          className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Solicitar una cotización</span>
        </button>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase">
              Otros proyectos destacados
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Ver todo el catálogo →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProject(rel)}
                className="group p-4 rounded-xl bg-[#050b18] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-slate-950">
                  <img
                    src={rel.cover_image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {rel.category_name}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


