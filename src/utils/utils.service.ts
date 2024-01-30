import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelService } from '../channel/channel.service';
import { AppService } from '../apps/apps.service';

@Injectable()
export class UtilsService {
  constructor(
    private readonly channelsService: ChannelService,
    private readonly appService: AppService,
  ) {}
  async isChannelOwned(channelId: number, userId: number) {
    const channel = await this.channelsService.findChannelById(channelId);
    if (!channel) {
      throw new BadRequestException("This channel doesn't exist");
    }
    const app = await this.appService.findAppById(channel.app.id);
    if (!app) {
      throw new UnauthorizedException(
        "You don't own the app this channel belongs to",
      );
    }
    if (app.creator.id !== userId) {
      throw new UnauthorizedException(
        "You don't own the app this channel belongs to",
      );
    }
    return {
      app: app,
      channel: channel,
    };
  }
  async isAppOwned(appId: number, userId: number) {
    const app = await this.appService.findAppById(appId);
    if (app.creator.id !== userId) {
      throw new UnauthorizedException("You don't own this app");
    }
    return app;
  }
}
