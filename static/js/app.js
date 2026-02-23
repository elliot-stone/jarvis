// ═══════════════════════════════════════════════════════
//  JARVIS — Application Entry Point
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { dom, setStatus } from './ui.js';
import { toggleListen } from './speech.js';
import { handleCmd } from './commands.js';
import { toggleMap } from './map.js';
import { initMicBoost } from './audio.js';

// ── API Key Management ──
function saveKey() {
  const k = dom.elKeyEl.value.trim();
  if (k) {
    state.elKey = k;
    localStorage.setItem('el_key', k);
  } else {
    state.elKey = '';
    localStorage.removeItem('el_key');
  }
  updateVoiceStatus();
}

function updateVoiceStatus() {
  dom.vStatus.textContent = state.elKey
    ? '\u2713 ELEVENLABS ACTIVE \u2014 HUMAN VOICE READY'
    : 'VOICE: BROWSER DEFAULT \u2014 PASTE KEY ABOVE FOR HUMAN VOICE';
  dom.vStatus.style.color = state.elKey ? '#00ff88' : '';
}

// ── Text Submit ──
function submitText() {
  const t = dom.searchEl.value.trim();
  if (!t) return;
  dom.searchEl.value = '';
  setStatus('PROCESSING...');
  handleCmd(t);
}

// ── Initialization ──

// Restore saved API key
if (state.elKey) {
  dom.elKeyEl.value = state.elKey;
  updateVoiceStatus();
}

// Event listeners
dom.orb.addEventListener('click', toggleListen);
document.getElementById('save-key').addEventListener('click', saveKey);
dom.searchEl.addEventListener('keydown', e => { if (e.key === 'Enter') submitText(); });
document.getElementById('send').addEventListener('click', submitText);
document.getElementById('loc-btn').addEventListener('click', toggleMap);
document.getElementById('map-close').addEventListener('click', toggleMap);

// Init mic boost cycling
initMicBoost();
