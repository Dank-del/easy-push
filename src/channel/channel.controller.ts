import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Sse,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { AuthorizedRequest } from '../auth/auth.middleware';
import createChannelDto from './dto/createChannelDto';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelsService: ChannelService,
    private readonly utilsService: UtilsService,
  ) {}
  @Sse('/:channelId/subscribe')
  async subscribeToChannel(
    @Request() request: AuthorizedRequest,
    @Param('channelId') channelId: number,
  ) {
    const { channel } = await this.utilsService.isChannelOwned(
      channelId,
      request.user.id,
    );

    return new Observable((observer) => {
      const eventStream = this.channelsService.subscribeToChannel(channel.id);

      eventStream.subscribe((event) => {
        // Format the event payload as needed before sending
        const formattedEvent = {
          id: event.id,
          identifier: event.identifier,
          payload: event.payload,
        };

        observer.next({ data: formattedEvent });
      });
    });
  }

  @Get(':id')
  async getChannel(
    @Request() request: AuthorizedRequest,
    @Param('id') id: number,
  ) {
    const { channel } = await this.utilsService.isChannelOwned(
      id,
      request.user.id,
    );
    return channel;
  }

  @Post()
  async createChannel(
    @Request() request: AuthorizedRequest,
    @Body() data: createChannelDto,
  ): Promise<Channel> {
    const app = await this.utilsService.isAppOwned(data.appId, request.user.id);
    return this.channelsService.createChannel(data.name, app);
  }

  @Put(':id')
  async updateChannel(
    @Request() request: AuthorizedRequest,
    @Param('id') id: number,
    @Body() channelData: Partial<Channel>,
  ) {
    await this.utilsService.isChannelOwned(channelData.id, request.user.id);
    return this.channelsService.updateChannel(id, channelData);
  }

  @Delete(':id')
  async deleteChannel(
    @Request() request: AuthorizedRequest,
    @Param('id') id: number,
  ) {
    const { channel } = await this.utilsService.isChannelOwned(
      id,
      request.user.id,
    );
    return await this.channelsService.deleteChannel(channel.id);
  }
}
