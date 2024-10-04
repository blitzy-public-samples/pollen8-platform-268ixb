# This file defines the Terraform module for creating and configuring Amazon S3 buckets for the Pollen8 platform.
# Requirements addressed:
# - Static Asset Storage (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)

# Terraform AWS provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Resource: S3 Bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  bucket = var.bucket_name
  acl    = "private"  # Ensure the bucket is private by default

  # Enable versioning to maintain a history of object changes
  versioning {
    enabled = true
  }

  # Configure CORS rules to allow access from the Pollen8 frontend domain
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = [var.frontend_domain]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  # Add tags for better resource management
  tags = {
    Name        = "Pollen8 Static Assets"
    Environment = var.environment
    Project     = "Pollen8"
  }
}

# Resource: S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Output: S3 Bucket ID
output "bucket_id" {
  value       = aws_s3_bucket.static_assets.id
  description = "The ID of the created S3 bucket"
}

# Output: S3 Bucket ARN
output "bucket_arn" {
  value       = aws_s3_bucket.static_assets.arn
  description = "The ARN of the created S3 bucket"
}

# Variables
variable "bucket_name" {
  type        = string
  description = "The name of the S3 bucket for static assets"
}

variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, production)"
}

variable "frontend_domain" {
  type        = string
  description = "The domain of the Pollen8 frontend for CORS configuration"
}
```

This Terraform module creates an S3 bucket for storing static assets for the Pollen8 platform. Here's a breakdown of the key components:

1. We define the required AWS provider.

2. The `aws_s3_bucket` resource creates the S3 bucket with the following configurations:
   - Private ACL for security
   - Versioning enabled to maintain object history
   - CORS rules to allow access from the Pollen8 frontend domain
   - Tags for better resource management

3. The `aws_s3_bucket_public_access_block` resource ensures that public access to the bucket is blocked for enhanced security.

4. We define outputs for the bucket ID and ARN, which can be used by other modules or in the root module.

5. Variables are defined for the bucket name, environment, and frontend domain to make the module reusable and configurable.

This module addresses the "Static Asset Storage" requirement mentioned in the technical specification. It provides a secure, versioned, and properly configured S3 bucket for storing static assets used by the Pollen8 platform.

To use this module, you would typically call it from your root Terraform configuration, providing the necessary variable values:

```hcl
module "static_assets_bucket" {
  source          = "./modules/s3"
  bucket_name     = "pollen8-static-assets-${var.environment}"
  environment     = var.environment
  frontend_domain = "https://app.pollen8.com"
}