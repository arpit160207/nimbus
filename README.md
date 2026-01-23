# Nimbus Cloud Drive ☁️

A modern, secure, and beautiful Personal Cloud Storage system built with **React** and **FastAPI**, backed by **AWS S3**.

## Features

- **Store Anything**: S3-backed storage for Photos, Documents, and more.
- **Secure**: JWT Authentication (Login/Signup).
- **Auto-Categorization**: Automatically sorts uploads into folders.
- **Advanced UI**: Dark Mode, Glassmorphism design, and Particle effects.
- **Smart**: Search, Image Previews, and Real-time Storage Stats.
- **Interactive**: Drag & Drop multi-file uploads.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, tsparticles.
- **Backend**: Python FastAPI, Boto3 (AWS SDK).
- **Storage**: AWS S3.

## Quick Start (Local)

### Prerequisites
- Node.js & npm
- Python 3.9+
- AWS Credentials (S3 Bucket)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Update backend/core/config.py with your AWS keys if not set via ENV
uvicorn backend.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.
**Demo Credentials**: `user@example.com` / `secret`

## Deployment (Docker)

Run the entire stack with a single command:

```bash
docker-compose up --build -d
```
The app will be available at `http://localhost`.

## Configuration

Edit `backend/core/config.py` or use Environment Variables:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`
- `AWS_REGION`
