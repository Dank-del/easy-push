import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  providers: [EventService],
  imports: [TypeOrmModule.forFeature([Event])],
})
export class EventModule {}
