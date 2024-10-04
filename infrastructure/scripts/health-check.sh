#!/bin/bash

# Pollen8 Platform Health Check Script
# This script performs health checks on various components of the Pollen8 platform infrastructure.
# Requirements addressed:
# - Infrastructure Monitoring (Technical Specification/1.1 System Objectives/Quantifiable Networking)
# - High Availability (Technical Specification/1.2 Scope/Core Functionalities)

# Load environment variables
source .env

# Global variables
FRONTEND_URL=${FRONTEND_URL:-"https://pollen8.com"}
BACKEND_URL=${BACKEND_URL:-"https://api.pollen8.com"}
DATABASE_HOST=${DATABASE_HOST:-"db.pollen8.com"}
REDIS_HOST=${REDIS_HOST:-"redis.pollen8.com"}

# Function to check HTTP service health
check_http_service() {
    local url=$1
    local name=$2
    local response
    local status_code

    echo "Checking $name..."
    response=$(curl -sS -o /dev/null -w "%{http_code}" "$url/health")
    status_code=$?

    if [ $status_code -eq 0 ] && [ "$response" == "200" ]; then
        echo "$name is healthy"
        return 0
    else
        echo "$name is unhealthy. Status code: $response"
        return 1
    fi
}

# Function to check database health
check_database() {
    local host=$1
    local status

    echo "Checking database..."
    status=$(PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" >/dev/null 2>&1; echo $?)

    if [ $status -eq 0 ]; then
        echo "Database is healthy"
        return 0
    else
        echo "Database is unhealthy"
        return 1
    fi
}

# Function to check Redis health
check_redis() {
    local host=$1
    local status

    echo "Checking Redis..."
    status=$(redis-cli -h "$host" ping >/dev/null 2>&1; echo $?)

    if [ $status -eq 0 ]; then
        echo "Redis is healthy"
        return 0
    else
        echo "Redis is unhealthy"
        return 1
    fi
}

# Main function to orchestrate health checks
main() {
    local exit_code=0

    check_http_service "$FRONTEND_URL" "Frontend" || exit_code=$((exit_code + 1))
    check_http_service "$BACKEND_URL" "Backend" || exit_code=$((exit_code + 1))
    check_database "$DATABASE_HOST" || exit_code=$((exit_code + 1))
    check_redis "$REDIS_HOST" || exit_code=$((exit_code + 1))

    echo "Health check complete. Exit code: $exit_code"

    # Log overall health status
    if [ $exit_code -eq 0 ]; then
        logger -t pollen8_health_check "All systems are healthy"
    else
        logger -t pollen8_health_check "Some systems are unhealthy. Check logs for details."
    fi

    return $exit_code
}

# Run the main function
main

# Exit with the overall status
exit $?