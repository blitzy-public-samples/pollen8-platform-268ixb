import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Invite } from './invite.entity';

/**
 * InviteAnalytics entity representing the structure and properties of invite analytics in the Pollen8 platform database.
 * @description This class defines the InviteAnalytics entity for the Pollen8 platform, representing the structure and relationships of invite analytics in the database.
 * @requirements Click Analytics - Store detailed analytics for invite links (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements 30-day Activity Visualization - Store daily click data for invite analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */
@Entity('invite_analytics')
export class InviteAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inviteId: string;

  @Column('int', { array: true, default: [] })
  dailyClicks: number[];

  @Column('date')
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Invite, invite => invite.analytics)
  @JoinColumn({ name: 'inviteId' })
  invite: Invite;

  constructor(partial: Partial<InviteAnalytics> = {}) {
    Object.assign(this, partial);
  }
}