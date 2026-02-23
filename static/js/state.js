// ═══════════════════════════════════════════════════════
//  JARVIS — Shared Application State
// ═══════════════════════════════════════════════════════

export const state = {
  elKey: localStorage.getItem('el_key') || '',
  battle: false,
  listening: false,
  speaking: false,
  history: [],
  audioCtx: null,
  gainNode: null,
  analyser: null,
  currentAudio: null,

  // Map state
  map: null,
  marker: null,
  mapVisible: false,
  leafletLoaded: false,
};
