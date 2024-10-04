import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Invite entity representing the structure and properties of an invite in the Pollen8 platform database.
 * @description This class defines the Invite entity for the Pollen8 platform, representing the structure and relationships of an invite in the database.
 * @requirements Invite System - Define entity for trackable invite links (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements Click Analytics - Store click count for invites (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements 30-day Activity Visualization - Store creation date for invite analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */
@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @Column({ default: 0 })
  clickCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.invites)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Placeholder for the InviteAnalytics relationship.
   * This will be properly implemented once the InviteAnalytics entity is created.
   */
  // @OneToOne(() => InviteAnalytics, analytics => analytics.invite)
  // analytics: InviteAnalytics;

  constructor(partial: Partial<Invite> = {}) {
    Object.assign(this, partial);
  }
}