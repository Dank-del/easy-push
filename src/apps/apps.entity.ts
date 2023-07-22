import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add other app-related fields here as needed

  @ManyToOne(() => User, (user) => user.createdApps)
  creator: User;

  @OneToMany(() => Channel, (channel) => channel.app)
  channels: Channel[];
}
