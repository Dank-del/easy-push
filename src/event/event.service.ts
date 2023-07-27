import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { Event } from './event.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    public eventRepository: Repository<Event>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async emitEvent(event: Event): Promise<void> {
    this.eventEmitter.emit('event.created', event);
  }

  async subscribeToEvent(eventId: number): Promise<Event> {
    return this.eventRepository.findOne({ where: { id: eventId } });
  }

  async createEvent(
    identifier: string,
    payload: Record<string, any>,
    channel: Channel,
  ) {
    const event = new Event();
    event.identifier = identifier;
    event.payload = payload;
    event.channel = channel;
    return await this.eventRepository.save(event);
  }

  async findEventById(id: number): Promise<Event | undefined> {
    return this.eventRepository.findOne({ where: { id: id } });
  }

  // If you need additional methods, you can add them as needed
}
