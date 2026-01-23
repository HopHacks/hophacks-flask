# Docker Setup Guide

This guide explains how to run the HopHacks application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## Quick Start

1. **Configure the backend** (first time only):
   ```bash
   cd api/src/config
   python config.py dev
   ```
   This will create a `config.json` file. When prompted:
   - Use default MongoDB URI: `mongodb://localhost:27017` (or `mongodb://mongodb:27017` for Docker)
   - Leave mail settings empty for local development
   - Set up an admin account

2. **Update MongoDB URI in config.json** (if using Docker):
   Open `api/src/config/config.json` and change:
   ```json
   "MONGO_URI": "mongodb://mongodb:27017"
   ```
   This uses the MongoDB service name from docker-compose instead of `localhost`.

3. **Start all services**:
   ```bash
   docker-compose up
   ```
   Or run in detached mode:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Services

The docker-compose setup includes three services:

- **mongodb**: MongoDB database server
- **backend**: Flask API server
- **frontend**: React development server

## Useful Commands

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (clears database)
```bash
docker-compose down -v
```

### Rebuild containers after code changes
```bash
docker-compose up --build
```

### Execute commands in containers
```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh
```

## Development Workflow

The setup uses volume mounts for live code reloading:
- Backend code changes in `api/src/` will auto-reload (if using Flask's debug mode)
- Frontend code changes in `frontend/` will hot-reload in the browser

## Production Considerations

For production deployment, you'll want to:
1. Use production Dockerfiles (build frontend, serve static files)
2. Use environment variables instead of config.json
3. Set up proper secrets management
4. Use a production WSGI server (gunicorn) for the backend
5. Configure proper CORS settings
6. Set up reverse proxy (nginx) for serving frontend and proxying API

## Troubleshooting

### MongoDB connection issues
- Ensure the `MONGO_URI` in `config.json` uses `mongodb://mongodb:27017` (service name) not `localhost`
- Check that MongoDB container is running: `docker-compose ps`

### Port conflicts
- If ports 3000, 5000, or 27017 are already in use, modify the port mappings in `docker-compose.yml`

### Permission issues
- On Linux, you may need to adjust file permissions for volume mounts
