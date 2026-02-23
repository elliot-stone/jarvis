// ═══════════════════════════════════════════════════════
//  JARVIS — Web Audio (Mic Boost, Waveform, Volume Meter)
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { dom, setStatus, getColor } from './ui.js';

// Start mic audio pipeline (no output to speakers — prevents feedback)
export async function startAudio() {
  if (state.audioCtx) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
    });

    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = state.audioCtx.createMediaStreamSource(stream);

    state.gainNode = state.audioCtx.createGain();
    state.gainNode.gain.value = 8.0;

    state.analyser = state.audioCtx.createAnalyser();
    state.analyser.fftSize = 256;

    // mic → boost → analyser (no speaker output)
    source.connect(state.gainNode);
    state.gainNode.connect(state.analyser);

    drawWave();
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Waveform + volume meter rendering loop
function drawWave() {
  if (!state.analyser) return;
  requestAnimationFrame(drawWave);

  const buf = new Uint8Array(state.analyser.frequencyBinCount);
  const c = getColor();

  // Draw waveform
  state.analyser.getByteTimeDomainData(buf);
  dom.waveCtx.clearRect(0, 0, 280, 34);
  dom.waveCtx.strokeStyle = c;
  dom.waveCtx.lineWidth = 1.8;
  dom.waveCtx.shadowBlur = 7;
  dom.waveCtx.shadowColor = c;
  dom.waveCtx.beginPath();
  buf.forEach((v, i) => {
    const x = i * (280 / buf.length);
    const y = ((v / 128) - 1) * 13 + 17;
    i === 0 ? dom.waveCtx.moveTo(x, y) : dom.waveCtx.lineTo(x, y);
  });
  dom.waveCtx.stroke();

  // Update volume bar
  state.analyser.getByteFrequencyData(buf);
  const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
  const pct = Math.min(100, (avg / 128) * 180);
  dom.volFill.style.width = pct + '%';
  dom.volFill.style.background = pct > 70 ? '#ff4400' : c;
}

// Mic boost cycling (click waveform to adjust)
const GAINS = [2, 4, 6, 8, 12, 16];
let gainIdx = 3;

export function initMicBoost() {
  dom.waveCV.addEventListener('click', () => {
    gainIdx = (gainIdx + 1) % GAINS.length;
    if (state.gainNode) state.gainNode.gain.value = GAINS[gainIdx];
    setStatus(`MIC BOOST: ${GAINS[gainIdx]}x \u2014 CLICK AGAIN TO ADJUST`);
    setTimeout(() => setStatus(state.listening ? 'LISTENING' : 'STANDBY'), 2000);
  });
}
