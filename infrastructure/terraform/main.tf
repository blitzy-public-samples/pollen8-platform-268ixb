# This file serves as the main entry point for Terraform configuration, defining the core infrastructure components for the Pollen8 platform on AWS.
# Requirements addressed:
# - Cloud Infrastructure (Technical specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT)
# - Scalability (Technical specification/5. INFRASTRUCTURE/5.2 CLOUD SERVICES)
# - High Availability (Technical specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT)

# Specify required Terraform version and required providers
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "pollen8-terraform-state"
    key    = "pollen8/terraform.tfstate"
    region = "us-west-2"
    encrypt = true
  }
}

# Configure the AWS provider
provider "aws" {
  region = var.aws_region
  default_tags {
    Environment = var.environment
    Project     = "Pollen8"
  }
}

# Create VPC using AWS VPC module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = "pollen8-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = true
  single_nat_gateway = false
  
  tags = {
    Terraform = "true"
    Environment = var.environment
  }
}

# EKS module for Kubernetes cluster
module "eks" {
  source = "./modules/eks"

  cluster_name    = "pollen8-cluster"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
  instance_types  = var.eks_instance_types
  desired_size    = var.eks_desired_size
  min_size        = var.eks_min_size
  max_size        = var.eks_max_size
}

# RDS module for Aurora database
module "rds" {
  source = "./modules/rds"

  identifier      = "pollen8-db"
  engine          = "aurora-postgresql"
  engine_version  = "13.7"
  instance_class  = var.rds_instance_class
  allocated_storage = var.rds_allocated_storage
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
}

# ElastiCache module for Redis
module "elasticache" {
  source = "./modules/elasticache"

  cluster_id      = "pollen8-cache"
  engine          = "redis"
  node_type       = var.elasticache_node_type
  num_cache_nodes = var.elasticache_num_nodes
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets
}

# S3 module for static asset storage
module "s3" {
  source = "./modules/s3"

  bucket_name = "pollen8-assets-${var.environment}"
}

# CloudFront module for content delivery
module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_id = module.s3.bucket_id
  aliases      = ["assets.pollen8.com"]
}

# Output important information
output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "Endpoint for RDS Aurora cluster"
  value       = module.rds.cluster_endpoint
}

output "elasticache_endpoint" {
  description = "Endpoint for ElastiCache Redis cluster"
  value       = module.elasticache.cluster_endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = module.s3.bucket_name
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}