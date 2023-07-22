import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createEvent(
    identifier: string,
    payload: Record<string, any>,
    channel: Channel,
  ): Promise<Event> {
    const event = new Event();
    event.identifier = identifier;
    event.payload = payload;
    event.channel = channel;
    return this.eventRepository.save(event);
  }

  async findEventById(id: number): Promise<Event | undefined> {
    return this.eventRepository.findOne({ where: { id: id } });
  }

  // If you need additional methods, you can add them as needed
}
