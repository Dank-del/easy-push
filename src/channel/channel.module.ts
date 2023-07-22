import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';

@Module({
  providers: [ChannelService],
  imports: [TypeOrmModule.forFeature([Channel])],
})
export class ChannelModule {}
