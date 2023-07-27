import { Body, Controller, Post, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { ChannelService } from '../channel/channel.service';
import { AuthorizedRequest } from '../auth/auth.middleware';
import CreateEventDto from './dto/createEventDto';
import { UtilsService } from '../utils/utils.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventsService: EventService,
    private readonly channelsService: ChannelService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  async createEvent(
    @Request() request: AuthorizedRequest,
    @Body() eventData: CreateEventDto,
  ) {
    const { channel } = await this.utilsService.isChannelOwned(
      eventData.channel_id,
      request.user.id,
    );
    return await this.eventsService.createEvent(
      eventData.identifier,
      eventData.payload,
      channel,
    );
  }
}
