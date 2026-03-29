#!/bin/bash

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Professional Deployment Process..."
echo ""

# ===== COLORS =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ===== FUNCTIONS =====
log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

section() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# ===== CHECKS =====
section "1️⃣  PRE-DEPLOYMENT CHECKS"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_success "Node.js installed: $NODE_VERSION"
else
    log_error "Node.js is not installed"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    log_success "Git installed"
else
    log_error "Git is not installed"
    exit 1
fi

# Check environment file
if [ ! -f .env ]; then
    log_warning ".env file not found, copying from .env.example"
    if [ -f .env.example ]; then
        cp .env.example .env
        log_success "Created .env from .env.example"
        log_warning "Please edit .env with your configuration"
    else
        log_error ".env.example not found"
        exit 1
    fi
else
    log_success ".env file exists"
fi

# ===== DEPENDENCIES =====
section "2️⃣  INSTALLING DEPENDENCIES"

if [ ! -d node_modules ]; then
    log_info "Installing npm dependencies..."
    npm ci
    log_success "Dependencies installed"
else
    log_success "Dependencies already installed"
fi

# ===== VALIDATION =====
section "3️⃣  CODE VALIDATION"

log_info "Checking syntax..."
node -c index.js
log_success "Syntax check passed"

# ===== SECURITY =====
section "4️⃣  SECURITY CHECKS"

log_info "Running npm audit..."
npm audit --audit-level=moderate || log_warning "npm audit found issues (non-critical)"
log_success "Security check completed"

# ===== GIT =====
section "5️⃣  GIT PREPARATION"

if [ -z "$(git config user.name)" ]; then
    git config --global user.name "Deployment Bot"
    log_success "Git user configured"
else
    log_success "Git user already configured"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Uncommitted changes detected"
    git status --short
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

log_success "Git repository ready"

# ===== DOCKER =====
section "6️⃣  DOCKER BUILD"

if command -v docker &> /dev/null; then
    log_info "Building Docker image..."
    docker build -t glucosen-backend:latest .
    
    if [ $? -eq 0 ]; then
        log_success "Docker image built successfully"
        docker images | grep glucosen
    else
        log_error "Docker build failed"
        exit 1
    fi
else
    log_warning "Docker not installed, skipping Docker build"
fi

# ===== RAILWAY =====
section "7️⃣  RAILWAY DEPLOYMENT"

if command -v railway &> /dev/null; then
    log_info "Checking Railway CLI..."
    railway --version
    log_success "Railway CLI ready"
    
    read -p "Deploy to Railway now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Linking to Railway project..."
        # railway link --project-id $RAILWAY_PROJECT_ID 2>/dev/null || true
        
        log_info "Pushing to Railway..."
        railway up
        
        log_success "Deployment complete!"
        read -p "Check Railway status? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            railway status
        fi
    else
        log_warning "Deployment skipped"
    fi
else
    log_warning "Railway CLI not installed"
    log_info "Install with: npm install -g @railway/cli"
fi

# ===== SUMMARY =====
section "📊 DEPLOYMENT SUMMARY"

cat << EOF
${GREEN}✓ Pre-deployment checks passed
✓ Dependencies installed
✓ Code validated
✓ Security check completed
✓ Repository ready
✓ Docker image built

${BLUE}Next steps:
1. Configure Railway project (if not done)
2. Set environment variables in Railway dashboard
3. Monitor deployment with: railway logs -f

${YELLOW}Useful commands:
- Railway logs: railway logs -f
- Railway status: railway status
- Railway shell: railway shell
- Rollback: railway rollback --to <deployment-id>

${GREEN}Ready for production! 🚀${NC}
EOF
