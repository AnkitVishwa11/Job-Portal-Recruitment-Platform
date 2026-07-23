# Job Portal - Deployment Guide

## Prerequisites

- Docker & Docker Compose (v3.8+)
- Node.js v18+ (for local development)
- MongoDB v7+ (for local development)
- Git
- Domain name (for production)
- SSL Certificate (for production)

## Environment Separation

### 1. Development Environment

```bash
# Local backend
cd backend
cp .env.example .env
npm install
npm run dev

# Local frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm start
```

### 2. Staging Environment

```bash
docker-compose -f docker-compose.staging.yml up -d --build
```

Access:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/api
- MongoDB: localhost:27018

### 3. Production Environment

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Access:
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:5000/api

## Docker Deployment Steps

### Build and Deploy

```bash
# Clone the repository
git clone <repository-url>
cd job-portal

# Create .env files from templates
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Modify secrets (use strong random strings)
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - COOKIE_SECRET

# Build and run
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Production Docker Compose

The production setup (`docker-compose.prod.yml`) includes:

- **MongoDB 7** with authentication
- **Backend API** on port 5000
- **Frontend** served via Nginx on port 80
- All services on a dedicated bridge network
- Persistent volumes for database and uploads
- Health checks for each service

## Server Requirements

### Minimum Specs
- 2 vCPU
- 4GB RAM
- 20GB SSD
- Ubuntu 22.04 LTS or similar

### Recommended Specs
- 4 vCPU
- 8GB RAM
- 50GB SSD
- Ubuntu 22.04 LTS

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | API server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://mongodb:27017/jobportal |
| JWT_SECRET | JWT signing secret | (required) |
| JWT_EXPIRE | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | (required) |
| JWT_REFRESH_EXPIRE | Refresh token expiry | 7d |
| COOKIE_SECRET | Cookie signing secret | (required) |
| CLIENT_URL | Frontend URL | http://localhost:3000 |
| MAX_FILE_SIZE | Max upload size (bytes) | 5242880 |
| UPLOAD_PATH | Upload directory | uploads |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | /api (proxied via nginx) |

## Security Checklist

- [ ] All secrets changed from defaults
- [ ] MongoDB authentication enabled
- [ ] HTTPS/SSL configured
- [ ] Rate limiting enabled (already configured)
- [ ] Helmet security headers (already configured)
- [ ] CORS restricted to domain
- [ ] File upload size limited (5MB)
- [ ] File types restricted (PDF/DOC/DOCX)
- [ ] Input sanitization active
- [ ] JWT tokens with short expiry (15 min)
- [ ] Refresh tokens stored securely (HTTP-only cookies)
- [ ] Logs rotated (max 10MB per file, 3 files)

## Scaling

### Horizontal Scaling
- Use a load balancer (Nginx, HAProxy, or Cloud Load Balancer)
- Deploy multiple backend instances
- Use MongoDB replica set or Atlas

### Vertical Scaling
- Increase server resources
- Add more RAM for MongoDB
- Use SSD for database storage

## Monitoring

### Recommended Tools
- PM2 (Process Manager)
- New Relic / Datadog
- MongoDB Atlas Monitoring
- Docker Stats

### Key Metrics
- API response time
- Error rate
- MongoDB connection pool
- CPU/Memory usage
- Disk space

## Backup Strategy

### Database Backup
```bash
# Backup
docker exec job-portal-mongodb mongodump --username admin --password <password> --out /backup/$(date +%Y%m%d)

# Restore
docker exec job-portal-mongodb mongorestore --username admin --password <password> /backup/20240101
```

### File Backup
```bash
# Uploads backup
docker run --rm -v uploads_data:/data -v $(pwd):/backup alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs automatically on push to main/develop:

1. **Backend**: Lint, test (Node 18 & 20), upload coverage
2. **Frontend**: Lint, test, build production bundle
3. **Docker**: Build and cache images

To enable, ensure GitHub Secrets are configured:
- `CODECOV_TOKEN` (for Codecov)
- Any other needed tokens

## Troubleshooting

### Common Issues

**Problem**: MongoDB connection refused
**Solution**: Check MongoDB is running: `docker ps | grep mongo`

**Problem**: File upload fails
**Solution**: Check `uploads/` directory permissions

**Problem**: JWT token invalid
**Solution**: Verify JWT_SECRET matches between sessions

**Problem**: CORS error
**Solution**: Check CLIENT_URL matches frontend origin

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```


