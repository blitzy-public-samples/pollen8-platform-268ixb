import { EntityRepository, Repository } from 'typeorm';
import { Industry } from '../entities/industry.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * Repository for handling database operations related to industries in the Pollen8 platform.
 * @description This class extends the TypeORM Repository for the Industry entity, providing specific methods for industry-related database operations.
 * @requirements Industry Management - Handling CRUD operations for industries (Technical specification/1.1 System Objectives/Verified Connections)
 */
@EntityRepository(Industry)
export class IndustryRepository extends Repository<Industry> {
  /**
   * Retrieves an industry by its name.
   * @param name The name of the industry to find
   * @returns A Promise resolving to the found industry or undefined if not found
   */
  async findByName(name: string): Promise<Industry | undefined> {
    return this.findOne({ where: { name } });
  }

  /**
   * Creates a new industry with the given name.
   * @param name The name of the new industry
   * @returns A Promise resolving to the newly created industry
   */
  async createIndustry(name: string): Promise<Industry> {
    const industry = this.create({ name });
    return this.save(industry);
  }

  /**
   * Updates an existing industry with a new name.
   * @param id The ID of the industry to update
   * @param name The new name for the industry
   * @returns A Promise resolving to the updated industry
   * @throws NotFoundException if the industry is not found
   */
  async updateIndustry(id: string, name: string): Promise<Industry> {
    const industry = await this.findOne(id);
    if (!industry) {
      throw new NotFoundException(`Industry with ID "${id}" not found`);
    }
    industry.name = name;
    return this.save(industry);
  }

  /**
   * Deletes an industry by its ID.
   * @param id The ID of the industry to delete
   * @returns A Promise that resolves when the industry is deleted
   * @throws NotFoundException if the industry is not found
   */
  async deleteIndustry(id: string): Promise<void> {
    const industry = await this.findOne(id);
    if (!industry) {
      throw new NotFoundException(`Industry with ID "${id}" not found`);
    }
    await this.remove(industry);
  }
}