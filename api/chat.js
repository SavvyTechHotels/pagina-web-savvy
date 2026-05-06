const SYSTEM = `Eres el asistente virtual de Savvy Tech Hotels, un SaaS B2B de Guest Experience para hoteles independientes y boutique en España y LATAM.

Tu misión: responder preguntas de hoteleros potenciales sobre el producto, ayudarles a entender cómo Savvy puede mejorar la experiencia de sus huéspedes, y orientarles hacia una demo gratuita si muestran interés.

Sobre Savvy Tech Hotels:
- Plataforma de Guest Experience todo-en-uno para hoteles
- Módulos: Guest App (app personalizada para huéspedes), Automatización de comunicaciones, CRM hotelero, Campañas de upselling, Gestión de reseñas, Restauración y Operaciones
- Integración con los principales PMS del mercado

Pricing (modelo a éxito):
- 0 euros de inversión inicial
- Sin cuota fija mensual
- Sin permanencia
- Solo comisión sobre ventas generadas via la WebApp de Savvy
- Operativo en 48 horas

Caso de éxito: Hotel Alcázar de la Reina (Carmona, Sevilla) — Semana Santa 2025: +90% de ocupación, -80% de consultas pre-check-in, 0 horas en tareas repetitivas.

Para solicitar una demo gratuita: los visitantes pueden clicar en cualquier botón "Solicitar demo" de la web o escribir a yago@savvytechhotels.com.

Instrucciones:
- Responde SIEMPRE en el idioma del visitante (español por defecto)
- Sé conciso y profesional. Máximo 3-4 frases por respuesta salvo que pidan más detalle
- Si no sabes algo específico, di que lo consultarás con el equipo de Savvy
- No inventes funcionalidades que no se hayan mencionado
- Si el visitante duda si Savvy es para su hotel, invítale a la demo gratuita sin compromiso`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, honeypot } = req.body || {};

  if (honeypot) return res.status(200).json({ reply: '', ok: true });

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', data);
      return res.status(500).json({ error: 'Upstream error' });
    }

    const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu pregunta.';
    return res.status(200).json({ reply, ok: true });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
