-- ====================================================================
-- LA FACTORIA — SCHEMA COMPLETO DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Incluye: Proyectos, Categorías, Clientes, Sinergias, Leads/CRM y Chatbot IA
-- ====================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Función para actualización automática de timestamps (updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 3. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Proyectos de Portafolio
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    cover_image TEXT NOT NULL,
    demo_url TEXT,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    tags TEXT[] DEFAULT '{}',
    client_name VARCHAR(150),
    year VARCHAR(10),
    sort_order INT DEFAULT 0,
    metrics JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Clientes y Testimonios
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    testimonial TEXT,
    author VARCHAR(150),
    role VARCHAR(150),
    sector VARCHAR(100),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Sinergias y Alianzas Estratégicas
CREATE TABLE IF NOT EXISTS public.partnerships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(150) NOT NULL,
    logo_url TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    description TEXT NOT NULL,
    partnership_type VARCHAR(100) NOT NULL,
    website_url TEXT,
    featured BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    highlight VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Solicitudes Comerciales / Leads & CRM Asistente IA
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_title VARCHAR(255),
    service VARCHAR(100) DEFAULT 'Desarrollo Web',
    budget_range VARCHAR(100) DEFAULT 'A convenir',
    status VARCHAR(50) DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'propuesta_enviada', 'cerrado', 'descartado')),
    notes TEXT,
    source VARCHAR(50) DEFAULT 'formulario_web',
    requirements_summary TEXT,
    chat_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- MIGRACIONES SEGURAS PARA TABLAS PREVIAS (ADD COLUMN IF NOT EXISTS)
-- ====================================================================
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'formulario_web';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS requirements_summary TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS chat_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category_name VARCHAR(100);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- ====================================================================
-- TRIGGERS DE ACTUALIZACIÓN AUTOMÁTICA
-- ====================================================================
DROP TRIGGER IF EXISTS trigger_update_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- ÍNDICES DE RENDIMIENTO
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

CREATE INDEX IF NOT EXISTS idx_clients_active ON public.clients(active);
CREATE INDEX IF NOT EXISTS idx_partnerships_active ON public.partnerships(active);

-- ====================================================================
-- PERMISOS Y DESBLOQUEO RLS PARA ADMINISTRACIÓN DIRECTA (ERP Y WEB)
-- Deshabilita RLS para permitir lectura, inserción, edición y eliminación
-- sin bloqueos de sesión anónima en el ERP administrativo.
-- ====================================================================
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Limpieza de políticas restrictivas previas
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Read Partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Public Insert Leads" ON public.leads;
DROP POLICY IF EXISTS "Public Update Leads" ON public.leads;
DROP POLICY IF EXISTS "Public Read Leads" ON public.leads;
DROP POLICY IF EXISTS "Admin Full Access Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Full Access Clients" ON public.clients;
DROP POLICY IF EXISTS "Admin Full Access Partnerships" ON public.partnerships;
DROP POLICY IF EXISTS "Admin Full Access Leads" ON public.leads;

-- Políticas de Acceso Completo (por si RLS se mantiene habilitado manualmente)
DROP POLICY IF EXISTS "Full Access Categories" ON public.categories;
CREATE POLICY "Full Access Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full Access Projects" ON public.projects;
CREATE POLICY "Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full Access Clients" ON public.clients;
CREATE POLICY "Full Access Clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full Access Partnerships" ON public.partnerships;
CREATE POLICY "Full Access Partnerships" ON public.partnerships FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full Access Leads" ON public.leads;
CREATE POLICY "Full Access Leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- SEED DATA INICIAL (DATOS OFICIALES DE LA FACTORIA)
-- ====================================================================

-- Categorías
INSERT INTO public.categories (id, name, slug, icon, sort_order, active) VALUES
    ('cat-1', 'Todos', 'todos', 'layers', 0, true),
    ('cat-2', 'Institucional', 'institucional', 'building', 1, true),
    ('cat-3', 'E-commerce', 'ecommerce', 'shopping-bag', 2, true),
    ('cat-4', 'Landing Page', 'landing-page', 'zap', 3, true),
    ('cat-5', 'Escolar / Educativo', 'escolar', 'graduation-cap', 4, true),
    ('cat-6', 'Salud & Profesional', 'salud', 'activity', 5, true),
    ('cat-7', 'SaaS & Plataformas', 'saas', 'layers', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Proyectos Destacados
INSERT INTO public.projects (
    id, title, slug, short_description, description, category_id, category_name,
    cover_image, demo_url, featured, status, sort_order, tags, client_name, year, metrics
) VALUES
(
    'proj-1',
    'Centro Educativo CECP',
    'cecp',
    'Plataforma institucional, gestión académica integral y portal de admisiones con notificaciones automáticas.',
    'Desarrollo completo para el Centro Educativo y de Capacitación Profesional (CECP). Incorpora catálogo interactivo de carreras, sistema de preinscripciones con validación digital y canal directo WhatsApp API.',
    'cat-5',
    'Escolar / Educativo',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    'https://cecp.edu.ar',
    true,
    'published',
    1,
    ARRAY['Next.js', 'Portal Académico', 'Inscripciones', 'WhatsApp API', 'Supabase'],
    'Centro Educativo CECP',
    '2024',
    '[{"label": "Aumento en matriculaciones", "value": "+140%"}, {"label": "Tiempo de carga", "value": "0.6s"}, {"label": "Trámites 100% digitalizados", "value": "10k+"}]'::jsonb
),
(
    'proj-2',
    'Stellar Boutique — Luxury E-commerce',
    'stellar-boutique',
    'Tienda online de indumentaria premium con carrito flotante, Mercado Pago, cuotas sin interés y control de stock multi-sucursal.',
    'Plataforma de comercio electrónico diseñada con estética de alta gama y máxima optimización para la conversión móvil.',
    'cat-3',
    'E-commerce',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    'https://stellar-boutique.demo.lafactoria.dev',
    true,
    'published',
    2,
    ARRAY['E-commerce', 'Mercado Pago', 'Tailwind CSS', 'Filtros Dinámicos', 'Stock en vivo'],
    'Stellar Group',
    '2024',
    '[{"label": "Conversión de checkout", "value": "4.8%"}, {"label": "Ventas mensuales", "value": "+350%"}, {"label": "Retención de clientes", "value": "62%"}]'::jsonb
),
(
    'proj-3',
    'LogisTech Pro — Supply Chain Dashboard',
    'logistech-pro',
    'Plataforma SaaS de monitoreo de flotas, geolocalización de envíos y control de despacho en tiempo real.',
    'Solución corporativa para empresas de transporte y logística integral. Telemetría satelital en vivo y optimización de rutas.',
    'cat-7',
    'SaaS & Plataformas',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    'https://logistech.demo.lafactoria.dev',
    true,
    'published',
    3,
    ARRAY['SaaS', 'Mapas en Vivo', 'Dashboard', 'Data Analytics', 'API Rest'],
    'LogisTech Global',
    '2024',
    '[{"label": "Ahorro de combustible", "value": "28%"}, {"label": "Unidades monitoreadas", "value": "450+"}, {"label": "Disponibilidad SLA", "value": "99.98%"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Sinergias y Alianzas
INSERT INTO public.partnerships (
    id, name, logo_url, country, city, description, partnership_type, website_url, featured, sort_order, active, highlight
) VALUES
(
    'part-1',
    'Panatec',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
    'México',
    'Ciudad de México / Guadalajara',
    'Alianza estratégica para impulsar el crecimiento de La factorIA y desarrollar nuevas oportunidades en el mercado mexicano, integrando soluciones de software a medida, e-commerce corporativo y plataformas cloud de alta disponibilidad.',
    'Expansión Internacional & Hub Tecnológico',
    'https://panatec.mx',
    true,
    1,
    true,
    'Puente tecnológico Argentina ↔ México'
)
ON CONFLICT (id) DO NOTHING;
