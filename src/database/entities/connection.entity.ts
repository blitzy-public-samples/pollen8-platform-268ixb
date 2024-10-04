import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, Unique } from 'typeorm';
import { User } from './user.entity';

/**
 * Connection entity representing the relationship between users in the Pollen8 platform's database schema.
 * @description This class defines the Connection entity, representing the structure and relationships of connections between users.
 * @requirements Quantifiable Networking - Provide measurable network growth metrics (Technical Specification/1.1 System Objectives)
 * @requirements Network Value Calculation - Calculate network value (3.14 per connection) (Technical Specification/1.1 System Objectives)
 */
@Entity('connections')
@Unique(['userId', 'connectedUserId'])
@Index(['userId', 'connectedUserId'])
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  connectedUserId: string;

  /**
   * The calculated value of the connection.
   * @description This value is set to 3.14 as per the Network Value Calculation requirement.
   */
  @Column('float', { default: 3.14 })
  value: number;

  @CreateDateColumn()
  connectedAt: Date;

  @ManyToOne(() => User, user => user.connections)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'connectedUserId' })
  connectedUser: User;

  constructor(partial: Partial<Connection> = {}) {
    Object.assign(this, partial);
  }
}