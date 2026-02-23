// ═══════════════════════════════════════════════════════
//  JARVIS — Speech Recognition
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { setOrbState, setStatus } from './ui.js';
import { jarvisSpeak } from './tts.js';
import { startAudio } from './audio.js';
import { handleCmd } from './commands.js';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

let recog = null;
let recogActive = false;

function initRecog() {
  if (!SR) return;
  const thisRecog = new SR();
  recog = thisRecog;
  thisRecog.lang = 'en-US';
  thisRecog.continuous = true;
  thisRecog.interimResults = true;
  thisRecog.maxAlternatives = 1;

  // Each handler checks instance identity so that events from
  // a previously-aborted instance don't interfere with the current one.
  thisRecog.onresult = e => {
    if (recog !== thisRecog) return;
    const last = e.results[e.results.length - 1];
    if (!last.isFinal) return;
    const t = last[0].transcript.trim();
    if (t) { setStatus('PROCESSING...'); handleCmd(t); }
  };

  thisRecog.onerror = e => {
    if (recog !== thisRecog) return;
    recogActive = false;
    if (e.error !== 'no-speech' && !state.speaking) setTimeout(restartRecog, 400);
  };

  thisRecog.onend = () => {
    if (recog !== thisRecog) return;
    recogActive = false;
    if (state.listening && !state.speaking) setTimeout(restartRecog, 250);
  };
}

export function restartRecog() {
  if (recogActive || state.speaking || !state.listening) return;
  if (!SR) { setStatus('USE CHROME FOR VOICE'); return; }
  try {
    if (recog) { try { recog.abort(); } catch (e) { /* ignore */ } }
    initRecog();
    recog.start();
    recogActive = true;
    setOrbState('listening');
  } catch (e) {
    setTimeout(restartRecog, 700);
  }
}

export function stopListening() {
  state.listening = false;
  if (recog) { try { recog.abort(); } catch (e) { /* ignore */ } }
  recogActive = false;
  setOrbState('idle');
}

export async function toggleListen() {
  if (!state.listening) {
    state.listening = true;
    await startAudio();
    restartRecog();
    await jarvisSpeak('Jarvis online. All systems operational. Ready to assist, sir.');
  } else {
    stopListening();
    await jarvisSpeak('Going to standby, sir.');
  }
}
