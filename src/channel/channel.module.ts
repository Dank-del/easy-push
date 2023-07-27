import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { Event } from '../event/event.entity';
import { EventModule } from '../event/event.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [ChannelService],
  imports: [
    TypeOrmModule.forFeature([Channel, Event]),
    EventModule,
    forwardRef(() => UtilsModule),
  ],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
