# 🚀 Smart Cooking AI - Deployment Guide

## 🌍 Deployment Overview

Smart Cooking AI supports multiple deployment strategies from local development to production-ready cloud deployments.

## 🏠 Local Development Deployment

### 📋 Prerequisites

```bash
# Required software versions
- Node.js 18+ và npm 9+
- Java 17+ và Maven 3.8+
- Python 3.9+ và pip
- Docker Desktop 4.0+
- MySQL 8.0+ hoặc Docker MySQL
- Redis 6.0+ hoặc Docker Redis
```

### 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/SmartCookingAI_2.git
cd SmartCookingAI_2

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# 3. Start with Docker Compose
docker-compose up -d

# 4. Access applications
# - Backend API: http://localhost:8080
# - AI Service: http://localhost:8001
# - Frontend Web: http://localhost:3000
# - Database: localhost:3306
```

### 🐳 Individual Service Development

```bash
# Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080

# AI Service (FastAPI)
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
# Runs on http://localhost:8001

# Frontend (Next.js)
cd frontend-nextjs
npm install
npm run dev
# Runs on http://localhost:3000

# Mobile App (Flutter)
cd mobile-app
flutter pub get
flutter run
# Runs on connected device/emulator
```

## ☁️ Cloud Deployment Options

### 🔵 Azure Deployment (Recommended)

#### 📦 Azure Container Apps

```yaml
# azure-container-apps.yml
apiVersion: v2
metadata:
  name: smart-cooking-ai
  resourceGroup: smart-cooking-rg

services:
  backend:
    image: smartcookingai/backend:latest
    port: 8080
    env:
      - DATABASE_URL: ${AZURE_MYSQL_URL}
      - REDIS_URL: ${AZURE_REDIS_URL}
    replicas: 3

  ai-service:
    image: smartcookingai/ai-service:latest
    port: 8001
    env:
      - OPENAI_API_KEY: ${OPENAI_API_KEY}
      - GEMINI_API_KEY: ${GEMINI_API_KEY}
    replicas: 2

  frontend:
    image: smartcookingai/frontend:latest
    port: 3000
    env:
      - NEXT_PUBLIC_API_URL: https://api.smartcookingai.com
    replicas: 2
```

#### 🗄️ Azure Database Setup

```bash
# Create Azure MySQL Flexible Server
az mysql flexible-server create \
  --resource-group smart-cooking-rg \
  --name smartcooking-db \
  --admin-user smartcookingadmin \
  --admin-password SecurePassword123! \
  --sku-name Standard_B2s \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 20 \
  --version 8.0

# Create Redis Cache
az redis create \
  --resource-group smart-cooking-rg \
  --name smartcooking-redis \
  --location eastus \
  --sku Basic \
  --vm-size c0
```

### 🟠 AWS Deployment

#### 🚢 ECS with Fargate

```json
{
  "family": "smart-cooking-ai",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "smartcookingai/backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "${RDS_ENDPOINT}"
        }
      ]
    }
  ]
}
```

#### 🗄️ AWS RDS & ElastiCache

```bash
# Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier smartcooking-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username smartcookingadmin \
  --master-user-password SecurePassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678

# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id smartcooking-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### 🟢 Google Cloud Platform (GCP)

#### ☸️ Google Kubernetes Engine (GKE)

```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smart-cooking-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smart-cooking-backend
  template:
    metadata:
      labels:
        app: smart-cooking-backend
    spec:
      containers:
        - name: backend
          image: gcr.io/smart-cooking-ai/backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
---
apiVersion: v1
kind: Service
metadata:
  name: smart-cooking-backend-service
spec:
  selector:
    app: smart-cooking-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

## 🐳 Docker Production Setup

### 📦 Multi-stage Docker Builds

```dockerfile
# backend/Dockerfile.prod
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appuser /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
```

```dockerfile
# frontend-nextjs/Dockerfile.prod
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

### 🔧 Production Docker Compose

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - DATABASE_URL=jdbc:mysql://db:3306/smartcooking
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend-nextjs
      dockerfile: Dockerfile.prod
    environment:
      - NEXT_PUBLIC_API_URL=https://api.smartcookingai.com
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=smartcooking
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mysql_data:
```

## 🌐 CDN & Static Assets

### 📦 Firebase Storage Setup

```typescript
// firebase-config.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "smartcooking-ai.firebaseapp.com",
  projectId: "smartcooking-ai",
  storageBucket: "smartcooking-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

### 🚀 CloudFront Distribution

```json
{
  "DistributionConfig": {
    "CallerReference": "smart-cooking-ai-cdn",
    "DefaultCacheBehavior": {
      "TargetOriginId": "smart-cooking-origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "managed-caching-optimized",
      "OriginRequestPolicyId": "managed-cors-s3-origin"
    },
    "Origins": {
      "Items": [
        {
          "Id": "smart-cooking-origin",
          "DomainName": "smartcookingai.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "Enabled": true,
    "Comment": "Smart Cooking AI CDN"
  }
}
```

## 🔒 SSL/TLS Configuration

### 📜 Let's Encrypt Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificates
sudo certbot --nginx -d smartcookingai.com -d www.smartcookingai.com -d api.smartcookingai.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 🌐 Nginx SSL Configuration

```nginx
# nginx/ssl.conf
server {
    listen 443 ssl http2;
    server_name smartcookingai.com www.smartcookingai.com;

    ssl_certificate /etc/letsencrypt/live/smartcookingai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smartcookingai.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Logging

### 📈 Prometheus + Grafana

```yaml
# monitoring/docker-compose.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  grafana_data:
```

### 📋 ELK Stack Logging

```yaml
# logging/docker-compose.yml
version: "3.8"

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config:/usr/share/logstash/config
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
```

## 🚀 CI/CD Pipeline

### 🔄 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: "17"
          distribution: "temurin"

      - name: Run Backend Tests
        run: |
          cd backend
          ./mvnw test

      - name: Run Frontend Tests
        run: |
          cd frontend-nextjs
          npm ci
          npm run test

      - name: Run AI Service Tests
        run: |
          cd ai-service
          pip install -r requirements.txt
          pytest

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Images
        run: |
          docker build -t smartcookingai/backend:${{ github.sha }} ./backend
          docker build -t smartcookingai/frontend:${{ github.sha }} ./frontend-nextjs
          docker build -t smartcookingai/ai-service:${{ github.sha }} ./ai-service

      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push smartcookingai/backend:${{ github.sha }}
          docker push smartcookingai/frontend:${{ github.sha }}
          docker push smartcookingai/ai-service:${{ github.sha }}

      - name: Deploy to Production
        uses: azure/webapps-deploy@v2
        with:
          app-name: "smart-cooking-ai"
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

## 📱 Mobile App Deployment

### 🤖 Android Play Store

```bash
# Build signed APK
cd mobile-app
flutter build apk --release

# Build AAB for Play Store
flutter build appbundle --release

# Upload to Play Console
# Use Google Play Console or fastlane
```

### 🍎 iOS App Store

```bash
# Build for iOS
cd mobile-app
flutter build ios --release

# Archive and upload to App Store Connect
# Use Xcode or fastlane
```

### 🔄 Fastlane Setup

```ruby
# mobile-app/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Deploy to Google Play Store"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store(
      track: 'production',
      apk: '../build/app/outputs/flutter-apk/app-release.apk'
    )
  end
end

platform :ios do
  desc "Deploy to App Store"
  lane :deploy do
    build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
    upload_to_app_store
  end
end
```

## 🔧 Environment Configuration

### 🌍 Environment Variables

```bash
# Production environment variables
DATABASE_URL=jdbc:mysql://prod-db:3306/smartcooking
REDIS_URL=redis://prod-redis:6379
OPENAI_API_KEY=sk-prod-key-here
GEMINI_API_KEY=prod-gemini-key-here
JWT_SECRET=super-secure-jwt-secret-256-bits-long
GOOGLE_CLIENT_ID=prod-google-client-id
GOOGLE_CLIENT_SECRET=prod-google-client-secret
FIREBASE_API_KEY=prod-firebase-api-key
NEXT_PUBLIC_API_URL=https://api.smartcookingai.com
```

### 🔒 Secrets Management

```yaml
# Kubernetes secrets
apiVersion: v1
kind: Secret
metadata:
  name: smart-cooking-secrets
type: Opaque
data:
  database-url: <base64-encoded-db-url>
  openai-api-key: <base64-encoded-api-key>
  jwt-secret: <base64-encoded-jwt-secret>
```

## 📋 Pre-deployment Checklist

### ✅ Security Checklist

- [ ] All API keys in environment variables
- [ ] SSL certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection enabled

### ✅ Performance Checklist

- [ ] Database indexes optimized
- [ ] Redis caching configured
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Database connection pooling
- [ ] Monitoring setup

### ✅ Reliability Checklist

- [ ] Health checks configured
- [ ] Auto-scaling rules
- [ ] Backup strategy implemented
- [ ] Error logging setup
- [ ] Rollback procedure documented
- [ ] Load testing completed
- [ ] Disaster recovery plan

## 🆘 Troubleshooting

### 🐛 Common Issues

#### Database Connection Issues

```bash
# Check database connectivity
docker exec -it mysql_container mysql -u root -p
SHOW DATABASES;
USE smartcooking;
SHOW TABLES;
```

#### Memory Issues

```bash
# Monitor container resources
docker stats

# Increase Java heap size
export JAVA_OPTS="-Xms512m -Xmx2g"
```

#### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/domain/cert.pem -text -noout

# Renew certificates
sudo certbot renew --dry-run
```

### 📞 Support Contacts

- **Technical Support**: tech@smartcookingai.com
- **Infrastructure**: devops@smartcookingai.com
- **Security Issues**: security@smartcookingai.com

---

**🚀 Deployment Success**: Following this guide will ensure a reliable, secure, and scalable deployment of Smart Cooking AI!
