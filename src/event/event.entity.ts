import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Channel } from '../channel/channel.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column('jsonb')
  payload: Record<string, any>; // Assuming the payload can be any valid JSON

  // Add other event-related fields here as needed

  @ManyToOne(() => Channel, (channel) => channel.events)
  channel: Channel;
}
