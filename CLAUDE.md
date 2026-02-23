# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Python/Flask web application packaged as a Docker container for Raspberry Pi deployment.

## Architecture

- **`app.py`** — Flask app with two routes: `GET /` (serves HTML page) and `GET /api/hello` (returns JSON)
- **`templates/index.html`** — Frontend that fetches `/api/hello` and displays the message
- **`requirements.txt`** — Dependencies: Flask, Gunicorn
- **`Dockerfile`** — Based on `python:3.11-slim`, runs with Gunicorn on port 5000
- **`docker-compose.yml`** — Maps port 5000 for local dev and Pi deployment

## Development

- Run locally: `python app.py` (starts Flask dev server on port 5000)
- Run with Docker: `docker compose up --build`
- Test API: `curl http://localhost:5000/api/hello`

## Tech Stack

- Python 3.11, Flask 3.1, Gunicorn 23.0
- Docker with Compose
