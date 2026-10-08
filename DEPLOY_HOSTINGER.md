# Hostinger VPS Production Deployment Guide
## বাংলা নিউজ পোর্টাল (Noya Bangla) — Next.js 14, PostgreSQL 16, Redis & Nginx

This guide walks you step-by-step through deploying the application onto a fresh **Hostinger KVM VPS** running **Ubuntu 22.04 or 24.04 LTS**.

---

## 🏗️ Architecture Overview

```text
  Internet Visitors & Googlebot
               │
               ▼  [Port 80 / 443 HTTPS]
        ┌─────────────┐
        │    Nginx    │  Reverse Proxy + SSL (Certbot) + Gzip + Cache
        └──────┬──────┘
               │  [Port 3000 (Internal)]
        ┌──────▼──────┐
        │     PM2     │  Next.js Cluster Mode (Node.js 20 LTS)
        └──────┬──────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌───────────┐     ┌───────────┐
│PostgreSQL │     │   Redis   │  (Docker Compose isolated network)
│  Port 5432│     │ Port 6379 │
└───────────┘     └───────────┘
```

---

## 📋 Prerequisites

1. **Hostinger VPS**: KVM 1 (minimum 4GB RAM recommended for Next.js build) or KVM 2+.
2. **Domain Name**: Point your domain `A` record (`@` and `www`) to your Hostinger VPS IP address:
   - `@` -> `YOUR_VPS_IP`
   - `www` -> `YOUR_VPS_IP`
3. **SSH Access**: Terminal access to your VPS (`ssh root@YOUR_VPS_IP`).

---

## 🚀 Step 1: Initial Server Setup & Package Installation

Log in to your Hostinger VPS via SSH and run:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git ufw build-essential libpq-dev
```

### Install Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v   # Should be v20.x.x
npm -v    # Should be v10.x.x

# Install PM2 globally
sudo npm install -g pm2
```

### Install Docker & Docker Compose
```bash
# Install Docker repository and engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker

# Verify Docker Compose
docker compose version
```

### Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 🛡️ Step 2: Configure UFW Firewall

Open only necessary ports:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 📂 Step 3: Clone Project & Prepare Directory

```bash
# Create web directory
sudo mkdir -p /var/www/bangla-news
sudo chown -R $USER:$USER /var/www/bangla-news

# Clone your repository
git clone <YOUR_GIT_REPO_URL> /var/www/bangla-news
cd /var/www/bangla-news

# Create uploads directory and logs directory
mkdir -p public/uploads logs
chmod -R 775 public/uploads
```

---

## ⚙️ Step 4: Configure Environment Variables

Create the production `.env` file from the example:

```bash
cp .env.example .env
nano .env
```

Ensure the following variables are configured for production:

```env
# Node Environment
NODE_ENV=production
PORT=3000

# Canonical Public App URL (Crucial for Google News & Discover SEO)
NEXT_PUBLIC_APP_URL=https://noyabangla.com.bd

# PostgreSQL Connection (Docker container network)
DATABASE_URL=postgresql://postgres:StrongProductionPassword123@127.0.0.1:5432/bangla_news

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Multi-tenant Default
DEFAULT_TENANT_SLUG=default
```

*(Press `Ctrl+O` then `Enter` to save, and `Ctrl+X` to exit nano)*.

> **Security Note:** If you changed the PostgreSQL password in `.env`, also match it in `docker-compose.yml`!

---

## 🐳 Step 5: Launch Database & Redis Stack

Start PostgreSQL 16 and Redis 7 in detached mode:

```bash
docker compose up -d

# Verify that containers are healthy
docker compose ps
```

---

## 📦 Step 6: Install Dependencies & Run Database Migration

```bash
# Install exact npm dependencies
npm ci

# Push database schema to PostgreSQL
npm run db:push
```

---

## 🔨 Step 7: Build Next.js Production Bundle

Run Next.js production build:

```bash
npm run build
```

*Verify that the build outputs all static and dynamic pages with 0 errors.*

---

## 🚀 Step 8: Start Application with PM2 Cluster

Start the Next.js process manager using `ecosystem.config.js`:

```bash
# Start cluster
pm2 start ecosystem.config.js

# Check status
pm2 status

# Save PM2 process list so it survives server reboots
pm2 save

# Setup PM2 startup hook on boot
pm2 startup
# (Run the generated sudo command shown in your terminal output)
```

---

## 🌐 Step 9: Configure Nginx & Let's Encrypt SSL

### 1. Copy Nginx Configuration
```bash
sudo cp /var/www/bangla-news/nginx.conf /etc/nginx/sites-available/bangla-news

# If your domain is not 'noyabangla.com.bd', edit it:
sudo nano /etc/nginx/sites-available/bangla-news
```

### 2. Enable Site & Test Syntax
```bash
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Enable bangla-news site
sudo ln -sf /etc/nginx/sites-available/bangla-news /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t
```

### 3. Obtain Free SSL Certificate via Certbot
```bash
sudo certbot --nginx -d noyabangla.com.bd -d www.noyabangla.com.bd
```
Follow the interactive prompts:
- Enter your email address.
- Accept terms of service.
- Certbot will automatically inject the certificate paths into your Nginx configuration.

### 4. Reload Nginx
```bash
sudo systemctl reload nginx
```

---

## 🔄 Step 10: Zero-Downtime Deployment Script (`deploy.sh`)

Create a quick deploy script for your future updates:

```bash
cat << 'EOF' > /var/www/bangla-news/deploy.sh
#!/bin/bash
set -e

echo "🚀 Starting Deployment..."
cd /var/www/bangla-news

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm ci

echo "🗄️ Syncing DB Schema..."
npm run db:push

echo "🔨 Building Next.js..."
npm run build

echo "🔄 Reloading PM2 Cluster..."
pm2 reload ecosystem.config.js

echo "✅ Deployment completed successfully!"
EOF

chmod +x /var/www/bangla-news/deploy.sh
```

Whenever you push new changes, just SSH in and run:
```bash
./deploy.sh
```

---

## 🩺 Helpful Health & Monitoring Commands

| Action | Command |
|---|---|
| View Next.js Live Logs | `pm2 logs bangla-news` |
| View Error Logs | `tail -n 100 /var/www/bangla-news/logs/pm2-error.log` |
| View Nginx Access Logs | `sudo tail -f /var_log/nginx/access.log` |
| Check DB Status | `docker compose ps` |
| Restart All Services | `pm2 restart all && sudo systemctl restart nginx` |
| Check Memory Usage | `free -h && pm2 monit` |

---

## 🔍 SEO & Google News Verification

Once deployed:
1. Visit `https://yourdomain.com/sitemap.xml` to verify the automated XML sitemap.
2. Visit `https://yourdomain.com/robots.txt` to verify crawler directives.
3. Test an article URL on **Google Rich Results Test** (`https://search.google.com/test/rich-results`) to confirm `NewsArticle` and `BreadcrumbList` schemas are detected and valid.
