import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { Event } from './event.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';

@Injectable()
export class EventService {
  private lastEventIdMap: Map<number, number> = new Map();
  constructor(
    @InjectRepository(Event)
    public eventRepository: Repository<Event>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async emitEvent(event: Event): Promise<void> {
    this.eventEmitter.emit('event.created', event);
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
  subscribeToEvent(channelId: number, eventIdentifier: string) {
    const intervalMs = 2000; // Change this to your desired interval
    return new Observable<Event>((observer) => {
      const intervalId = setInterval(async () => {
        const lastEventId = this.lastEventIdMap.get(channelId) || 0;
        const events = await this.eventRepository.find({
          where: {
            channel: { id: channelId },
            id: MoreThan(lastEventId),
            identifier: eventIdentifier,
          },
        });

        if (events && events.length > 0) {
          events.forEach((event) => {
            this.lastEventIdMap.set(channelId, event.id); // Update the last observed event ID
            observer.next(event); // Emit each event to the client
          });
        }
      }, intervalMs);

      // Return a teardown function to clean up the interval when the client unsubscribes
      return () => {
        clearInterval(intervalId);
        this.lastEventIdMap.delete(channelId); // Remove the channel's last event ID when unsubscribed
      };
    });
  }
}
