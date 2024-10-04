# CloudFront Distribution Module for Pollen8 Platform
# This module sets up and configures AWS CloudFront distribution for efficient delivery of static assets

# Requirements addressed:
# - Global Content Delivery (Technical Specification/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
# - SSL Termination (Technical Specification/9.3 SECURITY PROTOCOLS)
# - Origin Access Identity (Technical Specification/9.2 DATA SECURITY)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Create an Origin Access Identity for secure S3 bucket access
resource "aws_cloudfront_origin_access_identity" "pollen8_oai" {
  comment = "Origin Access Identity for Pollen8 S3 bucket"
}

# Define the main CloudFront distribution for Pollen8's static assets
resource "aws_cloudfront_distribution" "pollen8_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Use only North America and Europe edge locations for cost optimization

  # Origin configuration pointing to the S3 bucket
  origin {
    domain_name = var.s3_bucket_regional_domain_name
    origin_id   = var.s3_bucket_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.pollen8_oai.cloudfront_access_identity_path
    }
  }

  # Default cache behavior settings
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.s3_bucket_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Custom error responses
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  # SSL/TLS configuration using AWS Certificate Manager
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.pollen8_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Restrict distribution to allowed countries (if applicable)
  # Uncomment and configure as needed based on Pollen8's target markets
  # restrictions {
  #   geo_restriction {
  #     restriction_type = "whitelist"
  #     locations        = ["US", "CA", "GB", "DE"]
  #   }
  # }

  # Configure logging for CloudFront access logs
  logging_config {
    include_cookies = false
    bucket          = "${var.s3_bucket_id}.s3.amazonaws.com"
    prefix          = "cloudfront-logs/"
  }

  # Use custom domain name if provided
  aliases = var.domain_name != "" ? [var.domain_name] : []

  # Add tags for better resource management
  tags = {
    Name        = "Pollen8-CloudFront-Distribution"
    Environment = terraform.workspace
    Project     = "Pollen8"
  }
}

# Create an ACM certificate for the custom domain (if provided)
resource "aws_acm_certificate" "pollen8_cert" {
  count             = var.domain_name != "" ? 1 : 0
  domain_name       = var.domain_name
  validation_method = "DNS"

  tags = {
    Name        = "Pollen8-ACM-Certificate"
    Environment = terraform.workspace
    Project     = "Pollen8"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Output the CloudFront distribution ID and domain name
output "cloudfront_distribution_id" {
  description = "ID of the created CloudFront distribution"
  value       = aws_cloudfront_distribution.pollen8_distribution.id
}

output "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.pollen8_distribution.domain_name
}