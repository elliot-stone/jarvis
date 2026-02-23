// ═══════════════════════════════════════════════════════
//  JARVIS — Command Handler
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { pick, BATTLE_ON, BATTLE_OFF, GREETINGS, STATUS_NORMAL, STATUS_BATTLE, FAREWELLS } from './config.js';
import { showResp } from './ui.js';
import { jarvisSpeak } from './tts.js';
import { askClaude } from './api.js';
import { toggleMap, initMap } from './map.js';
import { stopListening } from './speech.js';

export async function handleCmd(cmd) {
  if (state.speaking) return;
  const c = cmd.toLowerCase();
  let reply = '';

  // Location commands
  if (/where am i|my location|show map|show location|locate me|find me|gps|coordinates/.test(c)) {
    if (!state.mapVisible) toggleMap();
    else initMap();
    return;
  }

  if (/battle mode on|activate battle|engage battle|battle on|combat mode on/.test(c)) {
    state.battle = true;
    document.body.classList.add('battle');
    reply = pick(BATTLE_ON);

  } else if (/battle mode off|deactivate battle|stand down|battle off|combat off/.test(c)) {
    state.battle = false;
    document.body.classList.remove('battle');
    reply = pick(BATTLE_OFF);

  } else if (/^(hello|hey|hi jarvis|good morning|good evening|good afternoon)/.test(c)) {
    reply = pick(GREETINGS);

  } else if (/status|how are you|diagnostics|systems check/.test(c)) {
    reply = pick(state.battle ? STATUS_BATTLE : STATUS_NORMAL);

  } else if (/\btime\b/.test(c)) {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    reply = pick([
      `It is currently ${t}, sir.`,
      `The time is ${t}.`,
      `My clock reads ${t}, sir.`,
      `According to my systems, it is ${t}.`,
    ]);

  } else if (/\bdate\b|today|what day/.test(c)) {
    const d = new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    reply = pick([`Today is ${d}, sir.`, `My calendar shows ${d}.`, `It is ${d}.`]);

  } else if (/shutdown|power off|shut down|goodbye|bye jarvis/.test(c)) {
    reply = pick(FAREWELLS);
    showResp(reply);
    await jarvisSpeak(reply);
    setTimeout(() => stopListening(), 200);
    return;

  } else if (/\btrump\b/.test(c)) {
    reply = 'Restricted.';

  } else {
    showResp('\u{1F50D} Searching...');
    reply = await askClaude(cmd);
  }

  showResp(reply);
  await jarvisSpeak(reply);
}
