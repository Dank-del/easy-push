import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventService } from './event.service';

@Injectable()
export class EventEmitterSubscriber {
  constructor(private readonly eventsService: EventService) {}

  @OnEvent('event.created')
  async handleEventCreated(event: any) {
    await this.eventsService.emitEvent(event);
  }
}
