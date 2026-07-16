FROM python:3.9.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements-2025.txt .
RUN pip install --no-cache-dir -r requirements-2025.txt

# Install gunicorn for production
RUN pip install gunicorn

# Copy application code
COPY src/ ./src/

WORKDIR /app/src

# Expose port
EXPOSE 5000

# Default command (can be overridden in docker-compose)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
