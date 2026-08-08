# GoldPay ERP - Deployment Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

## Local Development Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd goldpay-erp
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 3. Setup Database
```bash
# Push schema to database
npx prisma db push

# Or use migrations
npx prisma migrate dev --name init

# Seed demo data
npm run db:seed
```

### 4. Start Development
```bash
npm run dev
# Visit http://localhost:3000
# Login: admin@goldpay.com / Admin@123
```

## Docker Deployment

### Using Docker Compose
```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Run migrations
docker-compose exec app npx prisma db push

# Seed data
docker-compose exec app npm run db:seed
```

### Production with Docker
```bash
# Build production image
docker build -f docker/Dockerfile -t goldpay-erp:latest .

# Run with PostgreSQL and Redis
docker run -d --name goldpay-postgres -e POSTGRES_USER=goldpay_user -e POSTGRES_PASSWORD=goldpay_password -e POSTGRES_DB=goldpay_erp postgres:16-alpine
docker run -d --name goldpay-redis redis:7-alpine
docker run -d --name goldpay-app -p 3000:3000 --link goldpay-postgres --link goldpay-redis goldpay-erp:latest
```

## Manual Deployment (VPS/Linux)

### 1. Install Dependencies
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Redis
sudo apt-get install -y redis-server

# Nginx
sudo apt-get install -y nginx
```

### 2. Setup Application
```bash
git clone <repo-url> /var/www/goldpay
cd /var/www/goldpay
npm ci --production
npx prisma generate
npm run build
```

### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name goldpay.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Setup PM2
```bash
npm install -g pm2
pm2 start npm --name "goldpay" -- start
pm2 save
pm2 startup
```

### 5. SSL with Certbot
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d goldpay.yourdomain.com
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| REDIS_URL | Redis connection string | Yes |
| NEXTAUTH_SECRET | Random 32+ char secret | Yes |
| JWT_SECRET | Random 32+ char secret | Yes |
| CLOUDINARY_* | Cloudinary credentials | For media uploads |
| AWS_* | AWS credentials | Alternative to Cloudinary |
| SMTP_* | Email configuration | For notifications |

## Database Backups

### Automatic (via cron)
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /var/www/goldpay && npm run backup >> /var/log/goldpay-backup.log 2>&1
```

### Manual
```bash
# Via web interface (Admin > Settings)
# Or via CLI
npm run backup
```

## Monitoring
- Application logs: `pm2 logs goldpay`
- System logs: `journalctl -u goldpay`
- Database: `pg_stat_activity`
- Redis: `redis-cli monitor`

## Scaling
- Horizontal scaling: Deploy multiple instances behind Nginx load balancer
- Database: Use connection pooling (PgBouncer)
- Cache: Redis cluster for high availability
- Static assets: CDN for images
