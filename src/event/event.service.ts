import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Channel } from '../channel/channel.entity';
import { Event } from './event.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class EventService {
  private lastEventIdMap: Map<number, number> = new Map();
  private channels: Map<number, ReplaySubject<MessageEvent<Event>>> = new Map();
  private subscriberCounts: Map<number, number> = new Map();
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

  subscribeToEvent(
    channelId: number,
    identifier: string,
  ): Observable<MessageEvent<Event>> {
    // If a subject for this channel doesn't exist, create it
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new ReplaySubject());
      this.subscriberCounts.set(channelId, 0);

      // Simulate the event stream using an interval for demonstration purposes
      const intervalMs = 2000; // Change this to your desired interval
      const intervalId = setInterval(async () => {
        const lastEventId = this.lastEventIdMap.get(channelId) || 0;
        const events = await this.eventRepository.find({
          where: {
            channel: { id: channelId },
            identifier: identifier,
            id: MoreThan(lastEventId),
          },
        });

        if (events && events.length > 0) {
          events.forEach((event) => {
            this.lastEventIdMap.set(channelId, event.id); // Update the last observed event ID

            // Emit each event to the client
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.channels.get(channelId).next({ data: event });
          });
        }
      }, intervalMs);

      // Return a teardown function to clean up the interval when all subscribers have unsubscribed
      this.channels.get(channelId).subscribe({
        complete: () => {
          const count = this.subscriberCounts.get(channelId) - 1;
          this.subscriberCounts.set(channelId, count);
          if (count === 0) {
            clearInterval(intervalId);
            this.lastEventIdMap.delete(channelId); // Remove the channel's last event ID when unsubscribed
            this.channels.delete(channelId); // Remove the channel when unsubscribed
          }
        },
      });
    }

    this.subscriberCounts.set(
      channelId,
      this.subscriberCounts.get(channelId) + 1,
    );
    return this.channels.get(channelId).asObservable();
  }
}
