import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Industry } from '../industry/industry.entity';
import { Interest } from '../interest/interest.entity';
import { Connection } from '../network/network.entity';
import { Invite } from '../invite/invite.entity';

/**
 * User entity representing the core data structure for user information in the Pollen8 platform.
 * @description This class defines the User entity, representing a user in the Pollen8 platform.
 * @requirements User Profile - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Verified Connections - Technical Specification/1.1 System Objectives/Verified Connections
 * @requirements Industry Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Interest Selection - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirements Location-based Profile - Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  city: string;

  @Column()
  zipCode: string;

  @ManyToMany(() => Industry)
  @JoinTable({
    name: 'user_industries',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'industry_id', referencedColumnName: 'id' }
  })
  industries: Industry[];

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' }
  })
  interests: Interest[];

  @OneToMany(() => Connection, connection => connection.user)
  connections: Connection[];

  @OneToMany(() => Invite, invite => invite.user)
  invites: Invite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}