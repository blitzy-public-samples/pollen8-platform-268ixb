#!/bin/bash

# Pollen8 Platform Deployment Script
# This script automates the deployment process of the Pollen8 platform.
# It addresses the following requirements:
# - Automated Deployment (Technical Specification/5. INFRASTRUCTURE/5.5 CI/CD PIPELINE)
# - Environment Configuration (Technical Specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT)
# - Container Deployment (Technical Specification/5. INFRASTRUCTURE/5.3 CONTAINERIZATION)

set -e

# Global variables
ENVIRONMENT=${ENVIRONMENT:-"production"}
KUBE_CONFIG=${KUBE_CONFIG:-"~/.kube/config"}
ECR_REGISTRY=${ECR_REGISTRY:-"your-ecr-registry-url"}

# Function to check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."
    
    # Check for required tools
    command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed. Aborting."; exit 1; }
    command -v aws >/dev/null 2>&1 || { echo >&2 "AWS CLI is required but not installed. Aborting."; exit 1; }
    command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but not installed. Aborting."; exit 1; }

    # Check for required environment variables
    [[ -z "$ENVIRONMENT" ]] && { echo >&2 "ENVIRONMENT variable is not set. Aborting."; exit 1; }
    [[ -z "$KUBE_CONFIG" ]] && { echo >&2 "KUBE_CONFIG variable is not set. Aborting."; exit 1; }
    [[ -z "$ECR_REGISTRY" ]] && { echo >&2 "ECR_REGISTRY variable is not set. Aborting."; exit 1; }

    echo "All prerequisites met."
}

# Function to build and push Docker images
build_and_push_images() {
    echo "Building and pushing Docker images..."

    # Build and push frontend image
    docker build -t pollen8-frontend:${ENVIRONMENT} -f src/frontend/Dockerfile src/frontend
    docker tag pollen8-frontend:${ENVIRONMENT} ${ECR_REGISTRY}/pollen8-frontend:${ENVIRONMENT}
    docker push ${ECR_REGISTRY}/pollen8-frontend:${ENVIRONMENT}

    # Build and push backend image
    docker build -t pollen8-backend:${ENVIRONMENT} -f src/backend/Dockerfile src/backend
    docker tag pollen8-backend:${ENVIRONMENT} ${ECR_REGISTRY}/pollen8-backend:${ENVIRONMENT}
    docker push ${ECR_REGISTRY}/pollen8-backend:${ENVIRONMENT}

    echo "Docker images built and pushed successfully."
}

# Function to deploy Kubernetes resources
deploy_kubernetes_resources() {
    echo "Deploying Kubernetes resources..."

    # Set kubectl context
    kubectl config use-context ${KUBE_CONFIG}

    # Apply Kubernetes manifests
    kubectl apply -f infrastructure/kubernetes/configmap.yaml
    kubectl apply -f infrastructure/kubernetes/secrets.yaml
    kubectl apply -f infrastructure/kubernetes/frontend-deployment.yaml
    kubectl apply -f infrastructure/kubernetes/backend-deployment.yaml
    kubectl apply -f infrastructure/kubernetes/database-service.yaml
    kubectl apply -f infrastructure/kubernetes/ingress.yaml

    echo "Kubernetes resources deployed successfully."
}

# Function to run database migrations
run_database_migrations() {
    echo "Running database migrations..."

    # Execute migrations using the backend service
    kubectl exec -it $(kubectl get pods -l app=pollen8-backend -o jsonpath="{.items[0].metadata.name}") -- npm run migrate

    echo "Database migrations completed successfully."
}

# Function to perform health check
perform_health_check() {
    echo "Performing health check..."

    # Call the health check script
    ./health-check.sh

    echo "Health check completed successfully."
}

# Main function to orchestrate the deployment process
main() {
    echo "Starting deployment process for Pollen8 platform..."

    # Source environment-specific variables
    source .env.${ENVIRONMENT}

    # Execute deployment steps
    check_prerequisites
    build_and_push_images
    deploy_kubernetes_resources
    run_database_migrations
    perform_health_check

    echo "Deployment process completed successfully."
}

# Execute the main function
main

# Error handling
if [ $? -ne 0 ]; then
    echo "Deployment failed. Please check the logs for more information."
    exit 1
fi