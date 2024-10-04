# This file defines the input variables for the Terraform configuration used to set up the infrastructure for the Pollen8 platform.
# Requirements addressed:
# - Infrastructure as Code (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
# - Cloud-native Deployment (Technical Specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT)

variable "aws_region" {
  type        = string
  description = "The AWS region where resources will be created"
  default     = "us-west-2"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
  default     = "pollen8"
}

variable "environment" {
  type        = string
  description = "The deployment environment (dev, staging, production)"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for public subnets"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for private subnets"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones in the region"
}

variable "eks_cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
  default     = "pollen8-cluster"
}

variable "eks_instance_types" {
  type        = list(string)
  description = "List of EC2 instance types for EKS nodes"
  default     = ["t3.medium", "t3.large"]
}

variable "eks_desired_size" {
  type        = number
  description = "Desired number of EKS nodes"
  default     = 2
}

variable "eks_min_size" {
  type        = number
  description = "Minimum number of EKS nodes"
  default     = 1
}

variable "eks_max_size" {
  type        = number
  description = "Maximum number of EKS nodes"
  default     = 5
}

variable "rds_instance_class" {
  type        = string
  description = "RDS instance class for PostgreSQL"
  default     = "db.t3.medium"
}

variable "rds_allocated_storage" {
  type        = number
  description = "Allocated storage for RDS instance in GB"
  default     = 20
}

variable "rds_database_name" {
  type        = string
  description = "Name of the PostgreSQL database"
  default     = "pollen8db"
}

variable "elasticache_node_type" {
  type        = string
  description = "ElastiCache node type for Redis"
  default     = "cache.t3.micro"
}

variable "elasticache_num_nodes" {
  type        = number
  description = "Number of cache nodes in the ElastiCache cluster"
  default     = 1
}

variable "s3_bucket_name" {
  type        = string
  description = "Name of the S3 bucket for static assets"
}

variable "cloudfront_price_class" {
  type        = string
  description = "CloudFront distribution price class"
  default     = "PriceClass_100"
}