#!/bin/bash

# Pollen8 Platform Rollback Script
# This script is responsible for rolling back deployments in case of failures or issues.

# Set strict mode
set -euo pipefail

# Global variables
KUBE_CONFIG=${KUBE_CONFIG:-""}
NAMESPACE=${NAMESPACE:-"pollen8"}

# Function to roll back a specific deployment
rollback_deployment() {
    local deployment_name=$1
    local revision=$2

    echo "Rolling back deployment: $deployment_name to revision: $revision"
    
    if ! kubectl --kubeconfig="$KUBE_CONFIG" -n "$NAMESPACE" rollout undo deployment/"$deployment_name" --to-revision="$revision"; then
        echo "Error: Failed to rollback deployment $deployment_name"
        return 1
    fi
    
    echo "Rollback initiated for $deployment_name"
}

# Function to check deployment status
check_deployment_status() {
    local deployment_name=$1
    local timeout=300  # 5 minutes timeout
    local start_time=$(date +%s)

    echo "Checking status of deployment: $deployment_name"

    while true; do
        local status=$(kubectl --kubeconfig="$KUBE_CONFIG" -n "$NAMESPACE" get deployment "$deployment_name" -o jsonpath='{.status.conditions[?(@.type=="Available")].status}')
        
        if [[ "$status" == "True" ]]; then
            echo "Deployment $deployment_name is successfully rolled back and available"
            return 0
        fi

        local current_time=$(date +%s)
        if (( current_time - start_time >= timeout )); then
            echo "Error: Timeout waiting for deployment $deployment_name to become available"
            return 1
        fi

        echo "Waiting for deployment $deployment_name to become available..."
        sleep 10
    done
}

# Main function
main() {
    local components=()
    local revision=""

    # Parse command-line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --frontend) components+=("frontend") ;;
            --backend) components+=("backend") ;;
            --database) components+=("database") ;;
            --revision) 
                shift
                revision=$1
                ;;
            *)
                echo "Error: Unknown option $1"
                echo "Usage: $0 [--frontend] [--backend] [--database] [--revision <number>]"
                exit 1
                ;;
        esac
        shift
    done

    # Validate Kubernetes connection
    if ! kubectl --kubeconfig="$KUBE_CONFIG" get ns &>/dev/null; then
        echo "Error: Unable to connect to Kubernetes cluster. Please check your KUBE_CONFIG."
        exit 1
    fi

    # Check if the specified NAMESPACE exists
    if ! kubectl --kubeconfig="$KUBE_CONFIG" get ns "$NAMESPACE" &>/dev/null; then
        echo "Error: Namespace $NAMESPACE does not exist."
        exit 1
    fi

    # Perform rollback for each specified component
    for component in "${components[@]}"; do
        echo "Processing rollback for $component"
        
        # If revision is not specified, get the previous revision
        if [[ -z "$revision" ]]; then
            revision=$(kubectl --kubeconfig="$KUBE_CONFIG" -n "$NAMESPACE" rollout history deployment/"$component" | grep -v "REVISION" | tail -n 2 | head -n 1 | awk '{print $1}')
        fi

        if rollback_deployment "$component" "$revision"; then
            if check_deployment_status "$component"; then
                echo "Rollback successful for $component"
            else
                echo "Error: Rollback verification failed for $component"
                exit 1
            fi
        else
            echo "Error: Rollback failed for $component"
            exit 1
        fi
    done

    echo "Rollback process completed successfully"
}

# Execute main function
main "$@"