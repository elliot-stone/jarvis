// ═══════════════════════════════════════════════════════
//  JARVIS — Claude API Integration
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { CLAUDE_SYSTEM } from './config.js';
import { setStatus } from './ui.js';

export async function askClaude(text) {
  state.history.push({ role: 'user', content: text });
  if (state.history.length > 24) state.history = state.history.slice(-24);

  setStatus('SEARCHING WEB...');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 250,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: CLAUDE_SYSTEM + (state.battle ? ' Battle mode is ACTIVE.' : ' Battle mode is OFF.'),
        messages: state.history,
      }),
    });

    const data = await res.json();
    const reply = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join(' ')
      .trim() || "I wasn't able to pull that up, sir.";

    state.history.push({ role: 'assistant', content: reply });
    setStatus(state.listening ? 'LISTENING' : 'STANDBY');
    return reply;
  } catch (e) {
    setStatus('ERROR');
    return 'Search systems offline, sir.';
  }
}
