import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Industry } from './industry.entity';
import { Interest } from './interest.entity';
import { Connection } from './connection.entity';
import { Invite } from './invite.entity';

/**
 * User entity representing the structure and properties of a user in the Pollen8 platform database.
 * @description This class defines the User entity for the Pollen8 platform, representing the structure and properties of a user in the database.
 * @requirements User Profile - Define user entity with required fields (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Phone Verification - Include phone number field for verification (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Location Awareness - Include location-related fields (Technical Specification/1.1 System Objectives/Verified Connections)
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}