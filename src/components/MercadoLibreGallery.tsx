import React, { useState, useRef } from 'react';
import { ProjectImage } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  Image as ImageIcon,
  Check,
  Eye,
} from 'lucide-react';

interface MercadoLibreGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
  onOpenLightbox: () => void;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export const MercadoLibreGallery: React.FC<MercadoLibreGalleryProps> = ({
  images,
  projectTitle,
  onOpenLightbox,
  activeImageIndex,
  setActiveImageIndex,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  const currentImage = images[activeImageIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePosition({ x, y });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };

  return (
    <div className="rounded-2xl bg-[#050b18] border border-slate-800/90 p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header bar of the Gallery */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-display text-white">
              Galería de Capturas del Proyecto
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Pasa el cursor para hacer zoom óptico o selecciona una miniatura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-md">
            {activeImageIndex + 1} / {images.length}
          </span>
          <button
            onClick={onOpenLightbox}
            className="text-xs font-mono text-cyan-300 hover:text-white bg-slate-900 hover:bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ver en pantalla completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ampliar</span>
          </button>
        </div>
      </div>

      {/* Mercado Libre Style Layout: Vertical thumbnails column on the left + Main Viewport on the right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Vertical Thumbnails Strip (ML Product Detail Style) */}
        <div className="order-2 md:order-1 md:col-span-2 lg:col-span-2 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[480px] p-1 scrollbar-thin scrollbar-thumb-slate-700">
          {images.map((img, idx) => {
            const isActive = activeImageIndex === idx;
            return (
              <button
                key={img.id || idx}
                onMouseEnter={() => setActiveImageIndex(idx)}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 md:w-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-950 group ${
                  isActive
                    ? 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.45)] ring-2 ring-cyan-500/30'
                    : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                }`}
                aria-label={`Ver captura ${idx + 1}`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || `Captura ${idx + 1}`}
                  className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right / Main Viewport: Large High-Resolution Image with Interactive Zoom */}
        <div className="order-1 md:order-2 md:col-span-10 lg:col-span-10">
          <div
            ref={mainImageRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={onOpenLightbox}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl cursor-crosshair select-none group"
          >
            {/* Base Image */}
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || projectTitle}
              className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Magnified Zoom Canvas (ML Style Lens) */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none bg-no-repeat transition-all duration-75"
                style={{
                  backgroundImage: `url(${currentImage.image_url})`,
                  backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  backgroundSize: '240%',
                }}
              />
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-all z-20 cursor-pointer opacity-90 group-hover:opacity-100 active:scale-95"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-all z-20 cursor-pointer opacity-90 group-hover:opacity-100 active:scale-95"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Hover Helper Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 pointer-events-none z-10">
              <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Zoom interactivo</span>
            </div>

            {/* Bottom Caption Pill */}
            {currentImage.caption && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-lg bg-[#030712]/90 border border-slate-700/80 px-3.5 py-1.5 rounded-lg backdrop-blur-md text-xs text-slate-200 font-mono z-10">
                {currentImage.caption}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
