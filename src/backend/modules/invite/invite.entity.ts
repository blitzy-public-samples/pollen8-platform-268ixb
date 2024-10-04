import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * Invite entity representing the structure and properties of invite objects in the database.
 * @description This class defines the Invite entity, representing invite links in the Pollen8 platform.
 * @requirements Invite System - Technical specification/1.1 System Objectives/Strategic Growth Tools
 * @requirements Trackable Invite Links - Technical specification/1.1 System Objectives/Strategic Growth Tools
 * @requirements Click Analytics - Technical specification/1.1 System Objectives/Strategic Growth Tools
 */
@Entity('invites')
export class Invite {
  /**
   * Unique identifier for the invite.
   * @description Auto-generated UUID for each invite.
   */
  @PrimaryGeneratedColumn('uuid')
  id: number;

  /**
   * Name or description of the invite.
   * @description A user-friendly name or description for the invite link.
   */
  @Column()
  name: string;

  /**
   * Unique URL for the invite link.
   * @description A unique URL that can be shared for inviting others to the platform.
   * @requirements Trackable Invite Links - Technical specification/1.1 System Objectives/Strategic Growth Tools
   */
  @Column({ unique: true })
  url: string;

  /**
   * Number of clicks on the invite link.
   * @description Tracks the number of times the invite link has been clicked.
   * @requirements Click Analytics - Technical specification/1.1 System Objectives/Strategic Growth Tools
   */
  @Column({ default: 0 })
  clicks: number;

  /**
   * Timestamp of when the invite was created.
   * @description Automatically set when the invite is created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The user who created the invite.
   * @description Establishes a many-to-one relationship with the User entity.
   */
  @ManyToOne(() => User, user => user.invites)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Foreign key for the user relationship.
   * @description Stores the ID of the user who created the invite.
   */
  @Column()
  userId: number;
}