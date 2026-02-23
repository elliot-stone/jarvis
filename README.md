# Pi Test


A simple Python/Flask web application packaged as a Docker container for Raspberry Pi deployment. Serves an HTML page that calls a backend API returning "Hello World".

## Quick Start

### Local Development

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Visit http://localhost:5000

### Docker

```bash
docker compose up --build
```

Visit http://localhost:5000

## API

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Serves the HTML frontend |
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
