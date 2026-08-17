import React, { useState, useMemo } from 'react';
import { Project, Category } from '../types';
import { Search, ExternalLink, ArrowRight, Sparkles, Filter, Eye, Layers } from 'lucide-react';

interface CatalogSectionProps {
  projects: Project[];
  categories: Category[];
  onSelectProject: (project: Project) => void;
  onOpenQuoteWithProject?: (project: Project) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  projects,
  categories,
  onSelectProject,
  onOpenQuoteWithProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('todos');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (project.status !== 'published') return false;

      // Category matching
      if (selectedCategoryId !== 'todos') {
        const cat = categories.find((c) => c.id === selectedCategoryId || c.slug === selectedCategoryId);
        if (cat && project.category_id !== cat.id && project.category_id !== cat.slug) {
          return false;
        }
      }

      // Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = project.short_description.toLowerCase().includes(query);
        const tagMatch = project.tags.some((t) => t.toLowerCase().includes(query));
        const catMatch = (project.category_name || '').toLowerCase().includes(query);
        const clientMatch = (project.client_name || '').toLowerCase().includes(query);

        return titleMatch || descMatch || tagMatch || catMatch || clientMatch;
      }

      return true;
    });
  }, [projects, categories, selectedCategoryId, searchQuery]);

  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Marketplace de Demos & Proyectos Reales</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
            CATÁLOGO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">SOLUCIONES</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Explorá proyectos reales desarrollados para empresas, instituciones y startups. Probá las demos interactivas en vivo.
          </p>
        </div>

        {/* Counter Metric */}
        <div className="flex items-center gap-4 bg-[#050b18] border border-cyan-500/30 px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] shrink-0 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-black font-mono text-cyan-400 leading-none">
              {filteredProjects.length}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Proyectos filtrados
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white font-mono">100% Online</span>
            <span className="text-[10px] text-cyan-500/80 font-mono">Demos activas</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-6 mb-10">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar proyectos, rubros o soluciones (ej. CECP, E-commerce, Educación, Salud)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#081226]/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Categories: Desktop Scrollable Tabs + Mobile Filter Trigger */}
        <div className="flex items-center justify-between gap-4">
          {/* Desktop Filter Pills */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
            {categories
              .filter((c) => c.active)
              .map((category) => {
                const isSelected =
                  selectedCategoryId === category.id ||
                  (category.slug === 'todos' && selectedCategoryId === 'todos') ||
                  selectedCategoryId === category.slug;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.slug === 'todos' ? 'todos' : category.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-bold'
                        : 'bg-[#050b18] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{category.name}</span>
                    {typeof category.count === 'number' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {category.count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Mobile Filter Dropdown Button */}
          <div className="sm:hidden w-full">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#050b18] border border-cyan-500/30 text-slate-200 text-xs font-bold uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>
                  Categoría:{' '}
                  {categories.find((c) => c.id === selectedCategoryId || (c.slug === 'todos' && selectedCategoryId === 'todos'))?.name || 'Todos'}
                </span>
              </div>
              <span className="text-cyan-400">{isMobileFilterOpen ? '▲' : '▼'}</span>
            </button>

            {isMobileFilterOpen && (
              <div className="mt-2 p-2 rounded-xl bg-[#081226] border border-slate-700 shadow-xl grid grid-cols-1 gap-1">
                {categories.filter((c) => c.active).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.slug === 'todos' ? 'todos' : category.id);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between ${
                      (selectedCategoryId === category.id || (category.slug === 'todos' && selectedCategoryId === 'todos'))
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-[10px] font-mono opacity-80">{category.count ?? 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#050b18]/60 border border-slate-800/80 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">No se encontraron proyectos</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
            Probá con otra palabra clave o limpiá los filtros de categoría para ver todos los trabajos.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryId('todos');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Restablecer búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => {
            // Subtle editorial composition variation: every 3rd card has a featured border accent
            const isHighlighted = project.featured;

            return (
              <div
                key={project.id}
                className="group relative rounded-2xl bg-[#050b18] border border-slate-800/90 hover:border-cyan-400/80 transition-all duration-300 flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:-translate-y-1"
              >
                {/* Visual Image Container with Hover Zoom */}
                <div
                  className="aspect-[16/10] relative overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-transparent to-transparent opacity-80" />

                  {/* Top Badge: Category */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-[#020617]/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                      {project.category_name || 'Desarrollo'}
                    </span>
                  </div>

                  {/* Top Right: Featured Badge if present */}
                  {isHighlighted && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        <Sparkles className="w-3 h-3" />
                        Destacado
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay Button on Hover */}
                  <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Ficha
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-900/90 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Demo Interactiva
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Client & Year Micro-Header */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                      <span>{project.client_name || 'Cliente Confidencial'}</span>
                      <span>{project.year || '2024'}</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProject(project)}
                      className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1 mb-2"
                    >
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                      {project.short_description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group/btn cursor-pointer"
                    >
                      <span>Ver proyecto completo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Probar demo interactiva dentro de la ficha"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
