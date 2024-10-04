# This file defines the output values for the Terraform configuration in the Pollen8 project's infrastructure.
# Outputs are a way to expose specific values from your Terraform configuration, which can be useful for
# displaying important information after applying the configuration or for use in other parts of your infrastructure setup.

# Requirements addressed:
# - Infrastructure Output (Technical specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT)
#   Provide essential information about the deployed infrastructure

# EKS Cluster Endpoint
output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS cluster"
  value       = module.eks.cluster_endpoint
}

# EKS Cluster Name
output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

# EKS Cluster Security Group ID
output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

# RDS Endpoint
output "rds_endpoint" {
  description = "Connection endpoint for the RDS instance"
  value       = module.rds.db_instance_endpoint
}

# RDS Database Name
output "rds_database_name" {
  description = "Name of the initial database created"
  value       = module.rds.db_instance_name
}

# ElastiCache Endpoint
output "elasticache_endpoint" {
  description = "Connection endpoint for the ElastiCache cluster"
  value       = module.elasticache.cluster_endpoint
}

# S3 Bucket Name
output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = module.s3.bucket_name
}

# CloudFront Distribution ID
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

# CloudFront Domain Name
output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.domain_name
}