# Fetch shared variables from the variables module
variable "environment" {}
variable "project_name" {}
variable "vpc_id" {}
variable "private_subnet_ids" {}

# RDS instance configuration
resource "aws_db_instance" "pollen8_db" {
  identifier        = "${var.project_name}-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "14.6"  # Latest stable version as of creation
  instance_class    = "db.t3.medium"  # Adjust based on performance requirements
  allocated_storage = 20  # GB, adjust based on expected data volume
  storage_type      = "gp2"

  # Credentials should be fetched from AWS Secrets Manager in a production environment
  username = "pollen8_admin"
  password = "CHANGE_ME_BEFORE_PRODUCTION"  # This should be replaced with a reference to AWS Secrets Manager

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.pollen8_subnet_group.name

  multi_az               = true  # Enable high availability
  backup_retention_period = 7  # 7 days of backups
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.project_name}-${var.environment}-final-snapshot"

  # Enable encryption at rest
  storage_encrypted = true

  # Enable automated backups
  backup_window = "03:00-04:00"  # UTC

  # Enable enhanced monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn

  # Enable Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7  # days

  tags = {
    Name        = "${var.project_name}-${var.environment}-db"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Subnet group for RDS
resource "aws_db_subnet_group" "pollen8_subnet_group" {
  name       = "${var.project_name}-${var.environment}-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-subnet-group"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Security group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  # Allow inbound traffic on the PostgreSQL port from the VPC
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.selected.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# IAM role for RDS enhanced monitoring
resource "aws_iam_role" "rds_monitoring_role" {
  name = "${var.project_name}-${var.environment}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-monitoring-role"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach the necessary policy to the IAM role
resource "aws_iam_role_policy_attachment" "rds_monitoring_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
  role       = aws_iam_role.rds_monitoring_role.name
}

# Data source to get VPC details
data "aws_vpc" "selected" {
  id = var.vpc_id
}

# Outputs
output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.pollen8_db.endpoint
}

output "rds_port" {
  description = "The port on which the RDS instance accepts connections"
  value       = aws_db_instance.pollen8_db.port
}