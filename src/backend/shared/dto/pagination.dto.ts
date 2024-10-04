import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

/**
 * This file defines a Data Transfer Object (DTO) for handling pagination in API responses across the Pollen8 backend application.
 * 
 * Requirements addressed:
 * - Scalable Data Retrieval (Technical Specification/2.1 High-Level Architecture Diagram/Application Layer)
 *   Enable efficient retrieval of large datasets
 */

/**
 * PaginationDto class defines the structure for pagination parameters in API requests.
 * It is used to standardize and validate pagination-related inputs across the application.
 */
export class PaginationDto {
  /**
   * The page number to retrieve. Optional, with a default value handled by the service.
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  /**
   * The number of items to retrieve per page. Optional, with a default value handled by the service.
   * @example 10
   */
  @ApiPropertyOptional({
    description: 'The number of items to retrieve per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

/**
 * A type that combines the PaginationDto with the PaginatedResult interface.
 * This allows for easy creation of paginated responses that include both the pagination parameters and the result data.
 */
export type PaginatedResponse<T> = PaginationDto & PaginatedResult<T>;

/**
 * A utility function to create a paginated response object.
 * 
 * @param items The array of items for the current page
 * @param total The total number of items across all pages
 * @param paginationDto The pagination parameters used for the query
 * @returns A PaginatedResponse object
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  paginationDto: PaginationDto
): PaginatedResponse<T> {
  const { page = 1, limit = 10 } = paginationDto;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}