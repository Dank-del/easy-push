import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { App } from '../apps/apps.entity';
import { Event } from '../event/event.entity';
@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add other channel-related fields here as needed

  @ManyToOne(() => App, (app) => app.channels)
  app: App;

  @OneToMany(() => Event, (event) => event.channel)
  events: Event[];
}
