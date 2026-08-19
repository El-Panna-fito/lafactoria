import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { generateText } from 'ai';
import dotenv from 'dotenv';

// Load environment variables (AI_GATEWAY_API_KEY, Supabase keys, etc.) into
// process.env. This Express server does not auto-load .env files the way
// Next.js does, so we load them explicitly. Files loaded later do not override
// variables already set (e.g. real platform env vars in production).
dotenv.config({ path: '.env.development.local' });
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chatbot endpoint with Gemini
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], catalog = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'El mensaje es obligatorio' });
      }

      // Build the catalog section dynamically from the projects ACTUALLY loaded
      // in the system (sent by the client). This guarantees the advisor only
      // recommends real, existing projects and never invents slugs.
      const catalogItems = Array.isArray(catalog) ? catalog : [];
      const validSlugs = new Set(
        catalogItems
          .map((p: any) => (typeof p?.slug === 'string' ? p.slug : null))
          .filter(Boolean)
      );

      const catalogSection =
        catalogItems.length > 0
          ? catalogItems
              .map((p: any) => {
                const tags = Array.isArray(p.tags) ? p.tags.join(', ') : '';
                const features = Array.isArray(p.features) ? p.features.join('; ') : '';
                return `- \`${p.slug}\`: ${p.title}${p.category ? ` [${p.category}]` : ''}
  Descripción: ${p.short_description || ''}${tags ? `\n  Tecnologías/Tags: ${tags}` : ''}${features ? `\n  Funcionalidades: ${features}` : ''}`;
              })
              .join('\n')
          : 'No hay proyectos cargados en el sistema en este momento. No recomiendes ningún proyecto puntual y ofrecé una cotización a medida.';

      const systemInstruction = `
Eres el asesor de descubrimiento digital y consultor de soluciones de **La factorIA** (software factory del ecosistema educativo y tecnológico IEC en Paraná, Entre Ríos, Argentina).

TU MISIÓN PRINCIPAL:
Ayudar a los visitantes y potenciales clientes a **descubrir qué tipo de página web o solución digital se adapta exactamente a su negocio y objetivos**.

PAUTAS DE INTERACCIÓN Y DESCUBRIMIENTO:
1. **Modo Consultivo y Diagnóstico**:
   - Escucha la necesidad del cliente y ayúdalo a clarificar su idea.
   - Si el usuario dice algo general (ej: "quiero una web para mi negocio" o "no sé qué necesito"), hazle 1 o 2 preguntas clave de diagnóstico (por ejemplo: ¿Querés vender con cobro online o solo catálogo?, ¿Precisás agendar citas/turnos automáticos o captar consultas?, ¿Es para un servicio profesional o un comercio?).
   - Si el usuario hace una consulta puntual e informativa (ej: "¿dónde están ubicados?", "¿quiénes son?", "¿cuánto demoran?", "¿cómo cotizo?"), responde directo, amable y conciso, sin forzar recomendaciones de páginas.

2. **Recomendación Precisa y Exclusiva**:
   - Solo cuando el usuario exprese claramente su rubro o necesidad (o responda al diagnóstico), explícale qué tipo de arquitectura web le conviene (Landing de alta conversión, E-commerce transaccional, Portal institucional, Sistema con turnero, etc.) y por qué.
   - Si corresponde mostrarle un demo interactivo de nuestro catálogo que coincida con lo que busca, agrega al final de tu mensaje el tag especial: \`[PROYECTO:slug]\` usando EXCLUSIVAMENTE alguno de los slugs listados en el "CATÁLOGO DE PROYECTOS CARGADOS EN EL SISTEMA" de abajo.
   - REGLA CRÍTICA: NUNCA inventes ni menciones proyectos o slugs que no estén en esa lista. Basá tus recomendaciones únicamente en los proyectos reales cargados en el sistema. Si ninguno encaja perfecto, recomendá el más cercano y aclaralo, u ofrecé un desarrollo a medida.
   - Cuando recomiendes un proyecto, explicá brevemente POR QUÉ ese caso concreto (por sus funcionalidades/rubro) es el indicado para la necesidad del usuario.
   - Si el usuario expresó requerimientos o el tipo de web que busca, agrega al final un tag con el resumen para el CRM: \`[RESUMEN:resumen conciso de los requerimientos]\` y el tipo de servicio \`[SERVICIO:tipo de servicio]\`.
   - Si no estás recomendando un proyecto puntual o aún no se definió la necesidad, NO incluyas esos tags.

CATÁLOGO DE PROYECTOS CARGADOS EN EL SISTEMA (única fuente de verdad para recomendar; usá estos slugs tal cual):
${catalogSection}

INFORMACIÓN INSTITUCIONAL Y CONTACTO:
- Ubicación / Dirección: Gualeguaychú 449, Paraná, Entre Ríos, Argentina (atención presencial y remota para todo el país e internacional).
- Teléfono / WhatsApp: +54 343 466-4964 (+543434664964)
- Email de contacto: contacto@factor.ia.com.ar
- Ecosistema: Brazo tecnológico del Instituto IEC (iec-ia.com.ar / Instagram: @iecparana). Instagram La factorIA: @la.factor.ia.
- Plazos de entrega: De 1 a 3 semanas según complejidad con metodología ágil.
- Cotización: Presupuesto técnico personalizado en menos de 24 horas hábiles.

ESTILO Y TONO:
- Español rioplatense/latino profesional, claro, empático y tecnológico.
- Respuestas directas, bien estructuradas, sin repeticiones ni relleno innecesario.
`;

      // Build conversation messages for the AI SDK
      const conversationMessages: { role: 'user' | 'assistant'; content: string }[] = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-8)) {
          if (item && item.role && item.text) {
            conversationMessages.push({
              role: item.role === 'user' ? 'user' : 'assistant',
              content: item.text,
            });
          }
        }
      }

      conversationMessages.push({ role: 'user', content: message });

      const { text: generatedText } = await generateText({
        model: 'google/gemini-2.5-flash',
        system: systemInstruction,
        messages: conversationMessages,
        temperature: 0.6,
      });

      let rawReply =
        generatedText ||
        '¡Gracias por tu consulta! En La factorIA desarrollamos soluciones a medida. ¿Qué objetivo principal te gustaría lograr con tu sitio web?';

      // Extract [PROYECTO:slug] tags if present
      const projectMatches = rawReply.matchAll(/\[PROYECTO:([a-zA-Z0-9_-]+)\]/g);
      const recommendedProjects: string[] = [];

      for (const match of projectMatches) {
        // Only keep slugs that correspond to a project actually loaded in the system.
        if (match[1] && (validSlugs.size === 0 || validSlugs.has(match[1]))) {
          recommendedProjects.push(match[1]);
        }
      }

      // Extract [RESUMEN:...] and [SERVICIO:...] tags if present
      const summaryMatch = rawReply.match(/\[RESUMEN:([^\]]+)\]/);
      const detectedSummary = summaryMatch ? summaryMatch[1].trim() : undefined;

      const serviceMatch = rawReply.match(/\[SERVICIO:([^\]]+)\]/);
      const detectedService = serviceMatch ? serviceMatch[1].trim() : undefined;

      // Clean the tags from the user-facing text
      let cleanReply = rawReply
        .replace(/\[PROYECTO:[a-zA-Z0-9_-]+\]/g, '')
        .replace(/\[RESUMEN:[^\]]+\]/g, '')
        .replace(/\[SERVICIO:[^\]]+\]/g, '')
        .trim();

      res.json({
        reply: cleanReply,
        recommendedProjects: Array.from(new Set(recommendedProjects)),
        detectedSummary,
        detectedService,
        suggestQuote: recommendedProjects.length > 0 || cleanReply.toLowerCase().includes('cotiz'),
      });
    } catch (error: any) {
      console.error('Error in /api/chat Gemini endpoint:', error);
      res.status(500).json({
        error: 'Error al procesar la respuesta con el asistente inteligente',
        details: error?.message || String(error),
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
