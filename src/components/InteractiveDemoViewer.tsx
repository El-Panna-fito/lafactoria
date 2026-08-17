import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Lock,
  Sparkles,
  X,
  Send,
  Globe,
  AlertCircle,
  Play,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface InteractiveDemoViewerProps {
  project: Project;
  onClose?: () => void;
  onOpenQuote?: (project: Project) => void;
  isModal?: boolean;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const InteractiveDemoViewer: React.FC<InteractiveDemoViewerProps> = ({
  project,
  onClose,
  onOpenQuote,
  isModal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIframeError, setHasIframeError] = useState(false);
  const [simulationActiveTab, setSimulationActiveTab] = useState<'home' | 'features' | 'catalog' | 'portal'>('home');

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          // Fallback to CSS fullscreen
          setIsFullscreen(!isFullscreen);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {
          setIsFullscreen(false);
        });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasIframeError(false);
    setIframeKey((prev) => prev + 1);
  };

  // Determine viewport width style according to device mode
  const getDeviceStyle = () => {
    if (deviceMode === 'mobile') {
      return 'w-[375px] max-w-full h-[667px] max-h-[85vh] rounded-[36px] border-[10px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] my-auto';
    }
    if (deviceMode === 'tablet') {
      return 'w-[768px] max-w-full h-[800px] max-h-[88vh] rounded-[24px] border-[8px] border-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.7)] my-auto';
    }
    return 'w-full h-full rounded-none';
  };

  const demoUrl = project.demo_url || `https://${project.slug}.demo.lafactoria.dev`;

  return (
    <div
      ref={containerRef}
      id={`interactive-demo-${project.id}`}
      className={`flex flex-col bg-[#030712] border border-slate-800 text-slate-100 overflow-hidden transition-all duration-300 ${
        isModal
          ? isFullscreen
            ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
            : 'fixed inset-4 sm:inset-6 md:inset-10 z-50 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.25)] border-cyan-500/40'
          : isFullscreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
          : 'relative w-full rounded-2xl shadow-2xl h-[680px] sm:h-[750px] border-cyan-500/30'
      }`}
    >
      {/* Window Title & Control Bar */}
      <div className="bg-[#050b18] border-b border-slate-800/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Window Dots & Title */}
        <div className="flex items-center gap-3">
          {/* Mac-like Window Controls */}
          <div className="flex items-center gap-1.5">
            <span
              onClick={onClose}
              className={`w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer transition-colors ${
                !onClose && 'opacity-60 cursor-default'
              }`}
              title={onClose ? 'Cerrar ventana de demo' : 'Ventana activa'}
            />
            <span
              onClick={toggleFullscreen}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer transition-colors"
              title="Alternar pantalla completa"
            />
            <span
              onClick={handleRefresh}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer transition-colors"
              title="Recargar demo"
            />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="text-xs font-bold text-white font-display line-clamp-1">
              {project.title}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Demo Interactiva
            </span>
            <button
              onClick={handleRefresh}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors ml-1"
              title="Recargar entorno interactivo"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Responsive Viewport Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Device Switcher Pills */}
          <div className="flex items-center bg-[#081226] border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md text-xs transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de escritorio (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md text-xs transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md text-xs transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista móvil (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#081226] border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Abrir en pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Optional Direct Quote CTA */}
          {onOpenQuote && (
            <button
              onClick={() => onOpenQuote(project)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
            >
              <Send className="w-3 h-3" />
              <span>Cotizar similar</span>
            </button>
          )}

          {/* Close Modal Button if modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-rose-950/80 hover:border-rose-500/50 transition-colors"
              title="Cerrar ventana de demo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="flex-1 bg-[#020617] relative flex items-center justify-center overflow-auto p-2 sm:p-4">
        {/* Subtle Cyber Grid Background in stage */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-[#020617]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Cargando entorno interactivo de La factorIA
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm">
              Conectando con {project.title}... Podés interactuar, hacer clic y navegar directamente desde aquí.
            </p>
          </div>
        )}

        {/* Interactive Device Screen Frame */}
        <div className={`transition-all duration-300 relative flex flex-col bg-[#050b18] overflow-hidden ${getDeviceStyle()}`}>
          {/* Mobile/Tablet Speaker Notch Bar if in mobile/tablet mode */}
          {deviceMode === 'mobile' && (
            <div className="h-6 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-1" />
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          )}

          {/* Interactive Simulation Frame or Live Iframe */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950 flex flex-col">
            {/* If has iframe error or simulating interactive project UI */}
            {hasIframeError ? (
              <InteractiveProjectSimulation
                project={project}
                activeTab={simulationActiveTab}
                setActiveTab={setSimulationActiveTab}
                onOpenQuote={onOpenQuote}
              />
            ) : (
              <iframe
                key={iframeKey}
                src={demoUrl}
                title={`Demo interactiva de ${project.title}`}
                className="w-full h-full border-0 bg-slate-950"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasIframeError(true);
                }}
              />
            )}
          </div>

          {/* Mobile Home Bar */}
          {deviceMode === 'mobile' && (
            <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-700 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Bottom Help Bar */}
      <div className="bg-[#050b18] border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Navegación e interacción 100% activa</span>
          </span>
          <span className="hidden sm:inline-block text-slate-700">|</span>
          <span className="hidden sm:inline-block text-slate-400">
            Modo: <span className="text-cyan-300 capitalize">{deviceMode}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasIframeError && (
            <span className="text-amber-400 text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Modo simulador interactivo de alta fidelidad
            </span>
          )}
          <button
            onClick={() => setHasIframeError(!hasIframeError)}
            className="text-[11px] text-slate-400 hover:text-cyan-300 underline"
            title="Alternar entre iframe en vivo y simulador interactivo"
          >
            {hasIframeError ? 'Probar iframe directo' : 'Alternar a simulador integrado'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Interactive Live Simulation Component (for ultra-rich responsive in-browser experience)
interface SimulationProps {
  project: Project;
  activeTab: string;
  setActiveTab: (tab: 'home' | 'features' | 'catalog' | 'portal') => void;
  onOpenQuote?: (project: Project) => void;
}

const InteractiveProjectSimulation: React.FC<SimulationProps> = ({
  project,
  activeTab,
  setActiveTab,
  onOpenQuote,
}) => {
  const [counter, setCounter] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sampleSearch, setSampleSearch] = useState('');

  return (
    <div className="w-full h-full flex flex-col bg-[#050b18] text-slate-100 overflow-y-auto font-sans select-none">
      {/* Demo App Header */}
      <header className="bg-[#081226] border-b border-cyan-500/20 px-6 py-3 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center font-black text-slate-950 font-display">
            {project.title.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight font-display">
              {project.title}
            </div>
            <div className="text-[10px] font-mono text-cyan-400">{project.category_name}</div>
          </div>
        </div>

        {/* Demo Nav Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'home'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'features'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Módulos
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'portal'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Portal / Acción
          </button>
        </div>
      </header>

      {/* Demo Main Content */}
      <div className="flex-1 p-6 sm:p-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#081226] via-[#050b18] to-[#020617] border border-cyan-500/30 p-6 sm:p-8">
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono uppercase font-bold tracking-wider">
              {project.category_name} • Caso Real La factorIA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              {project.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {project.short_description}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('portal')}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
              >
                Probar funcionalidad
              </button>
              {onOpenQuote && (
                <button
                  onClick={() => onOpenQuote(project)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold uppercase hover:bg-slate-800 transition-colors"
                >
                  Cotizar web similar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Sandbox Elements */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.metrics?.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#081226] border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="text-xl font-black font-mono text-cyan-400">{m.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Interactive Live Card Preview */}
            <div className="p-6 rounded-xl bg-[#081226] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Demostración de Funcionalidad Interactiva
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">Estado: Activo</span>
              </div>
              <p className="text-xs text-slate-300">
                Probá interactuar con los componentes de control en tiempo real desarrollados para esta arquitectura:
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setCounter((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-cyan-300">
                    {counter} {counter === 1 ? 'Unidad / Usuario' : 'Unidades / Usuarios'}
                  </span>
                  <button
                    onClick={() => setCounter((prev) => prev + 1)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => alert(`Simulación: Acción ejecutada con éxito en ${project.title}`)}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                >
                  Ejecutar Acción Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features / Modules Tab */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Módulos y Tecnologías Integradas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features?.map((feat) => (
                <div
                  key={feat.id}
                  className="p-4 rounded-xl bg-[#081226] border border-slate-800 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">{feat.title}</div>
                    {feat.description && (
                      <div className="text-[11px] text-slate-400 mt-1">{feat.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portal / Action Tab */}
        {activeTab === 'portal' && (
          <div className="p-6 rounded-xl bg-[#081226] border border-cyan-500/30 space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Portal Interactivo de Pruebas
            </h3>
            <p className="text-xs text-slate-300">
              Formulario de prueba en vivo conectado a la simulación del cliente:
            </p>

            {formSubmitted ? (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Solicitud enviada a la demo en tiempo real!
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  El sistema procesó la interacción en 0.4s simulando el backend de {project.title}.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs font-bold underline mt-2"
                >
                  Enviar otra prueba
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Búsqueda / Parámetro de prueba
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Consultar disponibilidad, plan o carrera..."
                    value={sampleSearch}
                    onChange={(e) => setSampleSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                >
                  Simular Envío Interactivo
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
