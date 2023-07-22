import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { App } from '../apps/apps.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async createChannel(name: string, app: App): Promise<Channel> {
    const channel = new Channel();
    channel.name = name;
    channel.app = app;
    return this.channelRepository.save(channel);
  }

  async findChannelById(id: number): Promise<Channel | undefined> {
    return this.channelRepository.findOne({
      relations: ['events'],
      where: { id: id },
    });
  }

  async findChannelsByApp(app: App): Promise<Channel[]> {
    return this.channelRepository.find({
      where: { app },
      relations: ['events'],
    });
  }
}
