import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

/**
 * Interest entity representing various interests that users can associate with their profiles in the Pollen8 platform.
 * @description This class defines the Interest entity for the Pollen8 platform, representing different interests that users can select for their profiles.
 * @requirements Interest Selection - Users must select at least 3 interests for their profile (Technical Specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */
@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, user => user.interests)
  users: User[];

  constructor(partial: Partial<Interest> = {}) {
    Object.assign(this, partial);
  }
}