# Kube Credential System

A microservice-based credential issuance and verification system built with Node.js, TypeScript, React, and Kubernetes.

## Architecture Overview

This system consists of two independent microservices:

1. **Issuance Service** - Issues new credentials and prevents duplicates
2. **Verification Service** - Verifies if credentials have been issued

Each service runs as a separate Kubernetes deployment with its own persistence layer and can be scaled independently.

## Project Structure

```
kube-credential/
├── Backend/
│   ├── issuance-service/          # Credential issuance microservice
│   │   ├── src/
│   │   │   ├── index.ts           # Express server setup
│   │   │   ├── db.ts              # SQLite database operations
│   │   │   └── routes.ts          # API routes
│   │   ├── tests/                 # Unit tests
│   │   ├── Dockerfile             # Container configuration
│   │   └── package.json
│   └── verification-service/      # Credential verification microservice
│       ├── src/
│       │   ├── index.ts           # Express server setup
│       │   ├── db.ts              # SQLite database operations
│       │   └── routes.ts          # API routes
│       ├── tests/                 # Unit tests
│       ├── Dockerfile             # Container configuration
│       └── package.json
├── frontend/                      # React TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Issue.tsx          # Credential issuance page
│   │   │   └── Verify.tsx         # Credential verification page
│   │   └── App.tsx                # Main app with routing
│   └── package.json
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml            # Namespace definition
│   ├── persistent-volumes.yaml   # Storage configuration
│   ├── issuance-deployment.yaml  # Issuance service deployment
│   ├── verification-deployment.yaml # Verification service deployment
│   ├── services.yaml             # Service definitions
│   └── ingress.yaml              # Ingress and NodePort services
└── scripts/                      # Deployment and build scripts
```

## Features

### Issuance Service (Port 3001)
- **POST /issue** - Issues new credentials
- **GET /health** - Health check endpoint
- Returns worker ID that processed the request
- Prevents duplicate credential issuance
- SQLite persistence with volume mounting

### Verification Service (Port 3002)
- **POST /verify** - Verifies credential existence
- **GET /health** - Health check endpoint
- **GET /logs** - Verification audit logs
- Returns worker ID and original issuance details
- Independent SQLite database for verification logs

### Frontend Features
- **Issue Page** - Form to create new credentials with JSON data support
- **Verify Page** - Form to verify existing credentials
- Responsive design with error handling
- Real-time feedback on API responses

## Technology Stack

- **Backend**: Node.js 20, TypeScript, Express.js, SQLite
- **Frontend**: React 19, TypeScript, React Router, Axios
- **Containerization**: Docker multi-stage builds
- **Orchestration**: Kubernetes (k3s for AWS free-tier)
- **Cloud**: AWS EC2 (t2.micro/t3.micro), S3 for frontend hosting
- **Testing**: Mocha, Chai, Supertest

## Quick Start

### Prerequisites
- Node.js 20+
- Docker
- kubectl
- AWS CLI (for cloud deployment)

### Local Development

1. **Backend Services**:
```bash
# Issuance Service
cd Backend/issuance-service
npm install
npm run dev

# Verification Service (new terminal)
cd Backend/verification-service
npm install
npm run dev
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

3. **Run Tests**:
```bash
# Test both services
cd Backend/issuance-service && npm test
cd Backend/verification-service && npm test
```

### Docker Build

```bash
# Build issuance service
cd Backend/issuance-service
docker build -t issuance-service:latest .

# Build verification service
cd Backend/verification-service
docker build -t verification-service:latest .

# Build frontend (optional)
cd frontend
docker build -t kube-credential-frontend:latest .
```

## AWS Deployment (Free Tier)

### Architecture Decisions

**Why k3s instead of EKS?**
- EKS control plane costs $0.10/hour (~$73/month) - not free tier eligible
- k3s on EC2 t2.micro/t3.micro uses free tier (750 hours/month for 12 months)
- Provides full Kubernetes functionality for development/demo purposes

**Storage Strategy:**
- SQLite with PersistentVolumes (hostPath for single-node k3s)
- Production would use EBS volumes or RDS
- Each service has independent data storage

### Step 1: EC2 Setup

```bash
# Launch EC2 instance (t2.micro/t3.micro)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=kube-credential-cluster}]'

# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip
```

### Step 2: Install k3s

```bash
# Install k3s
curl -sfL https://get.k3s.io | sh -

# Copy kubeconfig for kubectl access
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# Verify installation
kubectl get nodes
```

### Step 3: Build and Push Images

**Option A: Docker Hub**
```bash
# Tag and push to Docker Hub
docker tag issuance-service:latest yourusername/issuance-service:latest
docker tag verification-service:latest yourusername/verification-service:latest

docker push yourusername/issuance-service:latest
docker push yourusername/verification-service:latest
```

**Option B: Amazon ECR**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name issuance-service
aws ecr create-repository --repository-name verification-service

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag issuance-service:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/issuance-service:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/issuance-service:latest
```

### Step 4: Deploy to Kubernetes

```bash
# Create namespace and storage
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/persistent-volumes.yaml

# Deploy services
kubectl apply -f k8s/issuance-deployment.yaml
kubectl apply -f k8s/verification-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get pods -n kube-credential
kubectl get services -n kube-credential
```

### Step 5: Frontend Deployment (S3)

**Live Frontend URL**: http://kube-credential-frontend-uvenkatateja.s3-website.eu-north-1.amazonaws.com

```bash
# Build frontend for production
cd frontend
npm run build

# Upload to S3 bucket
aws s3 mb s3://kube-credential-frontend-uvenkatateja
aws s3 sync dist/ s3://kube-credential-frontend-uvenkatateja --delete

# Enable static website hosting
aws s3 website s3://kube-credential-frontend-uvenkatateja --index-document index.html
```

## API Endpoints

### Issuance Service (http://your-ec2-ip:30001)

**POST /issue**
```json
{
  "id": "credential-123",
  "name": "John Doe",
  "type": "identity",
  "level": "basic"
}
```

Response:
```json
{
  "message": "credential issued by worker-issuance-service-abc123",
  "worker": "worker-issuance-service-abc123",
  "issued_at": "2025-01-06T10:30:00.000Z"
}
```

### Verification Service (http://your-ec2-ip:30002)

**POST /verify**
```json
{
  "id": "credential-123"
}
```

Response:
```json
{
  "valid": true,
  "worker": "worker-verification-service-def456",
  "issued_at": "2025-01-06T10:30:00.000Z",
  "issued_by": "worker-issuance-service-abc123",
  "verified_at": "2025-01-06T10:35:00.000Z"
}
```

## Testing

### Unit Tests
```bash
# Run all tests
cd Backend/issuance-service && npm test
cd Backend/verification-service && npm test
```

### Integration Testing
```bash
# Test issuance
curl -X POST http://your-ec2-ip:30001/issue \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123","name":"Alice"}'

# Test verification
curl -X POST http://your-ec2-ip:30002/verify \
  -H "Content-Type: application/json" \
  -d '{"id":"test-123"}'
```

## Monitoring and Scaling

### Health Checks
- Both services include `/health` endpoints
- Kubernetes liveness and readiness probes configured
- Docker health checks included

### Scaling
```bash
# Scale issuance service
kubectl scale deployment issuance-service --replicas=3 -n kube-credential

# Scale verification service
kubectl scale deployment verification-service --replicas=2 -n kube-credential
```

### Logs
```bash
# View service logs
kubectl logs -f deployment/issuance-service -n kube-credential
kubectl logs -f deployment/verification-service -n kube-credential
```

## Security Considerations

- CORS enabled for frontend integration
- Input validation on all endpoints
- SQLite file permissions restricted
- Container runs as non-root user (production recommendation)
- Kubernetes network policies (can be added)

## Cost Optimization (AWS Free Tier)

- **EC2**: t2.micro/t3.micro (750 hours/month free for 12 months)
- **EBS**: 30GB free tier storage
- **S3**: 5GB free storage, 20,000 GET requests
- **Data Transfer**: 1GB/month free outbound
- **ECR**: 500MB storage free for 12 months

**Estimated Monthly Cost**: $0 (within free tier limits)

## Production Considerations

For production deployment, consider:

1. **Database**: Replace SQLite with RDS PostgreSQL/MySQL
2. **Container Registry**: Use ECR with proper IAM roles
3. **Load Balancing**: Application Load Balancer
4. **SSL/TLS**: Certificate Manager integration
5. **Monitoring**: CloudWatch, Prometheus + Grafana
6. **Secrets Management**: AWS Secrets Manager or Kubernetes secrets
7. **CI/CD**: GitHub Actions or AWS CodePipeline
8. **Multi-AZ**: Deploy across multiple availability zones

## Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**:
   ```bash
   kubectl describe pod <pod-name> -n kube-credential
   kubectl logs <pod-name> -n kube-credential
   ```

2. **Service Not Accessible**:
   ```bash
   kubectl get svc -n kube-credential
   kubectl describe svc issuance-service -n kube-credential
   ```

3. **Storage Issues**:
   ```bash
   kubectl get pv,pvc -n kube-credential
   ```

### Debug Commands
```bash
# Port forward for local testing
kubectl port-forward svc/issuance-service 3001:3001 -n kube-credential
kubectl port-forward svc/verification-service 3002:3002 -n kube-credential

# Execute into pod
kubectl exec -it <pod-name> -n kube-credential -- /bin/sh
```

## Contact Information

**Developer**: Ummadisetty Venkata Teja
**Email**: uvteja1111@gmail.com
**Phone**: +91 9959100206

## License

This project is created for the Zupple Labs Full Stack Engineer assignment.

---

**Assignment Completion Checklist:**

- ✅ Node.js TypeScript backend APIs
- ✅ Two independent microservices (Issuance & Verification)
- ✅ Docker containerization
- ✅ Kubernetes manifests (deployments, services, ingress)
- ✅ React TypeScript frontend with two pages
- ✅ Unit tests for both services
- ✅ AWS free-tier deployment strategy
- ✅ Worker ID tracking and response
- ✅ JSON credential handling
- ✅ Proper error handling and UI feedback
- ✅ Independent persistence layers
- ✅ Scalable architecture documentation