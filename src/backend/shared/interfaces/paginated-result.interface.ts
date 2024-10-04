/**
 * This file defines a TypeScript interface for paginated results, which is crucial for implementing
 * efficient data retrieval in the Pollen8 platform's backend.
 * 
 * Requirements addressed:
 * - Efficient Data Retrieval (Technical Specification/2.3.2 Backend Components/DataService)
 *   Implementation of pagination for large datasets
 */

/**
 * PaginatedResult interface defines the structure for paginated results in the Pollen8 platform.
 * It is generic, allowing it to be used with different types of data.
 * 
 * @template T The type of items in the paginated result
 */
export interface PaginatedResult<T> {
  /**
   * The array of items for the current page
   */
  items: T[];

  /**
   * The total number of items across all pages
   */
  total: number;

  /**
   * The current page number
   */
  page: number;

  /**
   * The maximum number of items per page
   */
  limit: number;

  /**
   * The total number of pages
   */
  totalPages: number;
}