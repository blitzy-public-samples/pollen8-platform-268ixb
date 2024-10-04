# ElastiCache Module for Pollen8 Platform
# This module provisions and configures Amazon ElastiCache resources for the Pollen8 platform.
# ElastiCache is used as a caching layer to improve performance and reduce database load.

# Required AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Input variables
variable "vpc_id" {
  type        = string
  description = "ID of the VPC where ElastiCache will be deployed"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for ElastiCache deployment"
}

variable "node_type" {
  type        = string
  description = "The compute and memory capacity of the nodes"
  default     = "cache.t3.micro"
}

variable "num_cache_nodes" {
  type        = number
  description = "The number of cache nodes"
  default     = 1
}

# Create ElastiCache subnet group
resource "aws_elasticache_subnet_group" "pollen8_cache_subnet_group" {
  name       = "pollen8-cache-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "Pollen8 ElastiCache Subnet Group"
  }
}

# Create ElastiCache cluster
resource "aws_elasticache_cluster" "pollen8_cache" {
  cluster_id           = "pollen8-cache"
  engine               = "redis"
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  parameter_group_name = "default.redis6.x"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.pollen8_cache_subnet_group.name

  # Enable encryption at rest using AWS managed keys
  at_rest_encryption_enabled = true

  # Additional configurations for production environments:
  # multi_az_enabled = true
  # automatic_failover_enabled = true

  tags = {
    Name = "Pollen8 ElastiCache Cluster"
  }
}

# Create security group for ElastiCache
resource "aws_security_group" "pollen8_cache_sg" {
  name        = "pollen8-cache-sg"
  description = "Security group for Pollen8 ElastiCache"
  vpc_id      = var.vpc_id

  tags = {
    Name = "Pollen8 ElastiCache Security Group"
  }
}

# Create security group rule for ElastiCache access
resource "aws_security_group_rule" "pollen8_cache_ingress" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = aws_security_group.pollen8_cache_sg.id
  source_security_group_id = var.app_security_group_id
}

# Output values
output "elasticache_endpoint" {
  value       = aws_elasticache_cluster.pollen8_cache.cache_nodes[0].address
  description = "Endpoint for connecting to the ElastiCache cluster"
}

output "elasticache_port" {
  value       = aws_elasticache_cluster.pollen8_cache.port
  description = "Port number for the ElastiCache cluster"
}

# Additional variable for the application security group ID
variable "app_security_group_id" {
  type        = string
  description = "ID of the security group for EC2 instances or EKS nodes"
}

# CloudWatch alarms for monitoring cache performance and usage
resource "aws_cloudwatch_metric_alarm" "cache_cpu_utilization" {
  alarm_name          = "pollen8-cache-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "75"
  alarm_description   = "This metric monitors ElastiCache CPU utilization"
  alarm_actions       = [var.sns_topic_arn]

  dimensions = {
    CacheClusterId = aws_elasticache_cluster.pollen8_cache.id
  }
}

resource "aws_cloudwatch_metric_alarm" "cache_freeable_memory" {
  alarm_name          = "pollen8-cache-freeable-memory"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "FreeableMemory"
  namespace           = "AWS/ElastiCache"
  period              = "120"
  statistic           = "Average"
  threshold           = "100000000" # 100 MB
  alarm_description   = "This metric monitors ElastiCache freeable memory"
  alarm_actions       = [var.sns_topic_arn]

  dimensions = {
    CacheClusterId = aws_elasticache_cluster.pollen8_cache.id
  }
}

# Additional variable for SNS topic ARN
variable "sns_topic_arn" {
  type        = string
  description = "ARN of the SNS topic for CloudWatch alarms"
}