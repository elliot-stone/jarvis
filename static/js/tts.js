// ═══════════════════════════════════════════════════════
//  JARVIS — Text-to-Speech (ElevenLabs + Browser Fallback)
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { EL_VOICE_ID, EL_MODEL } from './config.js';
import { setOrbState } from './ui.js';
import { restartRecog } from './speech.js';

// ElevenLabs TTS
export async function elSpeak(text) {
  if (!state.elKey) return false;
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE_ID}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': state.elKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: EL_MODEL,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.90,
            style: 0.20,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    return new Promise(resolve => {
      if (state.currentAudio) { state.currentAudio.pause(); state.currentAudio = null; }
      const audio = new Audio(url);
      state.currentAudio = audio;

      audio.onplay = () => { state.speaking = true; setOrbState('speaking'); };
      audio.onended = () => {
        state.speaking = false;
        URL.revokeObjectURL(url);
        state.currentAudio = null;
        setOrbState(state.listening ? 'listening' : 'idle');
        if (state.listening) restartRecog();
        resolve(true);
      };
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    });
  } catch (e) {
    return false;
  }
}

// Browser TTS fallback — picks clearest voice, slows it down
export function browserSpeak(text) {
  return new Promise(resolve => {
    speechSynthesis.cancel();
    const vv = speechSynthesis.getVoices();

    // Priority order — most natural voices
    const want = [
      'Google UK English Male',
      'Microsoft David - English (United States)',
      'Microsoft David Desktop',
      'Daniel',
      'Alex',
      'Google US English',
      'Fred',
    ];

    let voice = null;
    for (const n of want) {
      const v = vv.find(x => x.name.includes(n));
      if (v) { voice = v; break; }
    }

    // Avoid female / robotic fallback voices
    if (!voice) {
      voice = vv.find(v =>
        v.lang.startsWith('en') &&
        !v.name.toLowerCase().includes('female') &&
        !v.name.toLowerCase().includes('zira') &&
        !v.name.toLowerCase().includes('hazel')
      ) || vv[0];
    }

    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.rate = 0.82;
    u.pitch = 0.80;
    u.volume = 1;

    u.onstart = () => { state.speaking = true; setOrbState('speaking'); };
    u.onend = () => {
      state.speaking = false;
      setOrbState(state.listening ? 'listening' : 'idle');
      if (state.listening) restartRecog();
      resolve();
    };
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

// Pre-load voices
speechSynthesis.onvoiceschanged = () => {};

// Main speak — ElevenLabs first, browser fallback
export async function jarvisSpeak(text) {
  console.log('Jarvis:', text);
  const used = await elSpeak(text);
  if (!used) await browserSpeak(text);
}
