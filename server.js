// ══════════════════════════════════════════════════════════
// SOFIA — Recepcionista AI para Restaurantes
// A2K Digital Studio | VAPI + Claude + ElevenLabs
// ══════════════════════════════════════════════════════════
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const reservations = [];
let counter = 1000;

app.get('/', (_req, res) => res.json({
  agent: 'Sofia — Restaurante Pro',
  status: 'online',
  by: 'A2K Digital Studio',
  reservations: reservations.length
}));

app.post('/webhook', (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ result: 'ok' });

  if (message.type === 'function-call') {
    const fn     = message.functionCall?.name;
    const params = message.functionCall?.parameters || {};
    console.log(`[SOFIA][FUNCTION] ${fn}`, params);

    if (fn === 'bookReservation') {
      const id = `REST-${++counter}`;
      reservations.push({ id, createdAt: new Date().toISOString(), ...params });
      console.log(`[RESERVA] ${id}`);
      const es = params.language === 'es';
      return res.json({
        result: es
          ? `¡Perfecto! Tu reservación está confirmada con el número ${id}. Te esperamos con mucho gusto.`
          : `Perfect! Your reservation is confirmed with reference ${id}. We look forward to having you!`
      });
    }

    if (fn === 'checkAvailability') {
      return res.json({ result: `Available times on ${params.date}: 1:00 PM, 2:30 PM, 7:00 PM, 8:30 PM` });
    }
  }

  if (message.type === 'end-of-call-report') {
    console.log(`[SOFIA][CALL ENDED] Duration: ${message.durationSeconds}s`);
  }

  return res.json({ result: 'ok' });
});

app.get('/reservations', (_req, res) => res.json({ total: reservations.length, reservations }));

app.listen(PORT, () => console.log(`✅ Sofia (Restaurante) online — puerto ${PORT}`));
