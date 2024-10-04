import { SelectQueryBuilder, InsertQueryBuilder, UpdateQueryBuilder, DeleteQueryBuilder, FindConditions, ObjectLiteral } from 'typeorm';
import { databaseConfig } from '../config/database.config';

/**
 * Interface for defining options for SELECT queries
 */
interface SelectQueryOptions<T> {
  select?: (keyof T)[];
  where?: FindConditions<T>;
  relations?: string[];
  order?: { [P in keyof T]?: 'ASC' | 'DESC' };
  skip?: number;
  take?: number;
}

/**
 * Creates a SELECT query builder for the specified entity with given options.
 * @param entity - The entity class
 * @param options - Options for the SELECT query
 * @returns A TypeORM SelectQueryBuilder instance
 */
export function createSelectQuery<T extends ObjectLiteral>(
  entity: new () => T,
  options: SelectQueryOptions<T>
): SelectQueryBuilder<T> {
  const queryBuilder = databaseConfig.createQueryBuilder(entity, 'entity');

  if (options.select) {
    queryBuilder.select(options.select.map(column => `entity.${String(column)}`));
  }

  if (options.where) {
    queryBuilder.where(options.where);
  }

  if (options.relations) {
    options.relations.forEach(relation => queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation));
  }

  if (options.order) {
    Object.entries(options.order).forEach(([column, direction]) => {
      queryBuilder.addOrderBy(`entity.${column}`, direction);
    });
  }

  if (options.skip !== undefined) {
    queryBuilder.skip(options.skip);
  }

  if (options.take !== undefined) {
    queryBuilder.take(options.take);
  }

  return queryBuilder;
}

/**
 * Creates an INSERT query builder for the specified entity with the given data.
 * @param entity - The entity class
 * @param data - The data to be inserted
 * @returns A TypeORM InsertQueryBuilder instance
 */
export function createInsertQuery<T extends ObjectLiteral>(
  entity: new () => T,
  data: Partial<T>
): InsertQueryBuilder<T> {
  return databaseConfig.createQueryBuilder()
    .insert()
    .into(entity)
    .values(data as any);
}

/**
 * Creates an UPDATE query builder for the specified entity with the given criteria and data.
 * @param entity - The entity class
 * @param criteria - The conditions for updating
 * @param data - The data to be updated
 * @returns A TypeORM UpdateQueryBuilder instance
 */
export function createUpdateQuery<T extends ObjectLiteral>(
  entity: new () => T,
  criteria: FindConditions<T>,
  data: Partial<T>
): UpdateQueryBuilder<T> {
  return databaseConfig.createQueryBuilder()
    .update(entity)
    .set(data as any)
    .where(criteria);
}

/**
 * Creates a DELETE query builder for the specified entity with the given criteria.
 * @param entity - The entity class
 * @param criteria - The conditions for deleting
 * @returns A TypeORM DeleteQueryBuilder instance
 */
export function createDeleteQuery<T extends ObjectLiteral>(
  entity: new () => T,
  criteria: FindConditions<T>
): DeleteQueryBuilder<T> {
  return databaseConfig.createQueryBuilder()
    .delete()
    .from(entity)
    .where(criteria);
}

// Requirement: Database Query Building
// Location: Technical Specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.2 Backend Components
// Description: This utility file provides functions for constructing complex SQL queries

// Requirement: Type Safety
// Location: Technical Specification/9. SECURITY CONSIDERATIONS/9.2 DATA SECURITY/9.2.3 Database Security
// Description: The functions in this file ensure type safety when building queries to prevent runtime errors