// ═══════════════════════════════════════════════════════
//  JARVIS — DOM References & UI Helpers
// ═══════════════════════════════════════════════════════

import { state } from './state.js';

// DOM element references
export const dom = {
  orb: document.getElementById('orb'),
  statusEl: document.getElementById('status'),
  respEl: document.getElementById('resp'),
  waveCV: document.getElementById('wave'),
  volFill: document.getElementById('vol-fill'),
  searchEl: document.getElementById('search'),
  vStatus: document.getElementById('voice-status'),
  elKeyEl: document.getElementById('el-key'),
};

dom.waveCtx = dom.waveCV.getContext('2d');
dom.waveCV.width = 280;
dom.waveCV.height = 34;

// Orb visual state
export function setOrbState(s) {
  dom.orb.classList.remove('listening', 'speaking');
  if (s === 'listening') {
    dom.orb.textContent = '\u{1F399}';
    dom.orb.classList.add('listening');
    setStatus('LISTENING');
  } else if (s === 'speaking') {
    dom.orb.textContent = '\u{1F50A}';
    dom.orb.classList.add('speaking');
    setStatus('SPEAKING');
  } else {
    dom.orb.textContent = '\u{1F399}';
    setStatus('CLICK ORB TO ACTIVATE');
  }
}

// Status bar text
export function setStatus(s) {
  dom.statusEl.textContent = s;
}

// Response display with auto-hide
let respTimer = null;

export function showResp(text) {
  dom.respEl.textContent = text;
  dom.respEl.classList.add('show');
  clearTimeout(respTimer);
  respTimer = setTimeout(() => dom.respEl.classList.remove('show'), 13000);
}

// Theme color helper
export function getColor() {
  return state.battle ? '#ff2020' : '#00d4ff';
}
