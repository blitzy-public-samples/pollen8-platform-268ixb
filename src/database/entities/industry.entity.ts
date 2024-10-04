import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

/**
 * Industry entity representing various industries that users can associate with their profiles.
 * @description This class defines the Industry entity for the Pollen8 platform, representing different industries that users can select for their profiles.
 * @requirements Industry Selection - Users must select at least 3 industries for their profile (Technical Specification/1.1 System Objectives/Verified Connections)
 */
@Entity('industries')
export class Industry {
  /**
   * Unique identifier for the industry.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of the industry.
   */
  @Column({ unique: true })
  name: string;

  /**
   * Users associated with this industry.
   * This is the inverse side of the many-to-many relationship defined in the User entity.
   */
  @ManyToMany(() => User, user => user.industries)
  users: User[];

  constructor(partial: Partial<Industry> = {}) {
    Object.assign(this, partial);
  }
}