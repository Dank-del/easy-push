import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { App } from '../apps/apps.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // Add other user-related fields here as needed
  @Column()
  password: string;

  @OneToMany(() => App, (app) => app.creator)
  createdApps: App[];
}
