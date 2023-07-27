import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventController } from './event.controller';
import { ChannelModule } from '../channel/channel.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => ChannelModule),
    forwardRef(() => UtilsModule),
  ],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
