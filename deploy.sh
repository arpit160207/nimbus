#!/bin/bash

# Nimbus Cloud Drive - Deployment Script for Amazon Linux 2023

echo "🚀 Starting Deployment..."

# 1. Update System
echo "📦 Updating system packages..."
sudo dnf update -y

# 2. Install Git
echo "📦 Installing Git..."
sudo dnf install git -y

# 3. Install Docker
echo "📦 Installing Docker..."
sudo dnf install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# 4. Install Docker Compose
echo "📦 Installing Docker Compose..."
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

# 5. Build and Run
echo "🚀 Building and Running Containers..."
# Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️  WARNING: .env file not found! Copying .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your actual secrets."
fi

docker compose up -d --build

echo "✅ Deployment Complete!"
echo "➡️  Frontend: http://$(curl -s http://checkip.amazonaws.com)"
echo "➡️  Backend:  http://$(curl -s http://checkip.amazonaws.com)/api/v1"
