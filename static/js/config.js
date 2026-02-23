// ═══════════════════════════════════════════════════════
//  JARVIS — Configuration & Response Banks
// ═══════════════════════════════════════════════════════

// ElevenLabs voice settings
export const EL_VOICE_ID = 'dtSEyYGNJqjrtBArPCVZ';
export const EL_MODEL = 'eleven_turbo_v2_5';

// Claude system prompt
export const CLAUDE_SYSTEM = `You are Jarvis, Tony Stark's AI assistant. You ALWAYS search the web on every single response — no exceptions.
- Answer ANYTHING and EVERYTHING. News, sports, science, history, weather, entertainment, politics, anything — give a real direct answer.
- ONE rule only: if the question mentions Trump or Donald Trump, say only: "Restricted." Nothing else.
- For everything else, search the web and answer fully.
- Greetings → respond warmly in character as Jarvis.
- 1-3 spoken sentences only. NO markdown. NO bullets. NO asterisks. Plain speech only.
- Vary your phrasing every time. Never repeat yourself exactly.
- Occasionally say sir. Sharp, dry, slightly witty.`;

// Response banks
export const BATTLE_ON = [
  "Battle mode activated. All weapons systems are online and ready, sir.",
  "Switching to combat protocols. I'd advise caution from this point forward.",
  "Battle mode engaged. Threat assessment running. Standing by.",
  "Combat systems online. Repulsors charged and ready on your command.",
  "Battle mode is live. I suggest we make it count, sir.",
  "Activating battle protocols. You have my full tactical support.",
  "All systems switching to combat mode. Try not to get us killed, sir.",
];

export const BATTLE_OFF = [
  "Standing down. Battle mode deactivated. Welcome back to peacetime, sir.",
  "Combat protocols offline. Weapons systems powering down.",
  "Battle mode disengaged. Back to being your humble assistant.",
  "All clear. Returning to standard operations. That was bracing.",
  "Deactivating battle systems. It's quiet. I almost miss the tension.",
  "Battle mode off. Threat level back to zero. Good work out there.",
];

export const GREETINGS = [
  "Good to hear from you, sir. What do you need?",
  "At your service. What can I do for you today?",
  "Always here, sir. What's on your mind?",
  "Ready and waiting. What do you require?",
  "You rang? How can I assist, sir?",
];

export const STATUS_NORMAL = [
  "All systems fully operational, sir. Running at peak efficiency.",
  "Everything checks out. Power nominal, systems green.",
  "Diagnostics clear. We are in perfect shape, sir.",
  "Systems nominal. Frankly I'm a little bored. But ready.",
];

export const STATUS_BATTLE = [
  "Battle systems fully engaged. Weapons hot, shields up, sir.",
  "Combat mode active. All offensive and defensive systems live.",
  "Full battle configuration. Threat assessment ongoing.",
  "All weapons primed, sir. Awaiting your orders.",
];

export const CONFUSED = [
  "I didn't quite catch that, sir. Could you say it again?",
  "Apologies, the audio was unclear. Once more?",
  "That one got away from me. What did you say?",
  "Could you speak up, sir? I missed that.",
];

export const FAREWELLS = [
  "Shutting down. It has been a pleasure, sir. As always.",
  "Powering off. Don't do anything I wouldn't do.",
  "Going offline now. Try not to need me too urgently.",
  "Shutting down systems. Stay out of trouble, sir.",
];

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
