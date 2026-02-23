# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JARVIS — a voice-controlled AI assistant web app inspired by Iron Man's JARVIS. Built with Python/Flask on the backend and vanilla JavaScript ES modules on the frontend. Packaged as a Docker container for Raspberry Pi deployment.

## Architecture

### Backend
- **`app.py`** — Flask app with two routes: `GET /` (serves HTML) and `GET /api/hello` (returns JSON)
- **`requirements.txt`** — Dependencies: Flask, Gunicorn
- **`Dockerfile`** — Based on `python:3.11-slim`, runs with Gunicorn on port 5000
- **`docker-compose.yml`** — Maps port 5000 for local dev and Pi deployment

### Frontend (`templates/` + `static/`)
- **`templates/index.html`** — Clean HTML template (Jinja2), loads CSS and JS module entry point
- **`static/css/styles.css`** — All styles including battle mode theme, orb animations, map panel
- **`static/js/app.js`** — Entry point: API key management, event listeners, initialization
- **`static/js/state.js`** — Shared application state object (imported by all modules)
- **`static/js/config.js`** — Constants: ElevenLabs voice settings, Claude system prompt, response banks
- **`static/js/ui.js`** — DOM references (`dom` object), `setOrbState()`, `setStatus()`, `showResp()`
- **`static/js/speech.js`** — Chrome SpeechRecognition: init, restart, stop, toggle listening
- **`static/js/tts.js`** — Text-to-speech: ElevenLabs streaming API with browser TTS fallback
- **`static/js/commands.js`** — Command handler: battle mode, greetings, time/date, shutdown, Claude fallback
- **`static/js/api.js`** — Claude API integration with web search tool, conversation history
- **`static/js/audio.js`** — Web Audio: mic input via getUserMedia, waveform visualizer, volume meter, mic boost
- **`static/js/map.js`** — Leaflet map, geolocation, reverse geocoding via Nominatim

### Key Dependencies (frontend, loaded via CDN/browser APIs)
- Chrome Web Speech API (SpeechRecognition)
- ElevenLabs TTS API (optional, requires API key)
- Claude API (Anthropic) with web search
- Leaflet.js for maps
- OpenStreetMap / Nominatim for geocoding

## Development

- Run locally: `python app.py` (starts Flask dev server on port 5000)
- Run with Docker: `docker compose up --build`
- Frontend uses ES modules (`<script type="module">`) — no build step needed
- Browser caching: use Ctrl+Shift+R to force-reload static JS files during development
- Chrome is required for voice commands (SpeechRecognition API)
- Only one browser tab can use SpeechRecognition at a time

## Module Dependency Graph

```
app.js (entry point)
  ├── state.js
  ├── ui.js ← state
  ├── speech.js ← state, ui, tts, audio, commands
  ├── commands.js ← state, config, ui, tts, api, map, speech
  ├── audio.js ← state, ui
  └── map.js ← state, ui, tts

tts.js ← state, config, ui, speech (circular with speech.js — resolved via function hoisting)
```

## Tech Stack

- Python 3.11, Flask 3.1, Gunicorn 23.0
- Vanilla JavaScript (ES modules, no framework, no build step)
- Docker with Compose
