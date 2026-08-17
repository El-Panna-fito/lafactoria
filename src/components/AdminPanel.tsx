import React, { useState, useEffect } from 'react';
import {
  Project,
  Category,
  Client,
  Partnership,
  Lead,
  LeadStatus,
  ProjectFeature,
  ProjectImage,
} from '../types';
import { db } from '../services/db';
import { SUPABASE_SQL_SCHEMA, SUPABASE_RLS_FIX_SQL } from '../services/supabaseSchema';
import { Logo } from './Logo';
import {
  ShieldCheck,
  LayoutDashboard,
  Layers,
  FolderKanban,
  Users,
  Network,
  Inbox,
  Database,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  MessageSquare,
  Lock,
  ArrowLeft,
  Copy,
  CheckCircle,
  FileSpreadsheet,
  HelpCircle,
  Bot,
  UserCheck,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Phone,
  Mail,
  Building,
  Filter,
  AlertTriangle,
} from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lafactoria_admin_auth') === 'true';
  });
  const [authEmail, setAuthEmail] = useState('admin@lafactoria.dev');
  const [authPass, setAuthPass] = useState('factoria2025');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'categories' | 'clients' | 'sinergias' | 'leads' | 'database'
  >('dashboard');

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Supabase Config
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<{
    tested: boolean;
    success: boolean;
    latencyMs: number;
    tables: { name: string; ok: boolean; count: number; error?: string }[];
  }>({
    tested: false,
    success: false,
    latencyMs: 0,
    tables: [],
  });

  const [writeHealth, setWriteHealth] = useState<{
    tested: boolean;
    canRead: boolean;
    canWrite: boolean;
    hasRlsIssue: boolean;
    tableDetails: { table: string; selectOk: boolean; writeOk: boolean; error?: string }[];
  }>({
    tested: false,
    canRead: true,
    canWrite: true,
    hasRlsIssue: false,
    tableDetails: [],
  });

  const [copiedRlsSql, setCopiedRlsSql] = useState(false);

  // Modals & Editing States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [isCreatingPartnership, setIsCreatingPartnership] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Leads Filter & CRM State
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('todos');
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('todos');
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('');
  const [expandedLeadChatId, setExpandedLeadChatId] = useState<string | null>(null);
  const [editingLeadNotesId, setEditingLeadNotesId] = useState<string | null>(null);
  const [leadNotesText, setLeadNotesText] = useState<string>('');

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, c, cl, part, l] = await Promise.all([
        db.getProjects(),
        db.getCategories(),
        db.getClients(),
        db.getPartnerships(),
        db.getLeads(),
      ]);
      setProjects(p);
      setCategories(c);
      setClients(cl);
      setPartnerships(part);
      setLeads(l);

      const config = db.getSupabaseConfig();
      setSupabaseUrl(config.url);
      setSupabaseKey(config.anonKey);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (authEmail === 'admin@lafactoria.dev' && authPass === 'factoria2025') ||
      (authEmail.length > 3 && authPass.length > 5)
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('lafactoria_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Credenciales incorrectas. Podés usar las credenciales de demo sugeridas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lafactoria_admin_auth');
  };

  // Projects Handlers
  const handleSaveProject = async (p: Project) => {
    const res = await db.saveProject(p);
    setEditingProject(null);
    setIsCreatingProject(false);
    if (res.synced) {
      showToast(`✅ Proyecto "${p.title}" sincronizado y guardado en Supabase.`);
    } else {
      showToast(`⚠️ Guardado en caché local. Supabase reportó: ${res.error || 'Bloqueo RLS'}.`);
    }
    loadData();
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de eliminar el proyecto "${title}"?`)) {
      const res = await db.deleteProject(id);
      if (res.synced) {
        showToast(`✅ Proyecto "${title}" eliminado de Supabase.`);
      } else {
        showToast(`⚠️ Eliminado en local. Supabase: ${res.error || 'Error'}`);
      }
      loadData();
    }
  };

  // Categories Handlers
  const handleSaveCategory = async (cat: Category) => {
    const res = await db.saveCategory(cat);
    setEditingCategory(null);
    setIsCreatingCategory(false);
    if (res.synced) {
      showToast(`✅ Categoría "${cat.name}" guardada y sincronizada en Supabase.`);
    } else {
      showToast(`⚠️ Guardada en local. Supabase: ${res.error || 'Error'}`);
    }
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('¿Eliminar esta categoría?')) {
      const res = await db.deleteCategory(id);
      showToast(res.synced ? 'Categoría eliminada de Supabase.' : 'Categoría eliminada localmente.');
      loadData();
    }
  };

  // Clients Handlers
  const handleSaveClient = async (c: Client) => {
    const res = await db.saveClient(c);
    setEditingClient(null);
    setIsCreatingClient(false);
    if (res.synced) {
      showToast(`✅ Cliente "${c.name}" sincronizado en Supabase.`);
    } else {
      showToast(`⚠️ Guardado en local. Supabase: ${res.error || 'Error'}`);
    }
    loadData();
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('¿Eliminar este cliente?')) {
      const res = await db.deleteClient(id);
      showToast(res.synced ? 'Cliente eliminado de Supabase.' : 'Cliente eliminado localmente.');
      loadData();
    }
  };

  // Sinergias Handlers
  const handleSavePartnership = async (p: Partnership) => {
    const res = await db.savePartnership(p);
    setEditingPartnership(null);
    setIsCreatingPartnership(false);
    if (res.synced) {
      showToast(`✅ Sinergia "${p.name}" sincronizada en Supabase.`);
    } else {
      showToast(`⚠️ Guardada en local. Supabase: ${res.error || 'Error'}`);
    }
    loadData();
  };

  const handleDeletePartnership = async (id: string) => {
    if (confirm('¿Eliminar esta sinergia?')) {
      const res = await db.deletePartnership(id);
      showToast(res.synced ? 'Sinergia eliminada de Supabase.' : 'Sinergia eliminada localmente.');
      loadData();
    }
  };

  // Leads Handlers
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    await db.updateLeadStatus(id, status);
    showToast('Estado de cotización actualizado.');
    loadData();
  };

  const handleSaveLeadNotes = async (id: string) => {
    await db.updateLead(id, { notes: leadNotesText });
    setEditingLeadNotesId(null);
    showToast('Notas de seguimiento guardadas.');
    loadData();
  };

  const handleConvertToClient = async (lead: Lead) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: lead.company || lead.name,
      logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      website_url: '',
      sector: lead.service || 'Servicios Digitales',
      testimonial: `Excelente desarrollo web realizado por el equipo de La factorIA.`,
      author: lead.name,
      role: lead.company ? 'Director / Titular' : 'Cliente',
      sort_order: clients.length + 1,
      active: true,
    };

    await db.saveClient(newClient);
    await db.updateLeadStatus(lead.id, 'cerrado');
    showToast(`¡${newClient.name} convertido a Cliente Oficial exitosamente!`);
    loadData();
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('¿Eliminar este lead del CRM?')) {
      await db.deleteLead(id);
      showToast('Lead eliminado.');
      loadData();
    }
  };

  // Supabase connection test
  const handleSaveSupabaseConfig = async () => {
    setIsTestingSupabase(true);
    const success = await db.setSupabaseConfig(supabaseUrl, supabaseKey);
    const health = await db.checkSupabaseHealth();
    setSupabaseHealth({
      tested: true,
      ...health,
    });
    setIsTestingSupabase(false);
    if (success) {
      showToast(`¡Conectado con Supabase! Latencia: ${health.latencyMs}ms`);
      loadData();
    } else {
      showToast('No se pudo conectar con Supabase. Verificá URL y Anon Key.');
    }
  };

  const handleRunDiagnosis = async () => {
    setIsTestingSupabase(true);
    const health = await db.checkSupabaseHealth();
    const writeRes = await db.checkSupabaseWritePermissions();
    setSupabaseHealth({
      tested: true,
      ...health,
    });
    setWriteHealth({
      tested: true,
      ...writeRes,
    });
    setIsTestingSupabase(false);
    if (health.success && writeRes.canWrite) {
      showToast(`Supabase 100% Operativo: Lectura y Escritura confirmadas (${health.latencyMs}ms)`);
    } else if (!writeRes.canWrite || writeRes.hasRlsIssue) {
      showToast('⚠️ Supabase tiene bloqueada la ESCRITURA (RLS activo). Copiá el Script RLS.');
    } else {
      showToast('Se detectaron advertencias en algunas tablas.');
    }
  };

  const handleTestWritePermissions = async () => {
    setIsTestingSupabase(true);
    const writeRes = await db.checkSupabaseWritePermissions();
    setWriteHealth({
      tested: true,
      ...writeRes,
    });
    setIsTestingSupabase(false);
    if (writeRes.canWrite && !writeRes.hasRlsIssue) {
      showToast('🎉 ¡Permisos de Escritura (INSERT / UPDATE) 100% Operativos en Supabase!');
    } else {
      showToast('⚠️ Supabase tiene bloqueada la escritura (Políticas RLS en PostgreSQL). Copiá el Script RLS.');
    }
  };

  const handleCopyRlsSql = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_FIX_SQL);
    setCopiedRlsSql(true);
    showToast('¡Script RLS copiado! Pegalo en Supabase SQL Editor.');
    setTimeout(() => setCopiedRlsSql(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('¡Script SQL completo copiado al portapapeles!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handlePurgeCache = () => {
    if (confirm('¿Limpiar la memoria caché local y forzar la recarga 100% directa desde Supabase?')) {
      db.syncAndPurgeLocal();
      loadData();
      showToast('Caché limpiada. Datos recargados desde Supabase.');
    }
  };

  // If Not Authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 w-full max-w-md bg-[#050b18] border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <div className="text-center mb-8 space-y-3">
            <div className="flex justify-center">
              <Logo size="xl" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">Panel Administrador</h1>
            <p className="text-xs text-slate-400 font-mono">
              Gestión integral de proyectos, clientes, sinergias y leads
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Administrativo</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Contraseña</label>
              <input
                type="password"
                required
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3">
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold">Demo Quick Access:</span> admin@lafactoria.dev / factoria2025
            </div>
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a la web pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Leads & CRM Metrics
  const filteredLeads = leads.filter((l) => {
    // Status Filter
    if (leadStatusFilter !== 'todos' && l.status !== leadStatusFilter) {
      return false;
    }
    // Source Filter
    if (leadSourceFilter !== 'todos') {
      const src = l.source || 'formulario_web';
      if (src !== leadSourceFilter) return false;
    }
    // Search Query (Name, Email, Phone, Company, Requirements)
    if (leadSearchQuery.trim()) {
      const q = leadSearchQuery.toLowerCase();
      const matchName = l.name?.toLowerCase().includes(q);
      const matchEmail = l.email?.toLowerCase().includes(q);
      const matchPhone = l.phone?.toLowerCase().includes(q);
      const matchCompany = l.company?.toLowerCase().includes(q);
      const matchSummary = l.requirements_summary?.toLowerCase().includes(q);
      const matchMsg = l.message?.toLowerCase().includes(q);
      const matchService = l.service?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchCompany || matchSummary || matchMsg || matchService;
    }
    return true;
  });

  const totalLeadsCount = leads.length;
  const chatIaLeadsCount = leads.filter((l) => l.source === 'chat_ia').length;
  const webFormLeadsCount = leads.filter((l) => (l.source || 'formulario_web') === 'formulario_web').length;
  const closedLeadsCount = leads.filter((l) => l.status === 'cerrado').length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col pt-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="bg-[#050b18] border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div>
            <div className="text-sm font-bold font-display text-white">La factorIA — CMS Control Panel</div>
            <div className="text-[10px] font-mono text-cyan-400">Ambiente de Administración Activo</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Sitio Web</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-xs font-mono text-red-300 hover:bg-red-900"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#030712] border-r border-slate-800 p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" />
              <span>Proyectos</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'categories'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categorías</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'clients'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Clientes</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {clients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sinergias')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'sinergias'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Network className="w-4 h-4" />
              <span>Sinergias</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {partnerships.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'leads'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Cotizaciones</span>
            </div>
            {leads.filter((l) => l.status === 'nuevo').length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                {leads.filter((l) => l.status === 'nuevo').length} Nuevos
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'database'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase & SQL</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-6xl">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Resumen General
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Métricas clave de la plataforma La factorIA
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#050b18] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Proyectos Activos</div>
                  <div className="text-3xl font-black font-mono text-cyan-400">
                    {projects.filter((p) => p.status === 'published').length}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {projects.filter((p) => p.featured).length} destacados en portada
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#050b18] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Cotizaciones / Leads</div>
                  <div className="text-3xl font-black font-mono text-cyan-400">{leads.length}</div>
                  <div className="text-[10px] text-emerald-400">
                    {leads.filter((l) => l.status === 'nuevo').length} pendientes de respuesta
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#050b18] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Clientes & Testimonios</div>
                  <div className="text-3xl font-black font-mono text-cyan-400">
                    {clients.filter((c) => c.active).length}
                  </div>
                  <div className="text-[10px] text-slate-400">Empresas e instituciones</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#050b18] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Sinergias Internacionales</div>
                  <div className="text-3xl font-black font-mono text-cyan-400">
                    {partnerships.filter((p) => p.active).length}
                  </div>
                  <div className="text-[10px] text-cyan-300">Hub México (Panatec)</div>
                </div>
              </div>

              {/* Recent Leads Preview */}
              <div className="p-6 rounded-2xl bg-[#050b18] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white">
                    Últimas Solicitudes de Cotización
                  </h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                  >
                    Ver todas ({leads.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{lead.name}</span>
                          {lead.company && <span className="text-slate-400 font-normal">({lead.company})</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {lead.service} · Presupuesto: {lead.budget_range}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            lead.status === 'nuevo'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {lead.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setExpandedLeadChatId(lead.id);
                            setActiveTab('leads');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Ver ficha
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Gestión de Proyectos</h2>
                  <p className="text-xs font-mono text-slate-400">
                    Administrá el catálogo de proyectos y demos
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      id: 'proj-' + Date.now(),
                      title: '',
                      slug: '',
                      short_description: '',
                      description: '',
                      category_id: categories[1]?.id || 'cat-1',
                      category_name: categories[1]?.name || 'Institucional',
                      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
                      demo_url: '',
                      featured: false,
                      status: 'published',
                      sort_order: projects.length + 1,
                      tags: ['Next.js', 'Tailwind', 'Supabase'],
                      client_name: '',
                      year: '2024',
                      features: [],
                      images: [],
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                    setIsCreatingProject(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-[#050b18] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                        <img src={proj.cover_image} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                          {proj.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono uppercase font-bold">
                              Destacado
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                              proj.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Slug: <span className="font-mono text-cyan-400">/proyectos/{proj.slug}</span> · Cat: {proj.category_name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsCreatingProject(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT EDIT / CREATE MODAL */}
          {(editingProject || isCreatingProject) && (
            <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-3xl bg-[#081226] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
                  <h3 className="text-xl font-bold font-display text-white">
                    {isCreatingProject ? 'Crear Nuevo Proyecto' : `Editar: ${editingProject?.title}`}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreatingProject(false);
                    }}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {editingProject && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProject(editingProject);
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Título del Proyecto *</label>
                        <input
                          type="text"
                          required
                          value={editingProject.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingProject({
                              ...editingProject,
                              title: val,
                              slug: editingProject.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Slug URL *</label>
                        <input
                          type="text"
                          required
                          value={editingProject.slug}
                          onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Categoría</label>
                        <select
                          value={editingProject.category_id}
                          onChange={(e) => {
                            const selectedCat = categories.find((c) => c.id === e.target.value);
                            setEditingProject({
                              ...editingProject,
                              category_id: e.target.value,
                              category_name: selectedCat?.name || 'General',
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                        >
                          {categories.filter((c) => c.slug !== 'todos').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Cliente</label>
                        <input
                          type="text"
                          value={editingProject.client_name || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, client_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Año</label>
                        <input
                          type="text"
                          value={editingProject.year || '2024'}
                          onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Descripción Corta</label>
                      <input
                        type="text"
                        required
                        value={editingProject.short_description}
                        onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Descripción Completa</label>
                      <textarea
                        rows={4}
                        required
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">URL Imagen de Portada (Cover)</label>
                        <input
                          type="url"
                          required
                          value={editingProject.cover_image}
                          onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">URL Demo Externa (demo_url)</label>
                        <input
                          type="url"
                          placeholder="https://ejemplo.com"
                          value={editingProject.demo_url || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Tags (separados por coma)</label>
                        <input
                          type="text"
                          value={editingProject.tags.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.featured}
                            onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="rounded text-cyan-500"
                          />
                          <span className="font-bold text-slate-200">Destacado</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.status === 'published'}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                status: e.target.checked ? 'published' : 'draft',
                              })
                            }
                            className="rounded text-cyan-500"
                          />
                          <span className="font-bold text-slate-200">Publicado</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsCreatingProject(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Proyecto</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Categorías del Catálogo</h2>
                  <p className="text-xs font-mono text-slate-400">
                    Gestioná los filtros del marketplace de demos
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory({
                      id: 'cat-' + Date.now(),
                      name: '',
                      slug: '',
                      sort_order: categories.length + 1,
                      active: true,
                    });
                    setIsCreatingCategory(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Categoría</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-[#050b18] border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{cat.name}</span>
                        {cat.slug === 'todos' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-cyan-400 mt-0.5">
                        slug: {cat.slug} · {cat.count ?? 0} proyectos vinculados
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCreatingCategory(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {cat.slug !== 'todos' && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Edit Modal */}
              {(editingCategory || isCreatingCategory) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-[#081226] border border-cyan-500/40 rounded-2xl p-6 text-slate-100">
                    <h3 className="text-lg font-bold font-display text-white mb-4">
                      {isCreatingCategory ? 'Nueva Categoría' : 'Editar Categoría'}
                    </h3>
                    {editingCategory && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveCategory(editingCategory);
                        }}
                        className="space-y-4 text-xs"
                      >
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Nombre de la Categoría</label>
                          <input
                            type="text"
                            required
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                                slug:
                                  editingCategory.slug ||
                                  e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Slug</label>
                          <input
                            type="text"
                            required
                            value={editingCategory.slug}
                            onChange={(e) =>
                              setEditingCategory({ ...editingCategory, slug: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                          />
                        </div>

                        <div className="pt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(null);
                              setIsCreatingCategory(false);
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                          >
                            Guardar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Clientes & Testimonios</h2>
                  <p className="text-xs font-mono text-slate-400">
                    Logos, testimonios y sectores de clientes
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingClient({
                      id: 'cli-' + Date.now(),
                      name: '',
                      logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
                      website_url: '',
                      testimonial: '',
                      author: '',
                      role: '',
                      sector: '',
                      sort_order: clients.length + 1,
                      active: true,
                    });
                    setIsCreatingClient(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Cliente</span>
                </button>
              </div>

              <div className="space-y-3">
                {clients.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#050b18] border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800 p-1">
                        <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{c.name}</div>
                        <div className="text-xs font-mono text-cyan-400">{c.sector || 'Sector general'}</div>
                        {c.testimonial && (
                          <div className="text-xs text-slate-300 italic mt-1 line-clamp-2">
                            "{c.testimonial}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingClient(c);
                          setIsCreatingClient(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(c.id)}
                        className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Edit Modal */}
              {(editingClient || isCreatingClient) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#081226] border border-cyan-500/40 rounded-2xl p-6 text-slate-100">
                    <h3 className="text-lg font-bold font-display text-white mb-4">
                      {isCreatingClient ? 'Nuevo Cliente' : 'Editar Cliente'}
                    </h3>
                    {editingClient && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveClient(editingClient);
                        }}
                        className="space-y-4 text-xs"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Nombre del Cliente *</label>
                            <input
                              type="text"
                              required
                              value={editingClient.name}
                              onChange={(e) =>
                                setEditingClient({ ...editingClient, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Sector / Rubro</label>
                            <input
                              type="text"
                              value={editingClient.sector || ''}
                              onChange={(e) =>
                                setEditingClient({ ...editingClient, sector: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">URL Logo *</label>
                          <input
                            type="url"
                            required
                            value={editingClient.logo_url}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, logo_url: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Testimonio (Opcional)</label>
                          <textarea
                            rows={3}
                            value={editingClient.testimonial || ''}
                            onChange={(e) =>
                              setEditingClient({ ...editingClient, testimonial: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Autor / Persona</label>
                            <input
                              type="text"
                              value={editingClient.author || ''}
                              onChange={(e) =>
                                setEditingClient({ ...editingClient, author: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Cargo / Rol</label>
                            <input
                              type="text"
                              value={editingClient.role || ''}
                              onChange={(e) =>
                                setEditingClient({ ...editingClient, role: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingClient(null);
                              setIsCreatingClient(false);
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                          >
                            Guardar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SINERGIAS */}
          {activeTab === 'sinergias' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white">Sinergias & Alianzas</h2>
                  <p className="text-xs font-mono text-slate-400">
                    Alianzas estratégicas internacionales (ej. Panatec México)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingPartnership({
                      id: 'part-' + Date.now(),
                      name: '',
                      logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
                      country: 'México',
                      city: 'CDMX',
                      description: '',
                      partnership_type: 'Expansión Internacional',
                      website_url: '',
                      featured: true,
                      sort_order: partnerships.length + 1,
                      active: true,
                      highlight: 'Hub Estratégico',
                    });
                    setIsCreatingPartnership(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Sinergia</span>
                </button>
              </div>

              <div className="space-y-4">
                {partnerships.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-xl bg-[#050b18] border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{p.name}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                          {p.country} {p.city ? `(${p.city})` : ''}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          {p.partnership_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPartnership(p);
                          setIsCreatingPartnership(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePartnership(p.id)}
                        className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Partnership Edit Modal */}
              {(editingPartnership || isCreatingPartnership) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-[#081226] border border-cyan-500/40 rounded-2xl p-6 text-slate-100">
                    <h3 className="text-lg font-bold font-display text-white mb-4">
                      {isCreatingPartnership ? 'Nueva Sinergia' : 'Editar Sinergia'}
                    </h3>
                    {editingPartnership && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSavePartnership(editingPartnership);
                        }}
                        className="space-y-4 text-xs"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">Nombre de la Organización</label>
                            <input
                              type="text"
                              required
                              value={editingPartnership.name}
                              onChange={(e) =>
                                setEditingPartnership({ ...editingPartnership, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-300">País</label>
                            <input
                              type="text"
                              required
                              value={editingPartnership.country}
                              onChange={(e) =>
                                setEditingPartnership({ ...editingPartnership, country: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Tipo de Alianza</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Expansión Internacional & Hub Tecnológico"
                            value={editingPartnership.partnership_type}
                            onChange={(e) =>
                              setEditingPartnership({ ...editingPartnership, partnership_type: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Descripción Estratégica</label>
                          <textarea
                            rows={3}
                            required
                            value={editingPartnership.description}
                            onChange={(e) =>
                              setEditingPartnership({ ...editingPartnership, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Sitio Web</label>
                          <input
                            type="url"
                            value={editingPartnership.website_url || ''}
                            onChange={(e) =>
                              setEditingPartnership({ ...editingPartnership, website_url: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                          />
                        </div>

                        <div className="pt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPartnership(null);
                              setIsCreatingPartnership(false);
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                          >
                            Guardar Sinergia
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LEADS / CRM & COTIZACIONES */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                    <span>CRM & Solicitudes de Clientes</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      {totalLeadsCount} Registros
                    </span>
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    Contactos captados automáticamente por el Asistente IA y formularios web con requerimientos en tiempo real
                  </p>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#050b18] border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Total Contactos</div>
                    <div className="text-lg font-bold font-display text-white">{totalLeadsCount}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050b18] border border-cyan-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase">Asistente IA</div>
                    <div className="text-lg font-bold font-display text-cyan-300">{chatIaLeadsCount}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050b18] border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <Inbox className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Formularios Web</div>
                    <div className="text-lg font-bold font-display text-blue-300">{webFormLeadsCount}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050b18] border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase">Cerrados / Ganados</div>
                    <div className="text-lg font-bold font-display text-emerald-300">{closedLeadsCount}</div>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 rounded-xl bg-[#050b18] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Buscar por cliente, empresa, teléfono, requerimientos..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                  {leadSearchQuery && (
                    <button
                      onClick={() => setLeadSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Source Filter */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-cyan-400" />
                    Origen:
                  </span>
                  <button
                    onClick={() => setLeadSourceFilter('todos')}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      leadSourceFilter === 'todos'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setLeadSourceFilter('chat_ia')}
                    className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                      leadSourceFilter === 'chat_ia'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bot className="w-3 h-3" />
                    Asesor IA
                  </button>
                  <button
                    onClick={() => setLeadSourceFilter('formulario_web')}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      leadSourceFilter === 'formulario_web'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Formulario
                  </button>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Estado:</span>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="propuesta_enviada">Propuesta enviada</option>
                    <option value="cerrado">Cerrado / Ganado</option>
                    <option value="descartado">Descartado</option>
                  </select>
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center bg-[#050b18] rounded-xl border border-slate-800 space-y-2">
                    <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="text-xs text-slate-400">No hay solicitudes con los filtros aplicados.</div>
                  </div>
                ) : (
                  filteredLeads.map((lead) => {
                    const isChat = lead.source === 'chat_ia';
                    const hasHistory = Array.isArray(lead.chat_history) && lead.chat_history.length > 0;
                    const isExpandedChat = expandedLeadChatId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        className={`p-4 sm:p-5 rounded-2xl bg-[#050b18] border transition-all space-y-4 ${
                          isChat
                            ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
                            : 'border-slate-800'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-base font-bold text-white font-display flex items-center gap-1.5">
                                <UserCheck className="w-4 h-4 text-cyan-400" />
                                {lead.name}
                              </span>
                              {lead.company && (
                                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                                  <Building className="w-3 h-3 text-cyan-400" />
                                  {lead.company}
                                </span>
                              )}

                              {/* Source Badge */}
                              {isChat ? (
                                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded-full border border-cyan-400/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                  <Bot className="w-3 h-3 text-cyan-300" />
                                  Captado por Asistente IA
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                  📋 Formulario Web
                                </span>
                              )}
                            </div>

                            {/* Contact Badges */}
                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-0.5 font-mono">
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors"
                              >
                                <Mail className="w-3 h-3 text-cyan-400" />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  {lead.phone}
                                </a>
                              )}
                              <span className="text-[11px] text-slate-500">
                                Creado: {new Date(lead.created_at).toLocaleDateString()} {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {lead.updated_at && lead.updated_at !== lead.created_at && (
                                <span className="text-[11px] text-cyan-500">
                                  • Actualizado: {new Date(lead.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold focus:outline-none ${
                                lead.status === 'nuevo'
                                  ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                                  : lead.status === 'contactado'
                                  ? 'bg-amber-950 border-amber-500/50 text-amber-300'
                                  : lead.status === 'propuesta_enviada'
                                  ? 'bg-blue-950 border-blue-500/50 text-blue-300'
                                  : lead.status === 'cerrado'
                                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              <option value="nuevo">Nuevo Lead</option>
                              <option value="contactado">Contactado</option>
                              <option value="propuesta_enviada">Propuesta enviada</option>
                              <option value="cerrado">Cerrado (Ganado)</option>
                              <option value="descartado">Descartado</option>
                            </select>

                            {/* Convert to official client */}
                            {lead.status !== 'cerrado' && (
                              <button
                                onClick={() => handleConvertToClient(lead)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Convertir a Cliente oficial de la factorIA"
                              >
                                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden sm:inline">Convertir a Cliente</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 transition-colors"
                              title="Eliminar lead del CRM"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* DETECTED REQUIREMENTS / IA DISCOVERY CALLOUT */}
                        {lead.requirements_summary && (
                          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/60 border border-cyan-500/40 text-xs text-slate-200 flex items-start gap-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4 text-cyan-300" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                                Requerimientos Detectados por la IA:
                              </div>
                              <p className="text-xs text-white leading-relaxed font-medium">
                                {lead.requirements_summary}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Lead Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                            <div className="text-[10px] font-mono text-slate-400 uppercase">Servicio de Interés</div>
                            <div className="font-bold text-white mt-0.5">{lead.service || 'Desarrollo Web'}</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                            <div className="text-[10px] font-mono text-slate-400 uppercase">Presupuesto / Rango</div>
                            <div className="font-bold text-cyan-300 mt-0.5">{lead.budget_range || 'A convenir'}</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                            <div className="text-[10px] font-mono text-slate-400 uppercase">Proyecto de Referencia</div>
                            <div className="font-bold text-slate-200 mt-0.5 truncate">
                              {lead.project_title || 'General'}
                            </div>
                          </div>
                        </div>

                        {/* Primary Message Content */}
                        {lead.message && (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Mensaje Inicial:</div>
                            {lead.message}
                          </div>
                        )}

                        {/* LIVE CHAT HISTORY TRANSCRIPT ACCORDION */}
                        {hasHistory && (
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setExpandedLeadChatId(isExpandedChat ? null : lead.id)
                              }
                              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-cyan-400" />
                                <span>
                                  {isExpandedChat
                                    ? 'Ocultar transcripción de la conversación'
                                    : `Ver transcripción completa con el Asistente IA (${lead.chat_history!.length} mensajes)`}
                                </span>
                              </div>
                              {isExpandedChat ? (
                                <ChevronUp className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-cyan-400" />
                              )}
                            </button>

                            {/* Expandable Chat Drawer */}
                            {isExpandedChat && (
                              <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 max-h-96 overflow-y-auto">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                                  Registro cronológico de conversación:
                                </div>
                                {lead.chat_history!.map((chatItem, idx) => {
                                  const isUserMsg = chatItem.role === 'user';
                                  const isSystemMsg = chatItem.role === 'system';

                                  if (isSystemMsg) {
                                    return (
                                      <div
                                        key={idx}
                                        className="text-center text-[10px] font-mono text-slate-400 py-1 bg-slate-900/50 rounded-lg border border-slate-800"
                                      >
                                        ℹ️ {chatItem.text}
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={idx}
                                      className={`flex flex-col ${isUserMsg ? 'items-end' : 'items-start'}`}
                                    >
                                      <div
                                        className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                                          isUserMsg
                                            ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                                            : 'bg-[#081226] text-slate-200 border border-slate-800 rounded-tl-none'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono opacity-70 mb-1 font-bold">
                                          {isUserMsg ? `👤 ${lead.name}` : '🤖 Asesor La factorIA'}
                                        </div>
                                        <div className="whitespace-pre-wrap">{chatItem.text}</div>
                                      </div>
                                      {chatItem.timestamp && (
                                        <span className="text-[9px] font-mono text-slate-500 mt-0.5 px-1">
                                          {new Date(chatItem.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* INTERNAL SALES NOTES */}
                        <div className="pt-1 border-t border-slate-800/80">
                          {editingLeadNotesId === lead.id ? (
                            <div className="space-y-2">
                              <label className="text-[11px] font-mono text-slate-300 font-semibold">
                                Notas internas de seguimiento comercial:
                              </label>
                              <textarea
                                rows={2}
                                value={leadNotesText}
                                onChange={(e) => setLeadNotesText(e.target.value)}
                                placeholder="Escribir notas de seguimiento (ej. Se le envió presupuesto por $X, interesado en empezar en abril)..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingLeadNotesId(null)}
                                  className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleSaveLeadNotes(lead.id)}
                                  className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400"
                                >
                                  Guardar Notas
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="text-slate-400 font-mono flex items-center gap-2">
                                <span className="text-slate-500">Notas internas:</span>
                                <span className="text-slate-200">
                                  {lead.notes || <span className="italic text-slate-500">Sin notas de seguimiento</span>}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingLeadNotesId(lead.id);
                                  setLeadNotesText(lead.notes || '');
                                }}
                                className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
                              >
                                {lead.notes ? 'Editar nota' : '+ Agregar nota'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick Contact Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                          <div className="text-[11px] font-mono text-slate-400">
                            Canales de contacto directo:
                          </div>

                          <div className="flex items-center gap-2">
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}?subject=${encodeURIComponent(
                                  `La factorIA — Asesoría para tu proyecto ${lead.service || 'Web'}`
                                )}&body=${encodeURIComponent(
                                  `Hola ${lead.name}!\n\nTe escribimos de La factorIA en relación a tu consulta sobre ${lead.requirements_summary || lead.service || 'desarrollo de página web'}.\n\n`
                                )}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Enviar Email</span>
                              </a>
                            )}

                            {lead.phone && (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hola ${lead.name}! Te escribo desde La factorIA en respuesta a tu consulta sobre tu proyecto ${lead.requirements_summary ? `(${lead.requirements_summary})` : lead.service}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Chatear por WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: DATABASE / SUPABASE & SQL EXPORTER */}
          {activeTab === 'database' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Configuración Supabase & Base de Datos</h2>
                <p className="text-xs font-mono text-slate-400">
                  Conexión directa con PostgreSQL / Supabase y exportador de scripts SQL
                </p>
              </div>

              {/* Supabase Connection Card */}
              <div className="p-6 rounded-2xl bg-[#050b18] border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Conexión con Supabase
                  </h3>
                  {db.getSupabaseConfig().isConnected ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Conectado a PostgreSQL
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                      Modo Almacenamiento Local Activo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Supabase Project URL</label>
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Supabase Anon Key (Public Key)</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSaveSupabaseConfig}
                      disabled={isTestingSupabase}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isTestingSupabase ? 'Verificando...' : 'Guardar y Probar Conexión'}</span>
                    </button>

                    <button
                      onClick={handleRunDiagnosis}
                      disabled={isTestingSupabase}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Comprobar Lectura y Conexión</span>
                    </button>

                    <button
                      onClick={handleTestWritePermissions}
                      disabled={isTestingSupabase}
                      className="px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50 font-bold"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test de Escritura / RLS</span>
                    </button>
                  </div>

                  <button
                    onClick={handlePurgeCache}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:border-cyan-500/50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Limpiar Caché Local & Forzar Recarga Supabase</span>
                  </button>
                </div>

                {/* DIAGNOSTIC RESULTS (READ) */}
                {supabaseHealth.tested && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>Diagnóstico de Lectura Supabase</span>
                        <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                          Latencia: {supabaseHealth.latencyMs}ms
                        </span>
                      </div>
                      {supabaseHealth.success ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Lectura 100% Operativa
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          Atención en algunas tablas
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {supabaseHealth.tables.map((t) => (
                        <div
                          key={t.name}
                          className={`p-2.5 rounded-lg border text-xs ${
                            t.ok
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950/30 border-red-500/40 text-red-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono uppercase text-slate-400">{t.name}</div>
                          <div className="font-bold flex items-center justify-between mt-1">
                            <span>{t.ok ? `${t.count} registros` : 'Error'}</span>
                            {t.ok ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          {t.error && <div className="text-[9px] text-red-400 mt-1 truncate">{t.error}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIAGNOSTIC RESULTS (WRITE & RLS) */}
                {writeHealth.tested && (
                  <div className={`mt-4 p-4 rounded-xl border space-y-3 ${
                    writeHealth.canWrite && !writeHealth.hasRlsIssue
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-amber-950/30 border-amber-500/50'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${writeHealth.canWrite ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span>Prueba de Escritura Directa (INSERT / UPDATE / DELETE en Supabase)</span>
                      </div>
                      {writeHealth.canWrite && !writeHealth.hasRlsIssue ? (
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Escritura Desbloqueada y Activa
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/50 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Bloqueo RLS Detectado en PostgreSQL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300">
                      {writeHealth.canWrite && !writeHealth.hasRlsIssue
                        ? 'Todas las tablas aceptan operaciones de guardado y edición desde este panel ERP.'
                        : 'PostgreSQL tiene activas políticas RLS restrictivas que impiden a la clave pública anon insertar o modificar filas. Para solucionarlo en 5 segundos, ejecutá el Script Rápido de Desbloqueo abajo.'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {writeHealth.tableDetails.map((t) => (
                        <div
                          key={t.table}
                          className={`p-2.5 rounded-lg border text-xs ${
                            t.writeOk
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950/40 border-red-500/40 text-red-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono uppercase text-slate-400">{t.table}</div>
                          <div className="font-bold flex items-center justify-between mt-1">
                            <span>{t.writeOk ? 'Escritura OK' : 'Bloqueado RLS'}</span>
                            {t.writeOk ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          {t.error && <div className="text-[9px] text-red-400 mt-1 truncate" title={t.error}>{t.error}</div>}
                        </div>
                      ))}
                    </div>

                    {writeHealth.hasRlsIssue && (
                      <div className="pt-2 flex items-center justify-end">
                        <button
                          onClick={handleCopyRlsSql}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedRlsSql ? '¡Script RLS Copiado!' : 'Copiar Script para Desbloquear RLS'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RLS QUICK FIX CARD */}
              <div className="p-6 rounded-2xl bg-[#071329] border border-amber-500/40 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold uppercase">
                        Solución Rápida RLS
                      </span>
                      <h3 className="text-base font-bold font-display text-white">
                        Script Rápido de Desbloqueo de Escritura (5 Líneas)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      Si al crear proyectos, modificar nombres o agregar clientes no se impactan los cambios en Supabase, copiá este comando y ejecutalo en tu <strong>Supabase Dashboard → SQL Editor → New Query → Run</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyRlsSql}
                    className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedRlsSql ? '¡Copiado al Portapapeles!' : 'Copiar Script Desbloqueo RLS'}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-950 border border-amber-500/30 p-3 max-h-48 overflow-y-auto font-mono text-xs text-amber-200 leading-relaxed whitespace-pre-wrap">
                  {SUPABASE_RLS_FIX_SQL}
                </div>
              </div>

              {/* SQL Script Viewer and Copier */}
              <div className="p-6 rounded-2xl bg-[#050b18] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      Script SQL Completo (PostgreSQL Schema & RLS)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Copiá este script y pegalo en el SQL Editor de tu proyecto Supabase para crear todas las tablas, índices y políticas de seguridad.
                    </p>
                  </div>

                  <button
                    onClick={handleCopySql}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL Completo'}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 max-h-72 overflow-y-auto">
                  <pre className="text-[11px] font-mono text-cyan-300 leading-relaxed whitespace-pre-wrap">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
