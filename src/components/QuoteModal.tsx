import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, CheckCircle, Sparkles, Building2, User, Mail, Phone, DollarSign, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../services/db';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
  initialProjectTitle?: string;
  initialService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialProjectId,
  initialProjectTitle,
  initialService = 'Desarrollo Web Integral',
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService);
  const [budgetRange, setBudgetRange] = useState('$1.000 - $2.500 USD');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialService) setService(initialService);
    if (initialProjectTitle) {
      setMessage(`Hola! Me interesa desarrollar un proyecto similar a "${initialProjectTitle}".`);
    } else {
      setMessage('');
    }
    setIsSuccess(false);
  }, [isOpen, initialProjectTitle, initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await db.addLead({
        name,
        company,
        email,
        phone,
        service,
        budget_range: budgetRange,
        message: message || 'Solicitud general de cotización para ' + service,
        project_id: initialProjectId,
        project_title: initialProjectTitle,
      });

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#ffffff', '#0284c7'],
      });
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `👋 ¡Hola La factorIA!\n\n` +
      `Mi nombre es *${name || 'un cliente'}* ${company ? `de *${company}*` : ''}.\n` +
      `📌 *Servicio de interés:* ${service}\n` +
      `${initialProjectTitle ? `🌟 *Proyecto de referencia:* ${initialProjectTitle}\n` : ''}` +
      `💰 *Presupuesto estimado:* ${budgetRange}\n` +
      `✉️ *Email:* ${email || 'A coordinar'}\n` +
      `📱 *Teléfono:* ${phone || 'A coordinar'}\n\n` +
      `📝 *Detalles:* ${message || 'Quisiera coordinar una llamada para recibir una propuesta a medida.'}`
    );
    window.open(`https://wa.me/543434664964?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-[#080e1e] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top circuit line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display text-white">
                ¡Solicitud recibida con éxito!
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Gracias <span className="text-cyan-300 font-semibold">{name}</span>. Nuestro equipo de ingeniería y producto revisará tu requerimiento y te contactará en menos de 24 horas.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] text-slate-950 font-bold text-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Continuar por WhatsApp ahora
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                Volver al sitio
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Cotizá tu proyecto
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Contanos qué necesitás
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Diseñamos una solución digital a la medida de tu negocio, optimizada para convertir y escalar.
              </p>
            </div>

            {initialProjectTitle && (
              <div className="mb-5 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Proyecto de referencia:</span>
                  <span className="font-bold text-cyan-300">{initialProjectTitle}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                  Demo vinculada
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lucas Fernández"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Empresa / Organización
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CECP Educación / Negocio propio"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Email de contacto *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="lucas@tuempresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Service */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Tipo de Solución
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 transition-colors"
                  >
                    <option value="Sitio Institucional">Sitio Institucional / Corporativo</option>
                    <option value="E-commerce a Medida">E-commerce / Tienda Online</option>
                    <option value="Landing Page de Alta Conversión">Landing Page</option>
                    <option value="Portal Escolar / Educativo">Portal Escolar / Académico</option>
                    <option value="Plataforma SaaS / Sistema Web">Plataforma SaaS / Sistema Web</option>
                    <option value="Desarrollo Web Integral">Desarrollo Web Integral</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                    Rango de Presupuesto Estimado
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 transition-colors"
                  >
                    <option value="$500 - $1.000 USD">$500 - $1.000 USD (Landing / Rápido)</option>
                    <option value="$1.000 - $2.500 USD">$1.000 - $2.500 USD (Institucional / Pyme)</option>
                    <option value="$2.500 - $5.000 USD">$2.500 - $5.000 USD (E-commerce / Plataforma)</option>
                    <option value="$5.000+ USD">$5.000+ USD (Solución Enterprise / SaaS)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Contanos detalles sobre el proyecto o tus objetivos
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Necesitamos renovar el sitio actual, integrar pasarela de pago y conectar con WhatsApp para consultas directas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando solicitud...' : 'Solicitar cotización'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-emerald-400 hover:border-emerald-500/50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Chatear por WhatsApp
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
