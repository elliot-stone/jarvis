# JARVIS

A voice-controlled AI assistant web app inspired by Iron Man's JARVIS. Speak commands or type queries — JARVIS responds with synthesized speech, searches the web via Claude, tracks your location on a map, and features a battle mode with a red combat HUD.

## Features

- **Voice control** — Chrome SpeechRecognition for hands-free interaction
- **AI responses** — Claude API with web search for real-time answers
- **Text-to-speech** — ElevenLabs streaming TTS with browser fallback
- **Battle mode** — Combat HUD theme with red UI and tactical responses
- **Location tracking** — Leaflet map with geolocation and reverse geocoding
- **Audio visualizer** — Real-time waveform and volume meter from mic input
- **Mic boost** — Click the waveform to cycle through boost levels (2x–16x)

## Quick Start

### Local Development

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Visit http://localhost:5000 in **Chrome** (required for voice commands).

### Docker

```bash
docker compose up --build
```

Visit http://localhost:5000

## Usage

1. Click the orb to activate voice listening
2. Speak commands or type in the search bar
3. Optionally paste an [ElevenLabs API key](https://elevenlabs.io/app/settings) for human-quality voice

### Voice Commands

| Command | Action |
|---|---|
| "Hello" / "Hey Jarvis" | Greeting response |
| "Battle mode on" | Activate combat HUD |
| "Battle mode off" | Deactivate combat HUD |
| "Status" / "Diagnostics" | System status report |
| "Time" | Current time |
| "Date" / "What day" | Current date |
| "Where am I" / "Show map" | Show location on map |
| "Shutdown" / "Goodbye" | Deactivate Jarvis |
| Anything else | Web search via Claude |

## API

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Serves the JARVIS frontend |
| `/api/hello` | GET | Returns `{"message": "Hello World"}` |

## Deploying to Raspberry Pi

### Prerequisites

- SSH access to the Pi (e.g. `ssh pi@pi`)
- Docker and Docker Compose installed on the Pi

### Setup Docker Context

Create a Docker context to deploy remotely over SSH (one-time setup):

```bash
docker context create pi --docker "host=ssh://pi@pi"
```

### Deploy

```bash
DOCKER_CONTEXT=pi docker compose up --build -d
```

### Manage

```bash
# View status
DOCKER_CONTEXT=pi docker compose ps

# View logs
DOCKER_CONTEXT=pi docker compose logs -f

# Stop
DOCKER_CONTEXT=pi docker compose down

# Redeploy after changes
DOCKER_CONTEXT=pi docker compose up --build -d
```

Visit `http://<pi-ip-address>:5000` to access the app.

The `python:3.11-slim` base image supports ARM architecture natively.

## Tech Stack

- **Backend:** Python 3.11, Flask, Gunicorn
- **Frontend:** Vanilla JavaScript (ES modules), HTML, CSS
- **APIs:** Claude (Anthropic), ElevenLabs TTS, OpenStreetMap/Nominatim
- **Deployment:** Docker with Compose
