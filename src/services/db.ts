import { Category, Client, Lead, LeadStatus, Partnership, Project, SupabaseConfig } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../utils/supabase/client';

export interface DbOperationResult<T> {
  success: boolean;
  data: T;
  synced: boolean;
  error?: string;
}

const STORAGE_KEYS = {
  PROJECTS: 'lafactoria_projects_v1',
  CATEGORIES: 'lafactoria_categories_v1',
  CLIENTS: 'lafactoria_clients_v1',
  PARTNERSHIPS: 'lafactoria_partnerships_v1',
  LEADS: 'lafactoria_leads_v1',
  SUPABASE_CONFIG: 'lafactoria_supabase_config_v1',
};

// High-fidelity seed categories
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Todos', slug: 'todos', sort_order: 0, active: true },
  { id: 'cat-2', name: 'Institucional', slug: 'institucional', icon: 'building', sort_order: 1, active: true },
  { id: 'cat-3', name: 'E-commerce', slug: 'ecommerce', icon: 'shopping-bag', sort_order: 2, active: true },
  { id: 'cat-4', name: 'Landing Page', slug: 'landing-page', icon: 'zap', sort_order: 3, active: true },
  { id: 'cat-5', name: 'Escolar / Educativo', slug: 'escolar', icon: 'graduation-cap', sort_order: 4, active: true },
  { id: 'cat-6', name: 'Salud & Profesional', slug: 'salud', icon: 'activity', sort_order: 5, active: true },
  { id: 'cat-7', name: 'SaaS & Plataformas', slug: 'saas', icon: 'layers', sort_order: 6, active: true },
];

// High-fidelity seed projects including CECP
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Centro Educativo CECP',
    slug: 'cecp',
    short_description: 'Plataforma institucional, gestión académica integral y portal de admisiones con notificaciones automáticas.',
    description: `Desarrollo completo para el Centro Educativo y de Capacitación Profesional (CECP). 
El proyecto contempló una arquitectura digital robusta orientada tanto a padres y alumnos como al equipo directivo. 
Incorpora catálogo interactivo de carreras y trayectos formativos, sistema de preinscripciones con validación de documentación digital, aula virtual integrada y canal directo de atención vía WhatsApp API.`,
    category_id: 'cat-5',
    category_name: 'Escolar / Educativo',
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://cecp.edu.ar',
    featured: true,
    status: 'published',
    sort_order: 1,
    tags: ['Next.js', 'Portal Académico', 'Inscripciones', 'WhatsApp API', 'Supabase'],
    client_name: 'Centro Educativo CECP',
    year: '2024',
    metrics: [
      { label: 'Aumento en matriculaciones', value: '+140%' },
      { label: 'Tiempo de carga', value: '0.6s' },
      { label: 'Trámites 100% digitalizados', value: '10k+' }
    ],
    images: [
      {
        id: 'img-1-1',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'CECP Portada y Portal de Admisiones',
        sort_order: 0,
        caption: 'Home principal con buscador de cursos y carreras activas.'
      },
      {
        id: 'img-1-2',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'CECP Aula Virtual y Materiales',
        sort_order: 1,
        caption: 'Módulo de estudiantes con acceso a notas y programas.'
      },
      {
        id: 'img-1-3',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'CECP Formulario de Admisión',
        sort_order: 2,
        caption: 'Flujo de inscripción digital paso a paso.'
      }
    ],
    features: [
      { id: 'f-1', project_id: 'proj-1', title: 'Diseño responsive y accesible', sort_order: 1 },
      { id: 'f-2', project_id: 'proj-1', title: 'Panel administrativo para docentes y secretaría', sort_order: 2 },
      { id: 'f-3', project_id: 'proj-1', title: 'Sistema de pre-inscripción online con carga de DNI', sort_order: 3 },
      { id: 'f-4', project_id: 'proj-1', title: 'Integración WhatsApp para admisiones inmediatas', sort_order: 4 },
      { id: 'f-5', project_id: 'proj-1', title: 'Generación automática de certificados con QR', sort_order: 5 }
    ],
    created_at: new Date('2024-02-15').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Stellar Boutique — Luxury E-commerce',
    slug: 'stellar-boutique',
    short_description: 'Tienda online de indumentaria premium con carrito flotante, Mercado Pago, cuotas sin interés y control de stock multi-sucursal.',
    description: `Plataforma de comercio electrónico diseñada con estética de alta gama y máxima optimización para la conversión móvil. 
Incluye filtros facetados por talle, color y temporada, sincronización automática de inventario, pasarelas de pago locales e internacionales, y cálculo dinámico de costos de envío por código postal.`,
    category_id: 'cat-3',
    category_name: 'E-commerce',
    cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://stellar-boutique.demo.lafactoria.dev',
    featured: true,
    status: 'published',
    sort_order: 2,
    tags: ['E-commerce', 'Mercado Pago', 'Tailwind CSS', 'Filtros Dinámicos', 'Stock en vivo'],
    client_name: 'Stellar Group',
    year: '2024',
    metrics: [
      { label: 'Conversión de checkout', value: '4.8%' },
      { label: 'Ventas mensuales', value: '+350%' },
      { label: 'Retención de clientes', value: '62%' }
    ],
    images: [
      {
        id: 'img-2-1',
        project_id: 'proj-2',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'Stellar Boutique Home',
        sort_order: 0,
        caption: 'Lookbook interactivo con compra rápida.'
      },
      {
        id: 'img-2-2',
        project_id: 'proj-2',
        image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'Stellar Boutique Catálogo',
        sort_order: 1,
        caption: 'Vista de producto con selector de talles e imágenes HD.'
      }
    ],
    features: [
      { id: 'f-2-1', project_id: 'proj-2', title: 'Checkout optimizado en 1 solo paso', sort_order: 1 },
      { id: 'f-2-2', project_id: 'proj-2', title: 'Integración Mercado Pago, Ualá y Stripe', sort_order: 2 },
      { id: 'f-2-3', project_id: 'proj-2', title: 'Panel de gestión de pedidos y logística', sort_order: 3 },
      { id: 'f-2-4', project_id: 'proj-2', title: 'Notificaciones automáticas por email y WhatsApp', sort_order: 4 }
    ],
    created_at: new Date('2024-03-10').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    title: 'LogisTech Pro — Supply Chain Dashboard',
    slug: 'logistech-pro',
    short_description: 'Plataforma SaaS de monitoreo de flotas, geolocalización de envíos y control de despacho en tiempo real.',
    description: `Solución corporativa para empresas de transporte y logística integral. Cuenta con panel de telemetría en tiempo real, asignación de rutas con algoritmos de optimización de combustible, control documental de choferes y exportación automatizada de reportes gerenciales.`,
    category_id: 'cat-7',
    category_name: 'SaaS & Plataformas',
    cover_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://logistech.demo.lafactoria.dev',
    featured: true,
    status: 'published',
    sort_order: 3,
    tags: ['SaaS', 'Mapas en Vivo', 'Dashboard', 'Data Analytics', 'API Rest'],
    client_name: 'LogisTech Global',
    year: '2024',
    metrics: [
      { label: 'Ahorro de combustible', value: '28%' },
      { label: 'Unidades monitoreadas', value: '450+' },
      { label: 'Disponibilidad SLA', value: '99.98%' }
    ],
    images: [
      {
        id: 'img-3-1',
        project_id: 'proj-3',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'LogisTech Dashboard',
        sort_order: 0,
        caption: 'Monitoreo satelital y mapa de calor de entregas.'
      },
      {
        id: 'img-3-2',
        project_id: 'proj-3',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'LogisTech Analytics',
        sort_order: 1,
        caption: 'Reportes de tiempos de entrega y KPIs operacionales.'
      }
    ],
    features: [
      { id: 'f-3-1', project_id: 'proj-3', title: 'Mapas interactivos con tracking satelital GPS', sort_order: 1 },
      { id: 'f-3-2', project_id: 'proj-3', title: 'Roles y permisos granulares por sucursal', sort_order: 2 },
      { id: 'f-3-3', project_id: 'proj-3', title: 'Alertas tempranas de demoras y desvíos', sort_order: 3 },
      { id: 'f-3-4', project_id: 'proj-3', title: 'Exportación a Excel, PDF y conexión ERP', sort_order: 4 }
    ],
    created_at: new Date('2024-04-05').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-4',
    title: 'MediPlus Connect — Portal de Salud y Telemedicina',
    slug: 'mediplus-connect',
    short_description: 'Plataforma para clínicas y centros médicos con agenda de turnos online, historia clínica digital y recordatorios SMS/WhatsApp.',
    description: `Rediseño e implementación del portal digital de atención médica para MediPlus. Permite a los pacientes agendar consultas presenciales o virtuales con médicos especialistas, acceder a recetas digitales y abonar copagos de obras sociales de forma 100% segura.`,
    category_id: 'cat-6',
    category_name: 'Salud & Profesional',
    cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://mediplus.demo.lafactoria.dev',
    featured: false,
    status: 'published',
    sort_order: 4,
    tags: ['Salud Digital', 'Turnero Online', 'Telemedicina', 'Seguridad HIPAA'],
    client_name: 'MediPlus Salud',
    year: '2024',
    metrics: [
      { label: 'Reducción de ausentismo', value: '-45%' },
      { label: 'Turnos agendados/mes', value: '18k+' },
      { label: 'Satisfacción usuarios', value: '4.9/5' }
    ],
    images: [
      {
        id: 'img-4-1',
        project_id: 'proj-4',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'MediPlus Agenda',
        sort_order: 0,
        caption: 'Selector de profesionales y especialidades médicas.'
      }
    ],
    features: [
      { id: 'f-4-1', project_id: 'proj-4', title: 'Turnero 24/7 sincronizado con Google Calendar', sort_order: 1 },
      { id: 'f-4-2', project_id: 'proj-4', title: 'Módulo de recetas digitales con firma electrónica', sort_order: 2 },
      { id: 'f-4-3', project_id: 'proj-4', title: 'Recordatorios automatizados 24h antes del turno', sort_order: 3 }
    ],
    created_at: new Date('2024-05-12').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-5',
    title: 'AgroDigital Hub — Gestión de Cultivos',
    slug: 'agrodigital-hub',
    short_description: 'Plataforma web para monitoreo agronómico, pronóstico agroclimático, cotizaciones de granos en vivo y gestión de lotes.',
    description: `Diseñada para productores agropecuarios y empresas de acopio. Centraliza información meteorológica satelital, precios de la Bolsa de Cereales en tiempo real, registro de labores agrícolas y cotizador de insumos.`,
    category_id: 'cat-2',
    category_name: 'Institucional',
    cover_image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://agrodigital.demo.lafactoria.dev',
    featured: true,
    status: 'published',
    sort_order: 5,
    tags: ['AgroTech', 'Pizarras en Vivo', 'Clima Satelital', 'Institucional'],
    client_name: 'AgroDigital SA',
    year: '2023',
    metrics: [
      { label: 'Hectáreas administradas', value: '120k' },
      { label: 'Tiempo de consulta', value: '<1s' }
    ],
    images: [
      {
        id: 'img-5-1',
        project_id: 'proj-5',
        image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'AgroDigital Portada',
        sort_order: 0,
        caption: 'Pizarra de cotizaciones de granos e informes climáticos.'
      }
    ],
    features: [
      { id: 'f-5-1', project_id: 'proj-5', title: 'Widgets de cotización dólar y granos en vivo', sort_order: 1 },
      { id: 'f-5-2', project_id: 'proj-5', title: 'Mapa satelital de humedad de suelo', sort_order: 2 },
      { id: 'f-5-3', project_id: 'proj-5', title: 'Formulario de contacto corporativo e inversores', sort_order: 3 }
    ],
    created_at: new Date('2023-11-20').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-6',
    title: 'Urban Loft — Arquitectura & Desarrollos',
    slug: 'urban-loft',
    short_description: 'Landing page inmersiva de alto impacto para emprendimiento inmobiliario de lujo con cotizador interactivo de unidades.',
    description: `Experiencia web visualmente deslumbrante con renders interactivos, recorrido virtual 360°, ficha técnica descargable de cada tipología de departamento y formulario de reserva directa con atención personalizada.`,
    category_id: 'cat-4',
    category_name: 'Landing Page',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    demo_url: 'https://urbanloft.demo.lafactoria.dev',
    featured: false,
    status: 'published',
    sort_order: 6,
    tags: ['Inmobiliaria', 'Landing Page', '360 Tour', 'Cotizador'],
    client_name: 'Urban Loft Developments',
    year: '2024',
    metrics: [
      { label: 'Unidades vendidas en preventa', value: '85%' },
      { label: 'Tiempo de permanencia', value: '3m 40s' }
    ],
    images: [
      {
        id: 'img-6-1',
        project_id: 'proj-6',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
        alt_text: 'Urban Loft Home',
        sort_order: 0,
        caption: 'Galería de tipologías de departamentos y amenities.'
      }
    ],
    features: [
      { id: 'f-6-1', project_id: 'proj-6', title: 'Galería interactiva en ultra alta resolución', sort_order: 1 },
      { id: 'f-6-2', project_id: 'proj-6', title: 'Descarga automática de brochures en PDF', sort_order: 2 },
      { id: 'f-6-3', project_id: 'proj-6', title: 'Integración CRM para seguimiento comercial', sort_order: 3 }
    ],
    created_at: new Date('2024-06-01').toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// High-fidelity clients that trust La factorIA
export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'CECP Educación',
    logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://cecp.edu.ar',
    testimonial: 'La factorIA transformó por completo nuestra presencia institucional. El proceso de admisiones pasó a ser 100% digital y sumamos un 140% más de alumnos en nuestro último ciclo.',
    author: 'Prof. Carlos Rossi',
    role: 'Director General',
    sector: 'Educación & Formación',
    sort_order: 1,
    active: true
  },
  {
    id: 'cli-2',
    name: 'Grupo Panamericano',
    logo_url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://panamericano.com',
    testimonial: 'Un equipo técnico que habla en lenguaje de negocios. Entregaron la plataforma antes del plazo y con un nivel de acabado y performance impecable.',
    author: 'Mariana Benítez',
    role: 'Gerente de Transformación Digital',
    sector: 'Finanzas & Inversiones',
    sort_order: 2,
    active: true
  },
  {
    id: 'cli-3',
    name: 'Bodegas del Sur',
    logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://bodegasdelsur.com',
    testimonial: 'Nuestra tienda online duplicó el ticket promedio y recibimos pedidos tanto del mercado local como del exterior sin fricciones.',
    author: 'Santiago Mendizábal',
    role: 'Director Comercial',
    sector: 'Vitivinícola & Retail',
    sort_order: 3,
    active: true
  },
  {
    id: 'cli-4',
    name: 'Nexo Seguros',
    logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://nexoseguros.com',
    testimonial: 'El cotizador web en tiempo real redujo las consultas telefónicas y multiplicó los leads calificados de nuestros productores.',
    author: 'Florencia Varela',
    role: 'Líder de Marketing',
    sector: 'Aseguradoras',
    sort_order: 4,
    active: true
  },
  {
    id: 'cli-5',
    name: 'VitalMed Salud',
    logo_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://vitalmed.com',
    testimonial: 'El sistema de turnos es intuitivo para personas de todas las edades. Muy agradecidos por la dedicación y el soporte post-lanzamiento.',
    author: 'Dr. Martín Garay',
    role: 'Director Médico',
    sector: 'Salud Integral',
    sort_order: 5,
    active: true
  },
  {
    id: 'cli-6',
    name: 'Nova Arquitectura',
    logo_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop',
    website_url: 'https://novastudio.com',
    testimonial: 'La estética oscura, el ritmo tipográfico y la fluidez de nuestro sitio portfolio representan exactamente la sofisticación de nuestras obras.',
    author: 'Arq. Luciana Díaz',
    role: 'Socia Fundadora',
    sector: 'Arquitectura & Urbanismo',
    sort_order: 6,
    active: true
  }
];

// Strategic Sinergias (Alliances)
export const INITIAL_PARTNERSHIPS: Partnership[] = [
  {
    id: 'part-1',
    name: 'Panatec',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
    country: 'México',
    city: 'Ciudad de México / Guadalajara',
    description: 'Alianza estratégica para impulsar el crecimiento de La factorIA y desarrollar nuevas oportunidades en el mercado mexicano, integrando soluciones de software a medida, e-commerce corporativo y plataformas cloud de alta disponibilidad.',
    partnership_type: 'Expansión Internacional & Hub Tecnológico',
    website_url: 'https://panatec.mx',
    featured: true,
    sort_order: 1,
    active: true,
    highlight: 'Puente tecnológico Argentina ↔ México'
  }
];

// Initial sample leads
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Esteban Morales',
    company: 'Distribuidora del Litoral',
    email: 'esteban@litoraldistribuidora.com.ar',
    phone: '+54 9 343 456-7890',
    message: 'Hola equipo de La factorIA, nos interesa desarrollar un e-commerce B2B con lista de precios diferenciada por tipo de cliente y sincronización con nuestro sistema Tango.',
    project_id: 'proj-2',
    project_title: 'Stellar Boutique',
    service: 'E-commerce a Medida',
    budget_range: '$2.000 - $4.000 USD',
    status: 'propuesta_enviada',
    notes: 'Reunión inicial realizada. Interesados en pasarela Mercado Pago y catálogo privado.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Valeria Cassini',
    company: 'Instituto Cassini & Asociados',
    email: 'valeria@institutocassini.edu.ar',
    phone: '+54 9 11 5892-1144',
    message: 'Vimos el caso de éxito de CECP y nos gustaría cotizar un portal similar para nuestro instituto terciario, con inscripciones online y panel docente.',
    project_id: 'proj-1',
    project_title: 'Centro Educativo CECP',
    service: 'Sitio Institucional & Portal',
    budget_range: '$1.500 - $3.000 USD',
    status: 'nuevo',
    notes: 'Prioridad alta. Quieren lanzar antes del inicio del segundo semestre.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  }
];

// Data access layer connected directly to Supabase as single source of truth
class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private supabaseConfig: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false,
  };

  constructor() {
    this.loadSupabaseConfig();
    this.purgeStaleMockData();
  }

  private purgeStaleMockData() {
    if (typeof window === 'undefined') return;
    try {
      // Clear old legacy demo seeds if present so they don't override Supabase
      const hasCleaned = localStorage.getItem('lafactoria_cleaned_mock_v2');
      if (!hasCleaned) {
        localStorage.removeItem(STORAGE_KEYS.CLIENTS);
        localStorage.removeItem(STORAGE_KEYS.LEADS);
        localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        localStorage.removeItem(STORAGE_KEYS.PARTNERSHIPS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.setItem('lafactoria_cleaned_mock_v2', 'true');
      }
    } catch {
      // ignore
    }
  }

  public clearLocalCache() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.CLIENTS);
      localStorage.removeItem(STORAGE_KEYS.LEADS);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.PARTNERSHIPS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    } catch {
      // ignore
    }
  }

  private loadSupabaseConfig() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (saved) {
        this.supabaseConfig = JSON.parse(saved);
      } else if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        this.supabaseConfig = {
          url: SUPABASE_URL,
          anonKey: SUPABASE_ANON_KEY,
          isConnected: true,
        };
      }

      if (this.supabaseConfig.url && this.supabaseConfig.anonKey) {
        this.supabase = createClient(this.supabaseConfig.url, this.supabaseConfig.anonKey);
      }
    } catch {
      // ignore
    }
  }

  public getSupabaseConfig(): SupabaseConfig {
    return { ...this.supabaseConfig };
  }

  public async setSupabaseConfig(url: string, anonKey: string): Promise<boolean> {
    try {
      if (!url || !anonKey) {
        this.supabase = null;
        this.supabaseConfig = { url: '', anonKey: '', isConnected: false };
        localStorage.removeItem(STORAGE_KEYS.SUPABASE_CONFIG);
        return true;
      }

      const client = createClient(url, anonKey);
      // test query
      const { error } = await client.from('categories').select('count', { count: 'exact', head: true });
      
      this.supabase = client;
      this.supabaseConfig = {
        url,
        anonKey,
        isConnected: !error,
      };
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(this.supabaseConfig));
      return !error;
    } catch {
      this.supabaseConfig.isConnected = false;
      return false;
    }
  }

  public async checkSupabaseHealth(): Promise<{
    success: boolean;
    latencyMs: number;
    tables: { name: string; ok: boolean; count: number; error?: string }[];
  }> {
    const startTime = Date.now();
    const targetTables = ['categories', 'projects', 'clients', 'partnerships', 'leads'];
    const results: { name: string; ok: boolean; count: number; error?: string }[] = [];

    if (!this.supabase) {
      if (this.supabaseConfig.url && this.supabaseConfig.anonKey) {
        this.supabase = createClient(this.supabaseConfig.url, this.supabaseConfig.anonKey);
      } else {
        return {
          success: false,
          latencyMs: 0,
          tables: targetTables.map((t) => ({ name: t, ok: false, count: 0, error: 'No configurado' })),
        };
      }
    }

    let allOk = true;
    for (const table of targetTables) {
      try {
        const { data, error, count } = await this.supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          allOk = false;
          results.push({ name: table, ok: false, count: 0, error: error.message });
        } else {
          const list = data as unknown[] | null;
          const rowCount = typeof count === 'number' ? count : (list ? list.length : 0);
          results.push({
            name: table,
            ok: true,
            count: rowCount,
          });
        }
      } catch (err: unknown) {
        allOk = false;
        results.push({
          name: table,
          ok: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    }

    const latencyMs = Date.now() - startTime;
    this.supabaseConfig.isConnected = allOk;
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(this.supabaseConfig));

    return {
      success: allOk,
      latencyMs,
      tables: results,
    };
  }

  // Comprehensive Write Permission (RLS) Diagnostic Probe
  public async checkSupabaseWritePermissions(): Promise<{
    canRead: boolean;
    canWrite: boolean;
    hasRlsIssue: boolean;
    tableDetails: { table: string; selectOk: boolean; writeOk: boolean; error?: string }[];
  }> {
    const client = this.getSupabaseClient();
    const tables = ['categories', 'projects', 'clients', 'partnerships', 'leads'];
    if (!client) {
      return {
        canRead: false,
        canWrite: false,
        hasRlsIssue: true,
        tableDetails: tables.map((t) => ({ table: t, selectOk: false, writeOk: false, error: 'Sin cliente Supabase configurado' })),
      };
    }

    let overallRead = true;
    let overallWrite = true;
    let rlsIssueFound = false;
    const details: { table: string; selectOk: boolean; writeOk: boolean; error?: string }[] = [];

    for (const table of tables) {
      let selectOk = false;
      let writeOk = false;
      let tableErr: string | undefined;

      // 1. SELECT Probe
      try {
        const { error } = await client.from(table).select('*').limit(1);
        if (error) {
          overallRead = false;
          tableErr = `Lectura: ${error.message}`;
        } else {
          selectOk = true;
        }
      } catch (err: unknown) {
        overallRead = false;
        tableErr = `Lectura: ${err instanceof Error ? err.message : 'Fallo'}`;
      }

      // 2. WRITE Probe (Insert / Delete test probe)
      try {
        const testId = `probe-${Date.now()}`;
        let insertPayload: Record<string, unknown> = { id: testId };
        if (table === 'categories') insertPayload = { id: testId, name: 'RLS Probe', slug: testId };
        else if (table === 'projects') insertPayload = { id: testId, title: 'RLS Probe', slug: testId, short_description: 'test', description: 'test', cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300' };
        else if (table === 'clients') insertPayload = { id: testId, name: 'RLS Probe', logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300' };
        else if (table === 'partnerships') insertPayload = { id: testId, name: 'RLS Probe', logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300', country: 'Test', description: 'test', partnership_type: 'test' };
        else if (table === 'leads') insertPayload = { id: testId, name: 'RLS Probe', email: 'probe@lafactoria.dev' };

        const { data: inData, error: inErr } = await client.from(table).insert(insertPayload).select();
        if (inErr) {
          overallWrite = false;
          rlsIssueFound = true;
          tableErr = (tableErr ? tableErr + ' | ' : '') + `Escritura bloqueada por RLS: ${inErr.message}`;
        } else if (!inData || inData.length === 0) {
          overallWrite = false;
          rlsIssueFound = true;
          tableErr = (tableErr ? tableErr + ' | ' : '') + `Escritura: 0 filas actualizadas (Políticas RLS en PostgreSQL no permiten INSERT para anon)`;
        } else {
          writeOk = true;
          // Clean up probe row
          await client.from(table).delete().eq('id', testId);
        }
      } catch (err: unknown) {
        overallWrite = false;
        rlsIssueFound = true;
        tableErr = (tableErr ? tableErr + ' | ' : '') + `Escritura: ${err instanceof Error ? err.message : 'Excepción'}`;
      }

      details.push({
        table,
        selectOk,
        writeOk,
        error: tableErr,
      });
    }

    return {
      canRead: overallRead,
      canWrite: overallWrite,
      hasRlsIssue: rlsIssueFound,
      tableDetails: details,
    };
  }

  // PROJECTS
  public async getProjects(): Promise<Project[]> {
    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('projects').select('*').order('sort_order', { ascending: true });
        if (!error && data !== null && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data));
          return data as Project[];
        }
      } catch {
        // fallback to cached storage
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : [];
  }

  public async getProjectBySlug(slug: string): Promise<Project | null> {
    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('projects').select('*').eq('slug', slug).maybeSingle();
        if (!error && data) return data as Project;
      } catch {
        // fallback
      }
    }
    const projects = await this.getProjects();
    return projects.find((p) => p.slug === slug) || null;
  }

  public async saveProject(project: Project): Promise<DbOperationResult<Project>> {
    const projects = await this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    const updated: Project = { ...project, updated_at: new Date().toISOString() };

    if (existingIndex >= 0) {
      projects[existingIndex] = updated;
    } else {
      projects.push(updated);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: updated, synced: false, error: 'Sin conexión a Supabase (Guardado en caché local)' };
    }

    // Clean category_id: if invalid or 'todos', set null to prevent foreign key violation
    const validCategoryId =
      project.category_id && project.category_id !== 'todos' && project.category_id !== 'cat-todos' && project.category_id.trim() !== ''
        ? project.category_id
        : null;

    const payload = {
      id: project.id,
      title: project.title,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      short_description: project.short_description || '',
      description: project.description || '',
      category_id: validCategoryId,
      category_name: project.category_name || null,
      cover_image: project.cover_image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
      demo_url: project.demo_url || null,
      featured: Boolean(project.featured),
      status: project.status || 'published',
      tags: Array.isArray(project.tags) ? project.tags : [],
      client_name: project.client_name || null,
      year: project.year || String(new Date().getFullYear()),
      sort_order: typeof project.sort_order === 'number' ? project.sort_order : 0,
      metrics: Array.isArray(project.metrics) ? project.metrics : [],
      images: Array.isArray(project.images) ? project.images : [],
      features: Array.isArray(project.features) ? project.features : [],
      created_at: project.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await client.from('projects').upsert(payload, { onConflict: 'id' }).select();
      if (error) {
        console.error('[Supabase Save Project Error]:', error.message);
        return { success: true, data: updated, synced: false, error: error.message };
      }
      if (!data || data.length === 0) {
        console.warn('[Supabase Save Project Warning]: Upsert 0 rows updated.');
        return { success: true, data: updated, synced: false, error: 'Supabase no aplicó cambios (Revisar permisos RLS en projects)' };
      }
      return { success: true, data: updated, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al guardar en Supabase';
      console.error('[Supabase Save Project Exception]:', msg);
      return { success: true, data: updated, synced: false, error: msg };
    }
  }

  public async deleteProject(id: string): Promise<DbOperationResult<string>> {
    const projects = await this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: id, synced: false, error: 'Sin conexión a Supabase' };
    }

    try {
      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) {
        console.error('[Supabase Delete Project Error]:', error.message);
        return { success: true, data: id, synced: false, error: error.message };
      }
      return { success: true, data: id, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar en Supabase';
      return { success: true, data: id, synced: false, error: msg };
    }
  }

  // CATEGORIES
  public async getCategories(): Promise<Category[]> {
    let cats: Category[] = [];

    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('categories').select('*').order('sort_order', { ascending: true });
        if (!error && data !== null && data.length > 0) {
          cats = data as Category[];
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
        }
      } catch {
        // fallback to cache
      }
    }

    if (cats.length === 0) {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (raw) {
        cats = JSON.parse(raw);
      }
    }

    // Ensure 'Todos' category exists if categories exist
    if (cats.length > 0 && !cats.some((c) => c.slug === 'todos')) {
      cats.unshift({
        id: 'cat-todos',
        name: 'Todos',
        slug: 'todos',
        sort_order: 0,
        active: true,
      });
    }

    const projects = await this.getProjects();

    return cats.map((cat) => {
      if (cat.slug === 'todos') {
        return { ...cat, count: projects.filter((p) => p.status === 'published').length };
      }
      return {
        ...cat,
        count: projects.filter((p) => p.status === 'published' && (p.category_id === cat.id || p.category_id === cat.slug)).length,
      };
    });
  }

  public async saveCategory(category: Category): Promise<DbOperationResult<Category>> {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const cats: Category[] = raw ? JSON.parse(raw) : [];
    const index = cats.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      cats[index] = category;
    } else {
      cats.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: category, synced: false, error: 'Sin conexión a Supabase' };
    }

    const payload = {
      id: category.id,
      name: category.name,
      slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: category.icon || 'layers',
      sort_order: typeof category.sort_order === 'number' ? category.sort_order : 0,
      active: category.active !== false,
      created_at: category.created_at || new Date().toISOString(),
    };

    try {
      const { data, error } = await client.from('categories').upsert(payload, { onConflict: 'id' }).select();
      if (error) {
        console.error('[Supabase Save Category Error]:', error.message);
        return { success: true, data: category, synced: false, error: error.message };
      }
      if (!data || data.length === 0) {
        return { success: true, data: category, synced: false, error: 'Supabase no aplicó cambios (Revisar permisos RLS en categories)' };
      }
      return { success: true, data: category, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar categoría en Supabase';
      return { success: true, data: category, synced: false, error: msg };
    }
  }

  public async deleteCategory(id: string): Promise<DbOperationResult<string>> {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const cats: Category[] = raw ? JSON.parse(raw) : [];
    const filtered = cats.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: id, synced: false, error: 'Sin conexión a Supabase' };
    }

    try {
      const { error } = await client.from('categories').delete().eq('id', id);
      if (error) {
        return { success: true, data: id, synced: false, error: error.message };
      }
      return { success: true, data: id, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar categoría';
      return { success: true, data: id, synced: false, error: msg };
    }
  }

  // CLIENTS
  public async getClients(): Promise<Client[]> {
    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('clients').select('*').order('sort_order', { ascending: true });
        if (!error && data !== null && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(data));
          return data as Client[];
        }
      } catch {
        // fallback
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public async saveClient(clientData: Client): Promise<DbOperationResult<Client>> {
    const list = await this.getClients();
    const index = list.findIndex((c) => c.id === clientData.id);
    if (index >= 0) {
      list[index] = clientData;
    } else {
      list.push(clientData);
    }
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(list));

    const supabaseClient = this.getSupabaseClient();
    if (!supabaseClient) {
      return { success: true, data: clientData, synced: false, error: 'Sin conexión a Supabase' };
    }

    const payload = {
      id: clientData.id,
      name: clientData.name,
      logo_url: clientData.logo_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      website_url: clientData.website_url || null,
      testimonial: clientData.testimonial || null,
      author: clientData.author || null,
      role: clientData.role || null,
      sector: clientData.sector || null,
      sort_order: typeof clientData.sort_order === 'number' ? clientData.sort_order : 0,
      active: clientData.active !== false,
      created_at: clientData.created_at || new Date().toISOString(),
    };

    try {
      const { data, error } = await supabaseClient.from('clients').upsert(payload, { onConflict: 'id' }).select();
      if (error) {
        console.error('[Supabase Save Client Error]:', error.message);
        return { success: true, data: clientData, synced: false, error: error.message };
      }
      if (!data || data.length === 0) {
        return { success: true, data: clientData, synced: false, error: 'Supabase no aplicó cambios (Revisar permisos RLS en clients)' };
      }
      return { success: true, data: clientData, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar cliente en Supabase';
      return { success: true, data: clientData, synced: false, error: msg };
    }
  }

  public async deleteClient(id: string): Promise<DbOperationResult<string>> {
    const list = await this.getClients();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));

    const supabaseClient = this.getSupabaseClient();
    if (!supabaseClient) {
      return { success: true, data: id, synced: false, error: 'Sin conexión a Supabase' };
    }

    try {
      const { error } = await supabaseClient.from('clients').delete().eq('id', id);
      if (error) {
        return { success: true, data: id, synced: false, error: error.message };
      }
      return { success: true, data: id, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar cliente';
      return { success: true, data: id, synced: false, error: msg };
    }
  }

  // PARTNERSHIPS
  public async getPartnerships(): Promise<Partnership[]> {
    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('partnerships').select('*').order('sort_order', { ascending: true });
        if (!error && data !== null && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(data));
          return data as Partnership[];
        }
      } catch {
        // fallback
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PARTNERSHIPS);
    return raw ? JSON.parse(raw) : [];
  }

  public async savePartnership(item: Partnership): Promise<DbOperationResult<Partnership>> {
    const list = await this.getPartnerships();
    const index = list.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: item, synced: false, error: 'Sin conexión a Supabase' };
    }

    const payload = {
      id: item.id,
      name: item.name,
      logo_url: item.logo_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
      country: item.country || 'Argentina',
      city: item.city || null,
      description: item.description || '',
      partnership_type: item.partnership_type || 'Alianza Estratégica',
      website_url: item.website_url || null,
      featured: item.featured !== false,
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : 0,
      active: item.active !== false,
      highlight: item.highlight || null,
      created_at: item.created_at || new Date().toISOString(),
    };

    try {
      const { data, error } = await client.from('partnerships').upsert(payload, { onConflict: 'id' }).select();
      if (error) {
        console.error('[Supabase Save Partnership Error]:', error.message);
        return { success: true, data: item, synced: false, error: error.message };
      }
      if (!data || data.length === 0) {
        return { success: true, data: item, synced: false, error: 'Supabase no aplicó cambios (Revisar permisos RLS en partnerships)' };
      }
      return { success: true, data: item, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar sinergia';
      return { success: true, data: item, synced: false, error: msg };
    }
  }

  public async deletePartnership(id: string): Promise<DbOperationResult<string>> {
    const list = await this.getPartnerships();
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(filtered));

    const client = this.getSupabaseClient();
    if (!client) {
      return { success: true, data: id, synced: false, error: 'Sin conexión a Supabase' };
    }

    try {
      const { error } = await client.from('partnerships').delete().eq('id', id);
      if (error) {
        return { success: true, data: id, synced: false, error: error.message };
      }
      return { success: true, data: id, synced: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar sinergia';
      return { success: true, data: id, synced: false, error: msg };
    }
  }

  // HELPER: Robust Supabase Client Retrieval
  private getSupabaseClient(): SupabaseClient | null {
    if (this.supabase) return this.supabase;
    const url = this.supabaseConfig.url || SUPABASE_URL;
    const anonKey = this.supabaseConfig.anonKey || SUPABASE_ANON_KEY;
    if (url && anonKey) {
      this.supabase = createClient(url, anonKey);
      return this.supabase;
    }
    return null;
  }

  // HELPER: Upsert Lead to Supabase with schema resilience
  private async upsertLeadToSupabase(lead: Lead): Promise<boolean> {
    const client = this.getSupabaseClient();
    if (!client) {
      console.warn('[Supabase Lead Sync] Cliente Supabase no disponible.');
      return false;
    }

    // Sanitize nullable fields to prevent Postgres foreign key and type constraint errors
    const validProjectId = lead.project_id && lead.project_id.trim() !== '' && lead.project_id !== 'undefined' ? lead.project_id : null;

    const fullPayload = {
      id: lead.id,
      name: lead.name,
      company: lead.company || null,
      email: lead.email,
      phone: lead.phone || null,
      message: lead.message || 'Consulta desde Asistente IA',
      project_id: validProjectId,
      project_title: lead.project_title || null,
      service: lead.service || 'Desarrollo Web',
      budget_range: lead.budget_range || 'A convenir',
      status: lead.status || 'nuevo',
      notes: lead.notes || null,
      source: lead.source || 'chat_ia',
      requirements_summary: lead.requirements_summary || null,
      chat_history: lead.chat_history || [],
      created_at: lead.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await client.from('leads').upsert(fullPayload, { onConflict: 'id' });
      if (!error) {
        console.log('[Supabase Lead Sync] Lead registrado correctamente en Supabase:', lead.id, lead.name);
        return true;
      }

      console.warn('[Supabase Lead Sync] Advertencia en payload completo, reintentando con campos base:', error.message);

      // Resilient fallback: If some custom columns (e.g. chat_history) are not yet in the DB table,
      // bundle the chat transcript into message/notes so data is 100% saved
      const transcriptText = lead.chat_history && lead.chat_history.length > 0
        ? '\n\n[Transcripción Chat IA]:\n' + lead.chat_history.map((m) => `${m.role === 'user' ? 'Cliente' : 'IA'}: ${m.text}`).join('\n')
        : '';

      const combinedMessage = (lead.message || '') + (lead.requirements_summary ? `\n\n[Resumen]: ${lead.requirements_summary}` : '') + transcriptText;

      const corePayload = {
        id: lead.id,
        name: lead.name,
        company: lead.company || null,
        email: lead.email,
        phone: lead.phone || null,
        message: combinedMessage,
        project_id: validProjectId,
        project_title: lead.project_title || null,
        service: lead.service || 'Desarrollo Web',
        budget_range: lead.budget_range || 'A convenir',
        status: lead.status || 'nuevo',
        notes: lead.notes || (lead.requirements_summary ? `Requerimientos: ${lead.requirements_summary}` : null),
        created_at: lead.created_at || new Date().toISOString(),
      };

      const { error: fallbackError } = await client.from('leads').upsert(corePayload, { onConflict: 'id' });
      if (!fallbackError) {
        console.log('[Supabase Lead Sync] Lead guardado exitosamente con columnas base:', lead.id);
        return true;
      }

      console.error('[Supabase Lead Sync] Error definitivo al guardar lead:', fallbackError.message);
      return false;
    } catch (err) {
      console.error('[Supabase Lead Sync] Excepción al procesar lead:', err);
      return false;
    }
  }

  // LEADS
  public async getLeads(): Promise<Lead[]> {
    const client = this.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data !== null) {
          localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data));
          return data as Lead[];
        }
      } catch {
        // fallback
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    return raw ? JSON.parse(raw) : [];
  }

  public async addLead(leadData: Omit<Lead, 'id' | 'created_at' | 'status'> & { id?: string; status?: LeadStatus }): Promise<Lead> {
    const list = await this.getLeads();
    const newId = leadData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
    
    const newLead: Lead = {
      ...leadData,
      id: newId,
      status: leadData.status || 'nuevo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    list.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(list));

    await this.upsertLeadToSupabase(newLead);
    return newLead;
  }

  public async updateLead(id: string, partial: Partial<Lead>): Promise<Lead | null> {
    const list = await this.getLeads();
    const index = list.findIndex((l) => l.id === id);
    let targetLead: Lead;

    if (index >= 0) {
      targetLead = {
        ...list[index],
        ...partial,
        updated_at: new Date().toISOString(),
      };
      list[index] = targetLead;
    } else {
      // If not in local array, construct it so Supabase can upsert it
      targetLead = {
        id,
        name: partial.name || 'Contacto Chat',
        email: partial.email || 'contacto@lafactoria.dev',
        phone: partial.phone,
        company: partial.company,
        message: partial.message || 'Contacto desde Chatbot IA',
        service: partial.service || 'Descubrimiento Web',
        budget_range: partial.budget_range || 'A convenir',
        status: partial.status || 'nuevo',
        notes: partial.notes,
        source: partial.source || 'chat_ia',
        requirements_summary: partial.requirements_summary,
        chat_history: partial.chat_history || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...partial,
      };
      list.unshift(targetLead);
    }

    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(list));
    await this.upsertLeadToSupabase(targetLead);
    return targetLead;
  }

  public async syncChatLead(
    leadId: string | null,
    contactInfo: { name: string; contact: string; company?: string },
    chatItem?: { role: string; text: string },
    requirements?: { service?: string; project_title?: string; summary?: string },
    fullChatHistory?: { role: string; text: string; timestamp?: string }[]
  ): Promise<Lead> {
    const isEmail = contactInfo.contact.includes('@');
    const email = isEmail
      ? contactInfo.contact.trim()
      : `${contactInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'contacto'}@whatsapp.com`;
    const phone = !isEmail ? contactInfo.contact.trim() : undefined;

    const list = await this.getLeads();
    // Match by leadId first, or by email if leadId is null
    const existing = leadId
      ? list.find((l) => l.id === leadId)
      : list.find((l) => l.email.toLowerCase() === email.toLowerCase());

    const targetId = existing?.id || leadId;

    let chatHistory: { role: string; text: string; timestamp?: string }[] = [];

    if (fullChatHistory && fullChatHistory.length > 0) {
      chatHistory = [...fullChatHistory];
    } else if (existing?.chat_history && existing.chat_history.length > 0) {
      chatHistory = [...existing.chat_history];
      if (chatItem) {
        chatHistory.push({
          role: chatItem.role,
          text: chatItem.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } else if (chatItem) {
      chatHistory = [
        {
          role: chatItem.role,
          text: chatItem.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    }

    // Build latest conversation summary or last user message as primary message
    const lastUserMessage = [...chatHistory].reverse().find((m) => m.role === 'user')?.text;
    const leadMessage = lastUserMessage || existing?.message || 'Consulta vía Asesor IA en vivo';

    if (targetId) {
      const updated = await this.updateLead(targetId, {
        name: contactInfo.name || existing?.name,
        email: isEmail ? contactInfo.contact : (existing?.email || email),
        phone: phone || existing?.phone,
        company: contactInfo.company || existing?.company,
        message: leadMessage,
        service: requirements?.service || existing?.service || 'Descubrimiento Web con Asistente IA',
        project_title: requirements?.project_title || existing?.project_title,
        requirements_summary: requirements?.summary || existing?.requirements_summary,
        chat_history: chatHistory,
        source: 'chat_ia',
        notes: requirements?.summary
          ? `Interés del cliente: ${requirements.summary}`
          : (existing?.notes || 'Capturado vía Chatbot IA en vivo'),
      });

      if (updated) return updated;
    }

    // Create new lead if no existing found
    const newLead = await this.addLead({
      name: contactInfo.name,
      email: email,
      phone: phone || '',
      company: contactInfo.company || 'Contacto Web',
      message: leadMessage,
      service: requirements?.service || 'Descubrimiento Web con Asistente IA',
      project_title: requirements?.project_title || 'Por definir en chat',
      budget_range: 'A convenir',
      source: 'chat_ia',
      requirements_summary: requirements?.summary || 'En proceso de conversación...',
      chat_history: chatHistory,
      notes: 'Lead capturado desde el Asistente IA en vivo.',
    });

    return newLead;
  }

  public async updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<boolean> {
    const list = await this.getLeads();
    const item = list.find((l) => l.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(list));

      await this.upsertLeadToSupabase(item);
      return true;
    }
    return false;
  }

  public async deleteLead(id: string): Promise<boolean> {
    const list = await this.getLeads();
    const filtered = list.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));

    const client = this.getSupabaseClient();
    if (client) {
      try {
        await client.from('leads').delete().eq('id', id);
      } catch (err) {
        console.error('[Supabase] Error al eliminar lead:', err);
      }
    }
    return true;
  }

  // PURGE & SYNC
  public syncAndPurgeLocal(): void {
    this.clearLocalCache();
  }
}

export const db = new DatabaseService();
