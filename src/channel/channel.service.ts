import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { App } from '../apps/apps.entity';
import { Event } from '../event/event.entity';
import { Observable, ReplaySubject } from 'rxjs';
import { EventService } from '../event/event.service';
@Injectable()
export class ChannelService {
  private lastEventIdMap: Map<number, number> = new Map();
  private channels: Map<number, ReplaySubject<MessageEvent<Event>>> = new Map();
  private subscriberCounts: Map<number, number> = new Map();

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private eventService: EventService,
  ) {}

  async createChannel(name: string, app: App): Promise<Channel> {
    const channel = new Channel();
    channel.name = name;
    channel.app = app;
    return this.channelRepository.save(channel);
  }

  subscribeToChannel(channelId: number): Observable<MessageEvent<Event>> {
    // If a subject for this channel doesn't exist, create it
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new ReplaySubject());
      this.subscriberCounts.set(channelId, 0);

      // Simulate the event stream using an interval for demonstration purposes
      const intervalMs = 2000; // Change this to your desired interval
      const intervalId = setInterval(async () => {
        const lastEventId = this.lastEventIdMap.get(channelId) || 0;
        const events = await this.eventService.eventRepository.find({
          where: { channel: { id: channelId }, id: MoreThan(lastEventId) },
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

  async findChannelById(id: number): Promise<Channel | undefined> {
    return this.channelRepository.findOne({
      relations: ['events', 'app'],
      where: { id: id },
    });
  }

  async updateChannel(id: number, updated: Partial<Channel>) {
    return await this.channelRepository.update(id, updated);
  }

  async deleteChannel(id: number) {
    return await this.channelRepository.delete(id);
  }

  async findChannelsByApp(app: App): Promise<Channel[]> {
    return this.channelRepository.find({
      where: { app },
      relations: ['events', 'user'],
    });
  }
}
