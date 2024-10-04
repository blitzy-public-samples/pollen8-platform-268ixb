import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

/**
 * Network entity representing the structure of network connections in the Pollen8 platform.
 * @description This class defines the Network entity, representing a connection between two users in the Pollen8 platform.
 * @requirements Network Data Model - Technical Specification/2.3 Component Diagrams/2.3.2 Backend Components
 * @requirements Connection Value - Technical Specification/1.1 System Objectives
 */
@Entity('network_connections')
export class Network {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  connectedUserId: string;

  /**
   * The calculated value of the connection.
   * @description Stores the value of each connection as per the system objectives.
   */
  @Column({ type: 'float' })
  connectionValue: number;

  @CreateDateColumn()
  connectedAt: Date;

  /**
   * The user who initiated the connection.
   */
  @ManyToOne(() => User, user => user.connections)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * The user who is connected to.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'connectedUserId' })
  connectedUser: User;
}