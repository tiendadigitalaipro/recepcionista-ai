require('dotenv').config();
const express = require('express');
const https   = require('https');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT          = process.env.PORT || 3000;
const NOTION_TOKEN  = process.env.NOTION_TOKEN;
const NOTION_DB_ID  = process.env.NOTION_DB_ID;
const NOTION_CRM_ID = process.env.NOTION_CRM_ID;
const RESEND_KEY    = process.env.RESEND_API_KEY;
const FROM_EMAIL    = process.env.FROM_EMAIL || 'onboarding@resend.dev';

// URLs TikTok demos publicados
const TIKTOK_MARY  = 'https://www.tiktok.com/@zyncelectronics2026/video/7650993599638785287';
const TIKTOK_SOFIA = 'https://www.tiktok.com/@zyncelectronics2026/video/7650986004299468040';
const TIKTOK_ANA   = 'https://www.tiktok.com/@zyncelectronics2026/video/7651006531256798481';
const SHOWCASE_URL = 'https://tiendadigitalaipro.github.io/recepcionista-ai-showcase';

const demoBlockES = (url, agent) =>
  `<div style="margin:20px 0;text-align:center">` +
  `<p style="font-size:13px;color:#444;margin:0 0 8px;font-weight:600">👇 Mira cómo funciona en 90 segundos:</p>` +
  `<a href="${url}" style="display:block;background:#111827;border-radius:10px;padding:20px 16px;text-decoration:none">` +
  `<span style="color:#fff;font-size:28px;line-height:1">▶</span>` +
  `<p style="color:#fff;font-weight:bold;margin:6px 0 2px;font-size:14px">Ver a ${agent} en acción — Demo en vivo</p>` +
  `<p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0">TikTok · @zyncelectronics2026</p>` +
  `</a></div>` +
  `<p style="font-size:13px;color:#777;border-top:1px solid #f0f0f0;padding-top:14px;margin-top:4px">` +
  `<strong>P.D.:</strong> La demo dura 90 segundos. Después de verla dime si te la imaginas contestando en tu negocio. 😊</p>`;

const demoBlockEN = (url, agent) =>
  `<div style="margin:20px 0;text-align:center">` +
  `<p style="font-size:13px;color:#444;margin:0 0 8px;font-weight:600">👇 Watch how it works in 90 seconds:</p>` +
  `<a href="${url}" style="display:block;background:#111827;border-radius:10px;padding:20px 16px;text-decoration:none">` +
  `<span style="color:#fff;font-size:28px;line-height:1">▶</span>` +
  `<p style="color:#fff;font-weight:bold;margin:6px 0 2px;font-size:14px">Watch ${agent} in action — Live Demo</p>` +
  `<p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0">TikTok · @zyncelectronics2026</p>` +
  `</a></div>` +
  `<p style="font-size:13px;color:#777;border-top:1px solid #f0f0f0;padding-top:14px;margin-top:4px">` +
  `<strong>P.S.:</strong> The demo is 90 seconds. Watch it and tell me if you can picture this answering for your business. 😊</p>`;

// ══════════════════════════════════════════════════
//  PLANTILLAS DE EMAIL — PROFESIONALES
// ══════════════════════════════════════════════════

const templates = {

  // ── INGLÉS — Estados Unidos ───────────────────
  EN: {
    nail: {
      subject: "Your nail salon is missing calls right now — AI can fix that",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#FF1493;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">💅 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">AI Voice Receptionists for Beauty Businesses</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hi${name ? ' ' + name : ''},</p>
          <p>Every missed call at your nail salon is a client booking with your competitor instead.</p>
          <p>We built <strong>Mary</strong> — an AI receptionist that answers every call, speaks English and Spanish, and books appointments automatically. 24 hours a day, 7 days a week.</p>
          <div style="background:#FFF0F6;border-left:4px solid #FF1493;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#FF1493">What Mary does for your salon:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Answers calls instantly — no hold music, no missed clients</li>
              <li>Speaks English & Spanish automatically</li>
              <li>Books appointments and confirms via WhatsApp</li>
              <li>Works nights, weekends, and holidays</li>
            </ul>
          </div>
          <p>Your competitors are already using AI. <strong>We'll set yours up in 24 hours.</strong></p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hi%2C%20I%20want%20a%20free%20demo%20for%20my%20nail%20salon"
               style="background:#FF1493;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Get My Free Demo
            </a>
          </div>
          <p style="color:#666;font-size:14px">Starting at <strong>$97/month</strong> — less than one missed appointment per month. No contracts, cancel anytime.</p>
          ${demoBlockEN(TIKTOK_MARY, 'Mary')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · Venezuela 🇻🇪 · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#FF1493">See all our agents</a>
          <br>To unsubscribe reply STOP
        </div>
      </div>`
    },
    restaurant: {
      subject: "Restaurants using AI answer 3x more calls — here's how",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#F97316,#FBBF24);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🍽️ A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">AI Voice Receptionists for Restaurants</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hi${name ? ' ' + name : ''},</p>
          <p>Your staff is busy serving tables. Who's answering the phone?</p>
          <p>We built <strong>Sofia</strong> — an AI hostess that handles every call, takes reservations, answers menu questions, and never puts anyone on hold.</p>
          <div style="background:#FFF7ED;border-left:4px solid #F97316;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#F97316">Sofia handles all of this automatically:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Reservations for any party size</li>
              <li>Daily specials & menu questions</li>
              <li>Private event inquiries</li>
              <li>English & Spanish — automatically detected</li>
            </ul>
          </div>
          <p>No more missed reservations. No more unanswered calls during the dinner rush.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hi%2C%20I%20want%20a%20free%20demo%20for%20my%20restaurant"
               style="background:#F97316;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Get My Free Demo
            </a>
          </div>
          <p style="color:#666;font-size:14px">Starting at <strong>$97/month</strong> · Setup in 24 hours · No contracts</p>
          ${demoBlockEN(TIKTOK_SOFIA, 'Sofia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#F97316">See all our agents</a> · Reply STOP to unsubscribe
        </div>
      </div>`
    },
    clinic: {
      subject: "Your clinic misses 30% of patient calls — AI ends that",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#06B6D4,#6366F1);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏥 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">AI Voice Receptionists for Medical Practices</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hi${name ? ' ' + name : ''},</p>
          <p>Studies show that <strong>30% of patient calls go unanswered</strong> at medical offices during peak hours. Each missed call is a patient who calls your competitor next.</p>
          <p>We built <strong>Ana</strong> — a calm, professional AI receptionist trained specifically for medical practices.</p>
          <div style="background:#F0F9FF;border-left:4px solid #06B6D4;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#06B6D4">Ana handles your front desk 24/7:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Books appointments by specialty</li>
              <li>Collects patient info before the visit</li>
              <li>Detects emergencies → directs to 911 immediately</li>
              <li>Insurance & self-pay questions answered instantly</li>
              <li>English & Spanish — zero extra cost</li>
            </ul>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hi%2C%20I%20want%20a%20free%20demo%20for%20my%20clinic"
               style="background:#06B6D4;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Get My Free Demo
            </a>
          </div>
          <p style="color:#666;font-size:14px">Starting at <strong>$97/month</strong> · HIPAA-conscious design · Setup in 24 hours</p>
          ${demoBlockEN(TIKTOK_ANA, 'Ana')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#06B6D4">See all our agents</a> · Reply STOP to unsubscribe
        </div>
      </div>`
    },
    hotel: {
      subject: "Hotel guests expect instant answers — AI delivers that",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#8B5CF6,#EC4899);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏨 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">AI Concierge for Hotels & Boutique Properties</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hi${name ? ' ' + name : ''},</p>
          <p>Today's travelers research and book at midnight. If your phone goes unanswered, they book somewhere else.</p>
          <p>We built <strong>Lucia</strong> — an elegant AI concierge that handles reservations, room questions, packages and amenities with the sophistication your guests expect.</p>
          <div style="background:#FAF5FF;border-left:4px solid #8B5CF6;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#8B5CF6">Lucia works your front desk around the clock:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Room reservations with rate quotes</li>
              <li>Check-in/check-out info & policies</li>
              <li>Amenities, spa, pool, restaurant hours</li>
              <li>Special packages (honeymoon, business, weekend)</li>
              <li>Seamless English & Spanish — auto-detected</li>
            </ul>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hi%2C%20I%20want%20a%20free%20demo%20for%20my%20hotel"
               style="background:#8B5CF6;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Get My Free Demo
            </a>
          </div>
          <p style="color:#666;font-size:14px">Starting at <strong>$97/month</strong> · Setup in 24 hours · No long-term contracts</p>
          ${demoBlockEN(SHOWCASE_URL, 'Lucia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#8B5CF6">See all our agents</a> · Reply STOP to unsubscribe
        </div>
      </div>`
    }
  },

  // ── ESPAÑOL — España ──────────────────────────
  ES: {
    nail: {
      subject: "Tu salón de uñas pierde clientes por teléfono cada día — hay solución",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#FF1493;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">💅 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">Recepcionistas de IA para Salones de Belleza</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada llamada que no contestas en tu salón es una cita que se va a la competencia.</p>
          <p>Hemos creado a <strong>Mary</strong> — una recepcionista de inteligencia artificial que contesta todas las llamadas, habla inglés y español, y agenda citas automáticamente. Las 24 horas, los 7 días de la semana.</p>
          <div style="background:#FFF0F6;border-left:4px solid #FF1493;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#FF1493">Lo que Mary hace por tu salón:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Contesta al instante — sin esperas, sin llamadas perdidas</li>
              <li>Habla inglés y español de forma automática</li>
              <li>Agenda citas y confirma por WhatsApp</li>
              <li>Trabaja noches, fines de semana y festivos</li>
            </ul>
          </div>
          <p>Tu competencia ya está usando IA. <strong>Nosotros configuramos la tuya en 24 horas.</strong></p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20gratuita%20para%20mi%20sal%C3%B3n%20de%20u%C3%B1as"
               style="background:#FF1493;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>97€/mes</strong> — menos que una cita perdida al mes. Sin permanencia, cancela cuando quieras.</p>
          ${demoBlockES(TIKTOK_MARY, 'Mary')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#FF1493">Ver todos nuestros agentes</a>
          <br>Para darte de baja responde BAJA
        </div>
      </div>`
    },
    restaurant: {
      subject: "Tu restaurante pierde reservas por no contestar el teléfono",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#F97316,#FBBF24);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🍽️ A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Recepcionistas de IA para Restaurantes</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Tu equipo está sirviendo mesas. ¿Quién contesta el teléfono?</p>
          <p>Hemos creado a <strong>Sofia</strong> — una hostess de IA que gestiona todas las llamadas, toma reservas, responde preguntas del menú y nunca deja a nadie en espera.</p>
          <div style="background:#FFF7ED;border-left:4px solid #F97316;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#F97316">Sofia gestiona todo esto automáticamente:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Reservas para cualquier número de comensales</li>
              <li>Menú del día y preguntas sobre la carta</li>
              <li>Eventos privados y celebraciones</li>
              <li>Inglés y español — detección automática</li>
            </ul>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20gratuita%20para%20mi%20restaurante"
               style="background:#F97316;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>97€/mes</strong> · Configuración en 24h · Sin permanencia</p>
          ${demoBlockES(TIKTOK_SOFIA, 'Sofia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#F97316">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    clinic: {
      subject: "El 30% de las llamadas a tu clínica se pierden — la IA lo resuelve",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#06B6D4,#6366F1);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏥 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Recepcionistas de IA para Clínicas y Consultas</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada llamada no contestada en tu clínica es un paciente que llama a otra consulta.</p>
          <p>Hemos creado a <strong>Ana</strong> — una recepcionista de IA tranquila y profesional, entrenada específicamente para centros médicos.</p>
          <div style="background:#F0F9FF;border-left:4px solid #06B6D4;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#06B6D4">Ana gestiona tu consulta 24/7:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Agenda citas por especialidad</li>
              <li>Recoge datos del paciente antes de la visita</li>
              <li>Detecta emergencias → dirige al 112 de inmediato</li>
              <li>Preguntas sobre seguros y precios resueltas al instante</li>
              <li>Inglés y español sin coste extra</li>
            </ul>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20gratuita%20para%20mi%20clinica"
               style="background:#06B6D4;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>97€/mes</strong> · Configuración en 24h · Sin permanencia</p>
          ${demoBlockES(TIKTOK_ANA, 'Ana')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#06B6D4">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    hotel: {
      subject: "Tus huéspedes esperan respuesta inmediata — la IA se la da",
      html: (name) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#8B5CF6,#EC4899);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏨 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Conserje IA para Hoteles y Alojamientos</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Los viajeros de hoy buscan y reservan a medianoche. Si tu teléfono no contesta, reservan en otro hotel.</p>
          <p>Hemos creado a <strong>Lucia</strong> — una conserje de IA elegante que gestiona reservas, preguntas sobre habitaciones, paquetes y servicios con la sofisticación que tus huéspedes esperan.</p>
          <div style="background:#FAF5FF;border-left:4px solid #8B5CF6;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#8B5CF6">Lucia atiende tu recepción sin parar:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Reservas con tarifas y disponibilidad</li>
              <li>Check-in/check-out y políticas del hotel</li>
              <li>Spa, piscina, restaurante y horarios</li>
              <li>Paquetes especiales (luna de miel, negocios, fin de semana)</li>
              <li>Inglés y español — detección automática</li>
            </ul>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20gratuita%20para%20mi%20hotel"
               style="background:#8B5CF6;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>97€/mes</strong> · Configuración en 24h · Sin permanencia</p>
          ${demoBlockES(SHOWCASE_URL, 'Lucia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#8B5CF6">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    barber: {
      subject: "Tu barbería pierde turnos cada día — esto lo resuelve en 24h",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#111827,#374151);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">💈 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px">Tecnología profesional para barberías modernas</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada cliente que llama y no contesta nadie se va a la barbería de al lado. Y no siempre vuelve.</p>
          <p>Tenemos dos herramientas diseñadas específicamente para barberías como la tuya:</p>
          <div style="background:#F0FDF4;border-left:4px solid #22C55E;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#15803D">💬 Recepcionista IA — 97€/mes</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333;font-size:14px">
              <li>Contesta llamadas y agenda turnos automáticamente</li>
              <li>Disponible 24/7 — incluso cuando estás con las manos ocupadas</li>
              <li>Habla con tus clientes de forma natural, en español</li>
              <li>Confirmaciones automáticas por WhatsApp</li>
            </ul>
          </div>
          <div style="background:#FFF7ED;border-left:4px solid #F59E0B;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#B45309">🖥️ Barbería Pro — Pago único 25€</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333;font-size:14px">
              <li>Software completo de gestión para tu barbería</li>
              <li>Control de clientes, citas, caja y reportes del día</li>
              <li>Sin mensualidades — tuyo para siempre</li>
              <li>Funciona sin internet, desde cualquier dispositivo</li>
            </ul>
          </div>
          <p style="font-size:15px"><strong>Configúrate en 24 horas.</strong> Sin contratos, sin sorpresas.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%20Abigail%2C%20me%20interesa%20la%20tecnologia%20para%20mi%20barberia"
               style="background:#111827;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              💬 Quiero saber más — WhatsApp
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center">O responde este correo y te hago una demo gratis en vivo.</p>
          ${demoBlockES(TIKTOK_MARY, 'Mary')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#374151">Ver todos nuestros servicios</a> · Responde BAJA para cancelar
        </div>
      </div>`
    }
  },

  // ── LATINOAMÉRICA — México, Colombia, Panamá, Venezuela ──
  LATAM: {
    nail: {
      subject: "Tu salón pierde clientes por teléfono cada día — la IA lo resuelve",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#FF1493;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">💅 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">Recepcionista de IA para Salones de Belleza</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada llamada que no contestas en tu salón es una cita que se va a la competencia. Y eso pasa más de lo que crees.</p>
          <p>Creamos a <strong>Mary</strong> — una recepcionista de inteligencia artificial que contesta todas tus llamadas, agenda citas y nunca deja a un cliente esperando. Las 24 horas, los 7 días.</p>
          <div style="background:#FFF0F6;border-left:4px solid #FF1493;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#FF1493">Mary hace todo esto por tu salón:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Contesta al instante — sin llamadas perdidas, sin clientes frustrados</li>
              <li>Agenda citas y confirma por WhatsApp automáticamente</li>
              <li>Trabaja noches, fines de semana y días festivos</li>
              <li>Habla español perfectamente — sin acento, sin errores</li>
            </ul>
          </div>
          <p><strong>Lo configuramos todo en 24 horas.</strong> Tú solo atiende a tus clientes.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20gratuita%20para%20mi%20sal%C3%B3n"
               style="background:#FF1493;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>$97 USD/mes</strong> — menos de lo que cuesta una empleada por semana. Sin contratos, cancela cuando quieras.</p>
          ${demoBlockES(TIKTOK_MARY, 'Mary')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#FF1493">Ver todos nuestros agentes</a>
          <br>Responde BAJA para no recibir más mensajes
        </div>
      </div>`
    },
    restaurant: {
      subject: "¿Tu restaurante pierde reservas por no contestar? Hay solución",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#F97316,#FBBF24);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🍽️ A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Recepcionista de IA para Restaurantes</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Tu equipo está ocupado atendiendo mesas. ¿Quién está contestando el teléfono?</p>
          <p>Creamos a <strong>Sofia</strong> — una hostess virtual que gestiona todas tus llamadas, toma reservas, responde preguntas del menú y nunca pone a nadie en espera.</p>
          <div style="background:#FFF7ED;border-left:4px solid #F97316;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#F97316">Sofia trabaja para ti todos los días:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Reservas para cualquier número de comensales</li>
              <li>Menú del día, precios y opciones especiales</li>
              <li>Eventos privados, cumpleaños y celebraciones</li>
              <li>Disponible a cualquier hora — incluso cuando el restaurante está lleno</li>
            </ul>
          </div>
          <p>Sin llamadas perdidas. Sin reservas que se van a otro lado. <strong>Configuración en 24 horas.</strong></p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20para%20mi%20restaurante"
               style="background:#F97316;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>$97 USD/mes</strong> · Sin contratos · Activación en 24 horas</p>
          ${demoBlockES(TIKTOK_SOFIA, 'Sofia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#F97316">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    clinic: {
      subject: "Tu clínica pierde pacientes por llamadas sin contestar — esto lo arregla",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#06B6D4,#6366F1);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏥 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Recepcionista de IA para Clínicas y Consultas Médicas</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada paciente que no logra comunicarse con tu clínica llama a otra. Y muchos no vuelven a intentarlo.</p>
          <p>Creamos a <strong>Ana</strong> — una recepcionista de IA tranquila y profesional, entrenada específicamente para el área médica.</p>
          <div style="background:#F0F9FF;border-left:4px solid #06B6D4;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#06B6D4">Ana atiende tu consulta las 24 horas:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Agenda citas por especialidad sin errores</li>
              <li>Recoge los datos del paciente antes de la consulta</li>
              <li>Detecta emergencias → orienta a llamar al número de emergencias</li>
              <li>Preguntas sobre precios y seguros respondidas al instante</li>
            </ul>
          </div>
          <p><strong>Más pacientes atendidos, menos llamadas perdidas.</strong> Todo listo en 24 horas.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20para%20mi%20clinica"
               style="background:#06B6D4;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>$97 USD/mes</strong> · Sin contratos · Activación en 24 horas</p>
          ${demoBlockES(TIKTOK_ANA, 'Ana')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#06B6D4">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    hotel: {
      subject: "Tus huéspedes no pueden esperar — un agente IA atiende al instante",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#8B5CF6,#EC4899);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">🏨 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Conserje IA para Hoteles y Hospedajes</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Los viajeros de hoy buscan y reservan de noche o los fines de semana. Si no contestas, reservan en otro hotel.</p>
          <p>Creamos a <strong>Lucia</strong> — una conserje virtual elegante que atiende reservas, preguntas de habitaciones, paquetes y servicios con la calidad que tus huéspedes merecen.</p>
          <div style="background:#FAF5FF;border-left:4px solid #8B5CF6;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#8B5CF6">Lucia trabaja para tu hotel sin parar:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333">
              <li>Reservas con tarifas y disponibilidad al instante</li>
              <li>Check-in, check-out y políticas del hotel</li>
              <li>Piscina, restaurante, spa y amenidades</li>
              <li>Paquetes especiales y temporadas altas</li>
            </ul>
          </div>
          <p><strong>Más reservas directas, menos intermediarios.</strong> Lista en 24 horas.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%2C%20quiero%20una%20demo%20para%20mi%20hotel"
               style="background:#8B5CF6;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              🎙️ Quiero mi Demo Gratis
            </a>
          </div>
          <p style="color:#666;font-size:14px">Desde <strong>$97 USD/mes</strong> · Sin contratos · Activación en 24 horas</p>
          ${demoBlockES(SHOWCASE_URL, 'Lucia')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#8B5CF6">Ver todos nuestros agentes</a> · Responde BAJA para cancelar
        </div>
      </div>`
    },
    barber: {
      subject: "Tu barbería pierde turnos cada día — esto lo resuelve en 24h",
      html: (name, pais) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#111827,#374151);padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">💈 A2K Digital Studio</h1>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px">Tecnología profesional para barberías modernas</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #eee">
          <p style="font-size:16px">Hola${name ? ' ' + name : ''},</p>
          <p>Cada cliente que llama y no contesta nadie se va a la barbería de al lado. Y no siempre vuelve.</p>
          <p>Tenemos dos herramientas diseñadas específicamente para barberías como la tuya:</p>
          <div style="background:#F0FDF4;border-left:4px solid #22C55E;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#15803D">💬 Recepcionista IA — $97 USD/mes</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333;font-size:14px">
              <li>Contesta llamadas y agenda turnos automáticamente</li>
              <li>Disponible 24/7 — incluso cuando estás con las manos ocupadas</li>
              <li>Habla con tus clientes de forma natural, en español</li>
              <li>Confirmaciones automáticas por WhatsApp</li>
            </ul>
          </div>
          <div style="background:#FFF7ED;border-left:4px solid #F59E0B;padding:16px;margin:24px 0;border-radius:4px">
            <p style="margin:0;font-weight:bold;color:#B45309">🖥️ Barbería Pro — Pago único $25</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#333;font-size:14px">
              <li>Software completo de gestión para tu barbería</li>
              <li>Control de clientes, citas, caja y reportes del día</li>
              <li>Sin mensualidades — tuyo para siempre</li>
              <li>Funciona sin internet, desde cualquier dispositivo</li>
            </ul>
          </div>
          <p style="font-size:15px">Muchas barberías usan las dos juntas: el software maneja el día a día y la IA atiende las llamadas. <strong>Configúrate en 24 horas.</strong></p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://wa.me/584164117331?text=Hola%20Abigail%2C%20me%20interesa%20la%20tecnologia%20para%20mi%20barberia"
               style="background:#111827;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
              💬 Quiero saber más — WhatsApp
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center">O responde este correo y te hago una demo gratis en vivo.</p>
          ${demoBlockES(TIKTOK_MARY, 'Mary')}
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#999">
          A2K Digital Studio · Venezuela · <a href="https://tiendadigitalaipro.github.io/recepcionista-ai-showcase" style="color:#374151">Ver todos nuestros servicios</a> · Responde BAJA para cancelar
        </div>
      </div>`
    }
  },

};

// ══════════════════════════════════════════════════
//  NOTION HELPERS
// ══════════════════════════════════════════════════
function notionRequest(method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.notion.com', path, method,
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    });
    req.on('error', () => resolve({}));
    if (data) req.write(data);
    req.end();
  });
}

function registrarLlamada(datos) {
  if (!NOTION_TOKEN || !NOTION_DB_ID) return;
  notionRequest('POST', '/v1/pages', {
    parent: { database_id: NOTION_DB_ID },
    properties: {
      "Cliente":            { title: [{ text: { content: datos.cliente || "Desconocido" } }] },
      "Servicio Solicitado":{ rich_text: [{ text: { content: datos.servicio || "" } }] },
      "Telefono":           { phone_number: datos.telefono || null },
      "Agente":             { select: { name: datos.agente } },
      "Estado":             { select: { name: "✅ Nueva Cita" } },
      "Duracion Llamada":   { rich_text: [{ text: { content: datos.duracion || "" } }] },
      "Fecha de Llamada":   { date: { start: new Date().toISOString().split('T')[0] } },
      "Notas":              { rich_text: [{ text: { content: datos.resumen || "" } }] }
    }
  });
}

async function actualizarProspecto(pageId, estado, notas) {
  return notionRequest('PATCH', `/v1/pages/${pageId}`, {
    properties: {
      "Estado": { select: { name: estado } },
      "Fecha Envio": { date: { start: new Date().toISOString().split('T')[0] } },
      ...(notas ? { "Notas": { rich_text: [{ text: { content: notas } }] } } : {})
    }
  });
}

async function obtenerProspectos(filtro) {
  const f = filtro || { property: "Estado", select: { equals: "📬 Por Enviar" } };
  return notionRequest('POST', `/v1/databases/${NOTION_CRM_ID}/query`, { filter: f, page_size: 50 });
}

// ══════════════════════════════════════════════════
//  EMAIL SENDER — Resend API
// ══════════════════════════════════════════════════
function enviarEmail(to, subject, html, fromName) {
  return new Promise((resolve, reject) => {
    if (!RESEND_KEY) return reject(new Error('RESEND_API_KEY no configurada'));
    const body = JSON.stringify({
      from: `${fromName || 'A2K Digital Studio'} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html
    });
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const json = JSON.parse(d || '{}');
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
        else reject(new Error(json.message || `Error ${res.statusCode}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function extraerDatos(body, nombreAgente) {
  const msg = body?.message || {};
  const transcript = msg.transcript || msg.call?.transcript || '';
  const duracion = msg.call?.duration
    ? `${Math.floor(msg.call.duration / 60)}min ${msg.call.duration % 60}seg` : '';
  const nombreMatch = transcript.match(/(?:me llamo|my name is|soy|I'm)\s+([A-ZÁa-záéíóúñ]+(?:\s+[A-ZÁa-záéíóúñ]+)?)/i);
  const telMatch = transcript.match(/\+?[\d\s\-().]{7,20}/);
  return {
    cliente: nombreMatch ? nombreMatch[1] : (msg.customer?.name || 'Cliente sin nombre'),
    telefono: telMatch ? telMatch[0].trim() : (msg.customer?.number || null),
    servicio: transcript.substring(0, 120),
    resumen: transcript.substring(0, 300),
    duracion, agente: nombreAgente
  };
}

// ══════════════════════════════════════════════════
//  RUTAS — VAPI WEBHOOKS
// ══════════════════════════════════════════════════
app.get('/health', (_, res) => res.json({ status: 'ok', version: '2.1', agentes: ['sofia','ana','lucia','mary','marcos','elena','carlos','valentina','camila','diego'] }));

app.post('/sofia/webhook',     (req, res) => { registrarLlamada(extraerDatos(req.body, '🍽️ Sofia — Restaurante'));     res.json({ ok: true }); });
app.post('/ana/webhook',       (req, res) => { registrarLlamada(extraerDatos(req.body, '🏥 Ana — Clinica'));           res.json({ ok: true }); });
app.post('/lucia/webhook',     (req, res) => { registrarLlamada(extraerDatos(req.body, '🏨 Lucia — Hotel'));           res.json({ ok: true }); });
app.post('/mary/webhook',      (req, res) => { registrarLlamada(extraerDatos(req.body, '💅 Mary — Nail Studio'));     res.json({ ok: true }); });
app.post('/marcos/webhook',    (req, res) => { registrarLlamada(extraerDatos(req.body, '⚖️ Marcos — Abogados'));      res.json({ ok: true }); });
app.post('/elena/webhook',     (req, res) => { registrarLlamada(extraerDatos(req.body, '🏠 Elena — Inmobiliaria'));   res.json({ ok: true }); });
app.post('/carlos/webhook',    (req, res) => { registrarLlamada(extraerDatos(req.body, '🚗 Carlos — Taller Mecánico')); res.json({ ok: true }); });
app.post('/valentina/webhook', (req, res) => { registrarLlamada(extraerDatos(req.body, '🎂 Valentina — Eventos'));    res.json({ ok: true }); });
app.post('/camila/webhook',    (req, res) => { registrarLlamada(extraerDatos(req.body, '🏡 Camila — Agencia de Viajes')); res.json({ ok: true }); });
app.post('/diego/webhook',     (req, res) => { registrarLlamada(extraerDatos(req.body, '🚕 Diego — Taxis'));          res.json({ ok: true }); });

// ══════════════════════════════════════════════════
//  RUTAS — CRM EMAIL
// ══════════════════════════════════════════════════

// Enviar email a un prospecto individual
app.post('/crm/send', async (req, res) => {
  const { email, nombre, industria, pais, pageId } = req.body;
  if (!email || !industria || !pais) return res.status(400).json({ error: 'Faltan campos: email, industria, pais' });

  const latamPaises = ['MX','CO','PA','VE','AR','PE','CL','EC'];
  const lang = pais === 'ES' ? 'ES' : latamPaises.includes(pais) ? 'LATAM' : 'EN';
  const ind  = industria.toLowerCase().includes('nail') || industria.includes('uña') ? 'nail'
             : industria.toLowerCase().includes('rest') ? 'restaurant'
             : industria.toLowerCase().includes('clin') || industria.toLowerCase().includes('medic') ? 'clinic'
             : industria.toLowerCase().includes('barber') || industria.toLowerCase().includes('peluc') || industria.toLowerCase().includes('salon') ? 'barber'
             : 'hotel';

  const tpl = templates[lang]?.[ind] || templates['ES']['nail'];
  try {
    await enviarEmail(email, tpl.subject, typeof tpl.html === 'function' ? tpl.html(nombre, pais) : tpl.html, 'A2K Digital Studio');
    if (pageId && NOTION_CRM_ID) await actualizarProspecto(pageId, '✉️ Enviado', `Email enviado: ${tpl.subject}`);
    res.json({ ok: true, subject: tpl.subject, to: email });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Campaña masiva — envía a todos los prospectos "Por Enviar"
app.post('/crm/campaign', async (req, res) => {
  if (!NOTION_CRM_ID) return res.status(400).json({ error: 'NOTION_CRM_ID no configurado' });
  const data = await obtenerProspectos();
  const prospectos = data.results || [];
  res.json({ iniciada: true, total: prospectos.length, mensaje: `Enviando a ${prospectos.length} prospectos en background` });

  // Envío en background con delay para evitar spam
  (async () => {
    let enviados = 0, errores = 0;
    for (const p of prospectos) {
      try {
        const props = p.properties;
        const email  = props['Email']?.email;
        const nombre = props['Contacto']?.rich_text?.[0]?.text?.content || '';
        const paisNombre = props['Pais']?.select?.name || '';
        const latamCodes = ['MX','CO','PA','VE','AR','PE','CL','EC','Mexico','Colombia','Panama','Venezuela'];
        const paisLang = paisNombre.includes('España') ? 'ES'
                       : latamCodes.some(c => paisNombre.includes(c)) ? 'LATAM' : 'EN';
        const ind    = props['Industria']?.select?.name?.toLowerCase() || 'nail';
        if (!email) continue;

        const indKey = ind.includes('nail') || ind.includes('uña') ? 'nail'
                     : ind.includes('rest') ? 'restaurant'
                     : ind.includes('clin') || ind.includes('medic') ? 'clinic'
                     : ind.includes('barber') || ind.includes('peluc') || ind.includes('salon') ? 'barber'
                     : 'hotel';
        const tpl = templates[paisLang]?.[indKey] || templates['ES']['nail'];
        await enviarEmail(email, tpl.subject, typeof tpl.html === 'function' ? tpl.html(nombre, paisNombre) : tpl.html);
        await actualizarProspecto(p.id, '✉️ Enviado', `Campaña: ${new Date().toLocaleDateString()}`);
        enviados++;
        await new Promise(r => setTimeout(r, 2000)); // 2 segundos entre emails
      } catch { errores++; }
    }
    console.log(`Campaña completada: ${enviados} enviados, ${errores} errores`);
  })();
});

// ── Seguimiento a prospecto interesado ───────────────
app.post('/crm/seguimiento', async (req, res) => {
  const { email, pageId, nombre, industria, pais } = req.body;
  if (!email) return res.status(400).json({ error: 'Falta email' });

  // Detectar agente y demo según industria
  const ind = (industria || '').toLowerCase();
  let agente = 'Mary', tiktok = TIKTOK_MARY, precio = '$97/mes', emoji = '💅';
  if (ind.includes('rest') || ind.includes('comid') || ind.includes('gastro')) {
    agente = 'Sofia'; tiktok = TIKTOK_SOFIA; precio = '$97/mes'; emoji = '🍽️';
  } else if (ind.includes('clin') || ind.includes('medic') || ind.includes('dental') || ind.includes('salud')) {
    agente = 'Ana'; tiktok = TIKTOK_ANA; precio = '$97/mes'; emoji = '🏥';
  } else if (ind.includes('hotel') || ind.includes('boutique') || ind.includes('hosped')) {
    agente = 'Lucia'; tiktok = TIKTOK_MARY; precio = '$97/mes'; emoji = '🏨';
  } else if (ind.includes('taller') || ind.includes('mecani') || ind.includes('auto')) {
    agente = 'Carlos'; tiktok = TIKTOK_SOFIA; precio = '$97/mes'; emoji = '🚗';
  } else if (ind.includes('evento') || ind.includes('catering') || ind.includes('boda')) {
    agente = 'Valentina'; tiktok = TIKTOK_MARY; precio = '$97/mes'; emoji = '🎉';
  } else if (ind.includes('viaje') || ind.includes('turis') || ind.includes('agencia')) {
    agente = 'Camila'; tiktok = TIKTOK_MARY; precio = '$97/mes'; emoji = '✈️';
  } else if (ind.includes('barber') || ind.includes('peluc') || ind.includes('salon')) {
    agente = 'Mary'; tiktok = TIKTOK_MARY; precio = '$97/mes'; emoji = '💈';
  }

  const nombreMostrar = nombre || 'por ahí';
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
    <div style="background:#111827;padding:24px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="color:#fff;margin:0;font-size:22px">${emoji} A2K Digital Studio</h1>
      <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px">Recepcionistas IA para tu negocio</p>
    </div>
    <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none">
      <p style="font-size:16px">Hola${nombre ? ' ' + nombre : ''},</p>
      <p>Vi que te llegó nuestro correo. Quería escribirte personalmente para preguntarte: <strong>¿tuviste oportunidad de ver cómo funciona ${agente}?</strong></p>
      <p>Muchos dueños de negocios como tú me dicen lo mismo: <em>"Pierdo clientes porque no puedo contestar siempre."</em> ${agente} resuelve exactamente eso — atiende cada llamada, agenda citas y da información <strong>24/7 sin que tú hagas nada.</strong></p>
      <div style="background:#F0FDF4;border-left:4px solid #22C55E;padding:16px;margin:24px 0;border-radius:4px">
        <p style="margin:0;font-weight:bold;color:#15803D">¿Qué incluye tu suscripción?</p>
        <ul style="margin:8px 0 0;padding-left:20px;color:#333;font-size:14px">
          <li>Agente de voz IA personalizado para tu negocio</li>
          <li>Responde llamadas en español e inglés</li>
          <li>Agenda citas y envía confirmaciones por WhatsApp</li>
          <li>Configurado en 24 horas — sin contratos, cancelas cuando quieras</li>
          <li>Soporte directo conmigo (Abigail, A2K Digital Studio)</li>
        </ul>
      </div>
      <p style="font-size:15px;font-weight:bold;color:#111">Precio: ${precio} — sin sorpresas, sin letra pequeña.</p>
      ${demoBlockES(tiktok, agente)}
      <div style="text-align:center;margin:28px 0">
        <a href="https://wa.me/584164117331?text=Hola%20Abigail%2C%20me%20interesa%20el%20agente%20${agente}%20para%20mi%20negocio"
           style="background:#25D366;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block">
          💬 Quiero empezar — WhatsApp
        </a>
      </div>
      <p style="color:#888;font-size:13px;text-align:center">O responde este correo y con gusto te hago una demo gratis en vivo.</p>
    </div>
    <div style="background:#F9FAFB;padding:16px;text-align:center;border-radius:0 0 8px 8px;border:1px solid #eee;border-top:none">
      <p style="margin:0;font-size:12px;color:#999">A2K Digital Studio · Venezuela · <a href="${SHOWCASE_URL}" style="color:#6366F1">Ver todos los agentes</a></p>
    </div>
  </div>`;

  try {
    await enviarEmail(email, `${agente} está lista para tu negocio — demo gratis disponible`, html, 'Abigail — A2K Digital Studio');
    if (pageId) await actualizarProspecto(pageId, '🔥 Interesado', `Seguimiento enviado: ${new Date().toLocaleDateString()}`);
    res.json({ ok: true, agente, to: email });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Ver prospectos pendientes
app.get('/crm/pendientes', async (req, res) => {
  const data = await obtenerProspectos();
  res.json({ total: data.results?.length || 0, prospectos: (data.results || []).map(p => ({
    id: p.id,
    empresa: p.properties['Empresa']?.title?.[0]?.text?.content,
    email: p.properties['Email']?.email,
    estado: p.properties['Estado']?.select?.name,
    pais: p.properties['Pais']?.select?.name
  }))});
});

app.listen(PORT, () => console.log(`🚀 Recepcionista AI + CRM Email | Puerto ${PORT}`));
