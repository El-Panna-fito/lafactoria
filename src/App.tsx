import React, { useState, useEffect } from 'react';
import { Project, Category, Client, Partnership } from './types';
import { db } from './services/db';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CatalogSection } from './components/CatalogSection';
import { ProjectPage } from './components/ProjectPage';
import { SolutionsSection } from './components/SolutionsSection';
import { ProcessSection } from './components/ProcessSection';
import { ClientsSection } from './components/ClientsSection';
import { SinergiasSection } from './components/SinergiasSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { AdminPanel } from './components/AdminPanel';
import { AIChatbot } from './components/AIChatbot';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'home' | 'project' | 'admin'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Quote Modal State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteInitialProjectId, setQuoteInitialProjectId] = useState<string | undefined>(undefined);
  const [quoteInitialProjectTitle, setQuoteInitialProjectTitle] = useState<string | undefined>(undefined);
  const [quoteInitialService, setQuoteInitialService] = useState<string | undefined>(undefined);

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Initial Data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [projList, catList, clientList, partList] = await Promise.all([
        db.getProjects(),
        db.getCategories(),
        db.getClients(),
        db.getPartnerships(),
      ]);
      setProjects(projList);
      setCategories(catList);
      setClients(clientList);
      setPartnerships(partList);

      // Check URL pathname and hash for direct routing (e.g. /admin, #/admin, #admin, #/proyectos/...)
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      if (
        pathname.toLowerCase() === '/admin' ||
        pathname.toLowerCase().endsWith('/admin') ||
        pathname.toLowerCase().includes('/admin') ||
        hash.toLowerCase().includes('admin')
      ) {
        setCurrentView('admin');
      } else if (hash.startsWith('#/proyectos/') || hash.startsWith('#proyectos/')) {
        const slug = hash.replace(/^#(|\/)proyectos\//, '');
        const found = projList.find((p) => p.slug === slug);
        if (found) {
          setSelectedProject(found);
          setCurrentView('project');
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const handleRouteChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      if (
        pathname.toLowerCase() === '/admin' ||
        pathname.toLowerCase().endsWith('/admin') ||
        pathname.toLowerCase().includes('/admin') ||
        hash.toLowerCase().includes('admin')
      ) {
        setCurrentView('admin');
      } else if (hash.startsWith('#/proyectos/') || hash.startsWith('#proyectos/')) {
        const slug = hash.replace(/^#(|\/)proyectos\//, '');
        db.getProjectBySlug(slug).then((proj) => {
          if (proj) {
            setSelectedProject(proj);
            setCurrentView('project');
          }
        });
      } else if (hash === '' || hash === '#/' || hash === '#inicio' || pathname === '/') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Handlers
  const handleOpenQuote = (serviceOrTitle?: string, project?: Project) => {
    if (project) {
      setQuoteInitialProjectId(project.id);
      setQuoteInitialProjectTitle(project.title);
      setQuoteInitialService(project.category_name || 'Desarrollo Web');
    } else if (serviceOrTitle) {
      setQuoteInitialProjectId(undefined);
      setQuoteInitialProjectTitle(undefined);
      setQuoteInitialService(serviceOrTitle);
    } else {
      setQuoteInitialProjectId(undefined);
      setQuoteInitialProjectTitle(undefined);
      setQuoteInitialService('Desarrollo Web Integral');
    }
    setIsQuoteOpen(true);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
    window.location.hash = `#/proyectos/${project.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedProject(null);
    if (window.location.pathname.toLowerCase().includes('/admin')) {
      window.history.pushState(null, '', '/');
    }
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    window.history.pushState(null, '', '/admin');
    window.location.hash = '#/admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreProjects = () => {
    const el = document.getElementById('proyectos');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Header is always visible unless inside Admin panel */}
      {currentView !== 'admin' && (
        <Header
          onOpenQuote={() => handleOpenQuote()}
          currentView={currentView}
          onNavigateHome={handleNavigateHome}
          onNavigateAdmin={handleNavigateAdmin}
        />
      )}

      {/* Main Views Routing */}
      {currentView === 'admin' ? (
        <AdminPanel onBackToSite={handleNavigateHome} />
      ) : currentView === 'project' && selectedProject ? (
        <ProjectPage
          project={selectedProject}
          allProjects={projects}
          onBack={handleNavigateHome}
          onSelectProject={handleSelectProject}
          onOpenQuote={(proj) => handleOpenQuote(undefined, proj)}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onOpenQuote={() => handleOpenQuote()}
            onExploreProjects={handleExploreProjects}
          />

          {/* Nosotros - La factorIA dentro del Ecosistema IEC */}
          <AboutSection onOpenQuote={() => handleOpenQuote()} />

          {/* Catalog & Demos Marketplace */}
          <CatalogSection
            projects={projects}
            categories={categories}
            onSelectProject={handleSelectProject}
            onOpenQuoteWithProject={(proj) => handleOpenQuote(undefined, proj)}
          />

          {/* Solutions & Services */}
          <SolutionsSection onOpenQuote={(service) => handleOpenQuote(service)} />

          {/* Process 01-06 */}
          <ProcessSection />

          {/* Clients & Real Testimonials (Only rendered when real clients exist in Supabase) */}
          {clients.some((c) => c.active) && <ClientsSection clients={clients} />}

          {/* International Sinergias (Panatec México) */}
          {partnerships.some((p) => p.active) && <SinergiasSection partnerships={partnerships} />}

          {/* Final Call To Action */}
          <FinalCTA onOpenQuote={() => handleOpenQuote()} />
        </main>
      )}

      {/* Footer is visible on public views */}
      {currentView !== 'admin' && (
        <Footer
          onNavigateHome={handleNavigateHome}
          onNavigateAdmin={handleNavigateAdmin}
          onOpenQuote={() => handleOpenQuote()}
        />
      )}

      {/* Lead Capture / Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialProjectId={quoteInitialProjectId}
        initialProjectTitle={quoteInitialProjectTitle}
        initialService={quoteInitialService}
      />

      {/* Gemini AI Chatbot */}
      {currentView !== 'admin' && (
        <AIChatbot
          projects={projects}
          onSelectProject={handleSelectProject}
          onOpenQuote={(proj) => handleOpenQuote(undefined, proj)}
        />
      )}
    </div>
  );
}
