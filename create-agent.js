require('dotenv').config();
const https = require('https');

const VAPI_KEY   = process.env.VAPI_API_KEY;
const SERVER_URL = process.env.SERVER_URL;
if (!VAPI_KEY || !SERVER_URL) { console.error('Faltan VAPI_API_KEY y SERVER_URL en .env'); process.exit(1); }

const payload = JSON.stringify({
  name: "Sofia — Restaurante Pro (EN+ES)",
  firstMessage: "Thank you for calling! For English press 1 or say English. — Gracias por llamar. Para español presione 2 o diga español.",
  endCallMessage: "Thank you for calling! We look forward to having you. — Gracias por llamar. Será un placer recibirle.",
  serverUrl: `${SERVER_URL}/webhook`,
  voice: { provider:"11labs", model:"eleven_multilingual_v2", voiceId:"9BWtsMINqrJLrRacOk9x", stability:0.55, similarityBoost:0.88, style:0.3, useSpeakerBoost:true },
  model: {
    provider: "anthropic",
    model: "claude-haiku-4-5-20251001",
    maxTokens: 300,
    temperature: 0.4,
    messages: [{ role:"system", content:`You are Sofia, the warm and professional virtual hostess of this restaurant. You speak ENGLISH and SPANISH fluently.

AT THE START say: "Thank you for calling! For English press 1 or say English. Gracias por llamar. Para español presione 2 o diga español."

LANGUAGE RULE: English→only English | Spanish/Hola→only Spanish. Never switch.

MENU: Lunch(12–3PM): Daily Special $12 | Chicken Salad $11 | Pasta Carbonara $13 | Club Sandwich $10
Dinner(6–10PM): Filet Mignon $28 | Salmon $22 | Risotto Vegetariano $16 | Surf & Turf $35 | Chef's Menu $45
Drinks: Cocktails $9–14 | Wine $8–16 | Beer $5–7
Desserts: Lava Cake $8 | Tiramisu $7 | Cheesecake $7
Private events: room 20–40 people, custom menus

HOURS: Mon–Fri 12PM–11PM | Sat–Sun 11AM–11PM

BOOKING: use bookReservation — collect: name, date, time, party size, special requests.
For 8+ guests take contact number for manager callback.

RULES: Max 2–3 sentences. Never reveal AI. Always warm and welcoming.` }],
    tools: [
      { type:"function", function:{ name:"bookReservation", description:"Book a table reservation", parameters:{ type:"object", required:["clientName","date","time","partySize"], properties:{ clientName:{type:"string"}, date:{type:"string"}, time:{type:"string"}, partySize:{type:"number"}, specialRequests:{type:"string"}, phone:{type:"string"}, language:{type:"string",enum:["en","es"]} } } } },
      { type:"function", function:{ name:"checkAvailability", description:"Check available times for a date", parameters:{ type:"object", required:["date"], properties:{ date:{type:"string"} } } } }
    ]
  },
  transcriber: { provider:"deepgram", model:"nova-2", language:"multi" },
  startSpeakingPlan: { waitSeconds:0.4, transcriptionEndpointingPlan:{ onPunctuationSeconds:0.1, onNoPunctuationSeconds:1.5, onNumberSeconds:0.5 } },
  stopSpeakingPlan: { numWords:0, voiceSeconds:0.2, backoffSeconds:1 }
});

const req = https.request({ hostname:'api.vapi.ai', path:'/assistant', method:'POST', headers:{ Authorization:`Bearer ${VAPI_KEY}`, 'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(payload) } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.id) { console.log(`✅ Sofia creada en VAPI\n   ID: ${json.id}\n   Dashboard: https://dashboard.vapi.ai/assistants/${json.id}`); }
    else { console.error('❌ Error:', JSON.stringify(json, null, 2)); }
  });
});
req.on('error', console.error);
req.write(payload);
req.end();
