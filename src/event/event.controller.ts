import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
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

  @Get('/:channelId/list')
  async listEvents(
    @Request() request: AuthorizedRequest,
    @Param('channelId') channelId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const { channel } = await this.utilsService.isChannelOwned(
      channelId,
      request.user.id,
    );
    return await this.eventsService.listEvents(
      channel.id,
      page || 1,
      limit || 10,
    );
  }
}
