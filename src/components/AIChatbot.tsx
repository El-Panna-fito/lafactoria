import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Project } from '../types';
import { db } from '../services/db';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Minimize2,
  Maximize2,
  ChevronDown,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Edit3,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  recommendedProjects?: string[];
  suggestQuote?: boolean;
}

interface UserContactInfo {
  name: string;
  contact: string; // email or phone
  company?: string;
}

interface AIChatbotProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenQuote: (project?: Project) => void;
}

const STORAGE_KEYS = {
  USER_CONTACT: 'lafactoria_chat_user_v1',
  ACTIVE_LEAD_ID: 'lafactoria_chat_lead_id_v1',
};

const QUICK_PROMPTS = [
  {
    label: '¿Qué web necesito?',
    icon: '💡',
    text: 'Tengo un negocio y quiero saber qué tipo de página web me conviene desarrollar.',
  },
  {
    label: 'Tienda Online',
    icon: '🛍️',
    text: 'Quiero vender productos con catálogo y pagos online automáticos con Mercado Pago.',
  },
  {
    label: 'Educación / Colegio',
    icon: '🏫',
    text: 'Busco un portal para una institución educativa con admisiones y carreras.',
  },
  {
    label: 'Turnero o Salud',
    icon: '🩺',
    text: 'Necesito un sitio web para agendar citas y turnos online 24/7.',
  },
  {
    label: 'Tiempos y Precios',
    icon: '⚡',
    text: '¿Cuánto demoran en desarrollar un proyecto y cómo es el proceso de presupuesto?',
  },
];

export const AIChatbot: React.FC<AIChatbotProps> = ({
  projects,
  onSelectProject,
  onOpenQuote,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // User Contact / Onboarding State
  const [contactInfo, setContactInfo] = useState<UserContactInfo | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.USER_CONTACT);
    return raw ? JSON.parse(raw) : null;
  });

  const [leadId, setLeadId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_LEAD_ID);
  });

  // Onboarding Form Inputs
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formError, setFormError] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (contactInfo) {
      return [
        {
          id: 'welcome-init',
          role: 'model',
          text: `¡Hola **${contactInfo.name}**! Qué bueno tenerte de vuelta. Soy tu **Asesor de Descubrimiento de La factorIA**.\n\n¿En qué tipo de proyecto o página web estás pensando para tu negocio? Contame los detalles y te oriento con la mejor arquitectura.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProjects: [],
          suggestQuote: false,
        },
      ];
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, isEditingContact]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnreadNotification(false);
      if (contactInfo && !isEditingContact) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, contactInfo, isEditingContact]);

  // Handle Contact Onboarding Form Submit
  const handleStartChatWithContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = formName.trim();
    const trimmedContact = formContact.trim();
    const trimmedCompany = formCompany.trim();

    if (trimmedName.length < 2) {
      setFormError('Por favor ingresá tu nombre.');
      return;
    }

    if (trimmedContact.length < 5) {
      setFormError('Por favor ingresá un email válido o número de WhatsApp.');
      return;
    }

    const newContact: UserContactInfo = {
      name: trimmedName,
      contact: trimmedContact,
      company: trimmedCompany || undefined,
    };

    setContactInfo(newContact);
    localStorage.setItem(STORAGE_KEYS.USER_CONTACT, JSON.stringify(newContact));
    setIsEditingContact(false);

    // Sync or create CRM Lead
    try {
      const createdLead = await db.syncChatLead(leadId, newContact, {
        role: 'system',
        text: `Contacto verificado: ${newContact.name} (${newContact.contact})${newContact.company ? ` - ${newContact.company}` : ''}`,
      });

      if (createdLead?.id) {
        setLeadId(createdLead.id);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LEAD_ID, createdLead.id);
      }
    } catch (err) {
      console.error('Error syncing lead to CRM:', err);
    }

    // Add personalized greeting from AI
    const welcomeMsg: ChatMessage = {
      id: `ai-welcome-${Date.now()}`,
      role: 'model',
      text: `¡Hola **${newContact.name}**! Un gusto saludarte. Ya registré tu contacto en nuestro sistema de atención.\n\nContame: ¿qué tenés pensado para tu página web o qué objetivo te gustaría lograr con tu negocio?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProjects: [],
      suggestQuote: false,
    };

    setMessages((prev) => (prev.length === 0 ? [welcomeMsg] : [...prev, welcomeMsg]));
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (!contactInfo) return;
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [
      ...messages.map((m) => ({ role: m.role, text: m.text, timestamp: m.timestamp })),
      { role: userMsg.role, text: userMsg.text, timestamp: userMsg.timestamp },
    ];

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    let currentLeadId = leadId || (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACTIVE_LEAD_ID) : null);

    // Sync user message and updated full transcript to CRM and Supabase
    try {
      const updated = await db.syncChatLead(
        currentLeadId,
        contactInfo,
        { role: 'user', text: message },
        undefined,
        updatedHistory
      );
      if (updated?.id) {
        currentLeadId = updated.id;
        setLeadId(updated.id);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LEAD_ID, updated.id);
      }
    } catch (err) {
      console.warn('Background sync error on user message:', err);
    }

    try {
      // Build previous history for API
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Build a compact catalog from the projects ACTUALLY loaded in the system
      // so the AI advisor only recommends real, published projects.
      const catalogPayload = projects
        .filter((p) => p.status === 'published')
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category_name,
          short_description: p.short_description,
          tags: p.tags,
          features: (p.features || []).map((f) => f.title),
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: historyPayload,
          userName: contactInfo.name,
          catalog: catalogPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Aquí tenés la orientación para tu proyecto.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjects: data.recommendedProjects || [],
        suggestQuote: data.suggestQuote ?? false,
      };

      setMessages((prev) => [...prev, modelMsg]);

      const fullHistoryWithAI = [
        ...updatedHistory,
        { role: modelMsg.role, text: modelMsg.text, timestamp: modelMsg.timestamp },
      ];

      // Sync AI message and any detected discovery requirements/service to Supabase CRM
      try {
        const synced = await db.syncChatLead(
          currentLeadId,
          contactInfo,
          { role: 'model', text: data.reply },
          {
            summary: data.detectedSummary,
            service: data.detectedService,
            project_title: data.recommendedProjects?.[0] || undefined,
          },
          fullHistoryWithAI
        );
        if (synced?.id) {
          setLeadId(synced.id);
          localStorage.setItem(STORAGE_KEYS.ACTIVE_LEAD_ID, synced.id);
        }
      } catch (err) {
        console.warn('Background sync error on AI reply:', err);
      }
    } catch (err) {
      console.warn('Fallback response due to API error:', err);

      // Smart client-side fallback with discovery focus
      const lower = message.toLowerCase();
      let fallbackText = '¡Excelente consulta! En **La factorIA** te ayudamos a identificar la solución exacta que necesita tu negocio.';
      let recs: string[] = [];
      let detectedService = 'Desarrollo Web';
      let detectedSummary = message;

      if (lower.includes('escuela') || lower.includes('colegio') || lower.includes('educa') || lower.includes('instituto') || lower.includes('curso') || lower.includes('cecp')) {
        fallbackText = 'Para instituciones y proyectos educativos, la estructura recomendada es un **Portal Académico e Institucional**: incluye catálogo de carreras, gestión de admisiones digital y botón de contacto directo por WhatsApp.';
        recs = ['cecp'];
        detectedService = 'Portal Educativo / Institucional';
        detectedSummary = 'Interesado en plataforma educativa con admisiones y catálogo formativo.';
      } else if (lower.includes('tienda') || lower.includes('ropa') || lower.includes('vender') || lower.includes('ecommerce') || lower.includes('pago') || lower.includes('producto')) {
        fallbackText = 'Para comercializar productos físicos o digitales, la arquitectura recomendada es una **Tienda E-Commerce Transaccional**: catálogo optimizado para celular, checkout rápido, cobros con Mercado Pago y cuotas.';
        recs = ['stellar-boutique'];
        detectedService = 'E-commerce Transaccional';
        detectedSummary = 'Interesado en tienda online con pagos Mercado Pago y catálogo digital.';
      } else if (lower.includes('médic') || lower.includes('medic') || lower.includes('salud') || lower.includes('turno') || lower.includes('clinica') || lower.includes('doctor') || lower.includes('psicolog')) {
        fallbackText = 'Para profesionales de salud o consultorios, la mejor solución es una **Web con Turnero Online 24/7**: permite a los pacientes reservar turno automáticamente sin saturar tu WhatsApp.';
        recs = ['mediplus-connect'];
        detectedService = 'Turnero Online / Salud';
        detectedSummary = 'Interesado en turnos online y agenda de pacientes automatizada.';
      } else if (lower.includes('saas') || lower.includes('transporte') || lower.includes('logis') || lower.includes('dashboard') || lower.includes('flota')) {
        fallbackText = 'Para empresas con operaciones y monitoreo, desarrollamos **Plataformas Web y Dashboards SaaS**: telemetría en vivo, mapas y control de métricas.';
        recs = ['logistech-pro'];
        detectedService = 'Plataforma SaaS / Dashboard';
        detectedSummary = 'Interesado en panel operativo y SaaS a medida.';
      } else if (lower.includes('donde') || lower.includes('dónde') || lower.includes('ubic') || lower.includes('parana') || lower.includes('paraná')) {
        fallbackText = 'Estamos en **Paraná, Entre Ríos, Argentina**, integrados al ecosistema formativo y tecnológico del Instituto **IEC** ([iec-ia.com.ar](https://iec-ia.com.ar) / [@iecparana](https://instagram.com/iecparana)).\n\nTrabajamos de forma 100% remota con empresas de todo el país y el exterior.';
        recs = [];
      } else if (lower.includes('tiempo') || lower.includes('plazo') || lower.includes('demor') || lower.includes('precio') || lower.includes('costo')) {
        fallbackText = 'Nuestros plazos de entrega promedio van de **1 a 3 semanas**, entregando código limpio, alta velocidad de carga y soporte continuo. Preparamos cotizaciones detalladas en menos de 24 horas hábiles.';
        recs = [];
      } else {
        fallbackText = 'Para recomendarte el tipo de página web ideal: ¿tu objetivo principal es **vender productos con cobro online**, **captar consultas/clientes potenciales**, o **agendar citas y turnos automáticos**?';
        recs = [];
      }

      const modelMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjects: recs,
        suggestQuote: recs.length > 0,
      };

      setMessages((prev) => [...prev, modelMsg]);

      const fullHistoryWithFallback = [
        ...updatedHistory,
        { role: modelMsg.role, text: modelMsg.text, timestamp: modelMsg.timestamp },
      ];

      // Sync fallback to CRM
      try {
        const syncedFallback = await db.syncChatLead(
          currentLeadId,
          contactInfo,
          { role: 'model', text: fallbackText },
          {
            summary: detectedSummary,
            service: detectedService,
            project_title: recs[0] || undefined,
          },
          fullHistoryWithFallback
        );
        if (syncedFallback?.id) {
          setLeadId(syncedFallback.id);
          localStorage.setItem(STORAGE_KEYS.ACTIVE_LEAD_ID, syncedFallback.id);
        }
      } catch (err) {
        console.warn('Background sync error on fallback:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const greeting = contactInfo
      ? `¡Conversación reiniciada, **${contactInfo.name}**! Contame qué nuevo proyecto o requerimiento tenés en mente.`
      : '¡Conversación reiniciada! Por favor completá tus datos de contacto para orientarte.';

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjects: [],
        suggestQuote: false,
      },
    ]);
  };

  const handleClearUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_CONTACT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_LEAD_ID);
    setContactInfo(null);
    setLeadId(null);
    setFormName('');
    setFormContact('');
    setFormCompany('');
    setIsEditingContact(true);
    setMessages([]);
  };

  // Helper to find project by slug or ID
  const getProjectBySlug = (slug: string) => {
    return projects.find((p) => p.slug === slug || p.id === slug);
  };

  return (
    <aside aria-label="Asistente Virtual con Gemini" className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Abrir asesor digital con IA"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping pointer-events-none opacity-60" />

          <div className="relative w-7 h-7 rounded-full bg-slate-950/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin-slow" />
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-black leading-none">Asesor IA</span>
            <span className="text-[9px] font-mono opacity-80 leading-tight">
              {contactInfo ? `Hola ${contactInfo.name.split(' ')[0]}!` : '¿Qué web buscás?'}
            </span>
          </div>

          {hasUnreadNotification && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950 flex items-center justify-center text-[8px] font-mono text-white font-bold animate-bounce">
              1
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#050b18] border border-cyan-500/40 rounded-2xl shadow-[0_10px_60px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.3)]'
              : 'w-[92vw] sm:w-[440px] h-[610px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#081226] border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2 select-none shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Bot className="w-4 h-4 text-slate-950" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white font-display">Asesor La factorIA</h3>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/30">
                    CRM Conectado
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  {contactInfo ? (
                    <span className="truncate max-w-[200px]">
                      👤 {contactInfo.name} ({contactInfo.contact})
                    </span>
                  ) : (
                    <span>Registro inicial de contacto</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {contactInfo && (
                <button
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                  title="Editar mis datos de contacto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reiniciar chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Minimizar tamaño' : 'Expandir ventana'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONTACT ONBOARDING / EDITING STEP */}
          {(!contactInfo || isEditingContact) ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#020617] flex flex-col justify-center">
              <div className="p-5 rounded-2xl bg-[#081226] border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      {contactInfo ? 'Actualizar mis datos' : '¡Te damos la bienvenida!'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Para iniciar la asesoría y guardar tus requerimientos en el sistema, ingresá tu contacto:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStartChatWithContact} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <User className="w-3 h-3 text-cyan-400" />
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Martín García"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      Email o WhatsApp / Teléfono *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. martin@gmail.com o +54 9 343 456-7890"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      Empresa o Negocio <span className="text-[10px] text-slate-500">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Estudio Jurídico, Tienda de ropa..."
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-300">
                      {formError}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    {contactInfo && (
                      <button
                        type="button"
                        onClick={() => setIsEditingContact(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                      <span>Comenzar Asesoría</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {contactInfo && (
                  <div className="pt-2 border-t border-slate-800 flex justify-center">
                    <button
                      type="button"
                      onClick={handleClearUser}
                      className="text-[10px] font-mono text-rose-400 hover:underline"
                    >
                      Cerrar sesión de contacto y registrar nuevo usuario
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617] scroll-smooth">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-start gap-2 max-w-[90%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                              : 'bg-[#081226] text-slate-200 border border-slate-800 rounded-tl-none'
                          }`}
                        >
                          {/* Formatted Markdown Rendering */}
                          <div className="chat-markdown text-xs space-y-2 [&_p]:leading-relaxed [&_strong]:text-white [&_strong]:font-bold [&_a]:text-cyan-300 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1">
                            <Markdown>{msg.text}</Markdown>
                          </div>

                          {/* Render recommended project cards inside AI message ONLY when present */}
                          {!isUser && msg.recommendedProjects && msg.recommendedProjects.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-slate-700/80 space-y-2">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1">
                                <Layers className="w-3 h-3 text-cyan-400" />
                                Estilo recomendado para este caso:
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                {msg.recommendedProjects.map((slug) => {
                                  const proj = getProjectBySlug(slug);
                                  if (!proj) return null;
                                  return (
                                    <div
                                      key={proj.id}
                                      className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3 group"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        {proj.cover_image && (
                                          <img
                                            src={proj.cover_image}
                                            alt={proj.title}
                                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                                          />
                                        )}
                                        <div className="min-w-0">
                                          <div className="text-xs font-bold text-white truncate font-display group-hover:text-cyan-300 transition-colors">
                                            {proj.title}
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate font-mono">
                                            {proj.category_name}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          onClick={() => {
                                            onSelectProject(proj);
                                            setIsOpen(false);
                                          }}
                                          className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                          title="Ver demo interactiva"
                                        >
                                          <span>Ver Demo</span>
                                          <ArrowUpRight className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            onOpenQuote(proj);
                                            setIsOpen(false);
                                          }}
                                          className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                          title="Pedir cotización"
                                        >
                                          <span>Cotizar</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Direct Quote CTA inside message when relevant */}
                          {!isUser && msg.suggestQuote && (
                            <div className="mt-3 pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                              <span className="text-[10px] text-slate-400 font-mono">
                                Estimación técnica en &lt;24hs
                              </span>
                              <button
                                onClick={() => {
                                  onOpenQuote();
                                  setIsOpen(false);
                                }}
                                className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>Cotizar Proyecto</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-[#081226] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] font-mono">Asesorando y guardando en CRM...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="bg-[#050b18] border-t border-slate-800/80 px-3 py-2 shrink-0">
                <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                  <span>Sugerencias para empezar:</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.text)}
                      disabled={isLoading}
                      className="px-2.5 py-1 rounded-full bg-[#081226] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-slate-300 hover:text-cyan-300 text-[10px] font-mono whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <span>{qp.icon}</span>
                      <span>{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#081226] border-t border-slate-800 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Hola ${contactInfo.name.split(' ')[0]}, contame tu idea...`}
                  disabled={isLoading}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shrink-0 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  title="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </aside>
  );
};
