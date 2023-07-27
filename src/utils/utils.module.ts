import { forwardRef, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { ChannelModule } from '../channel/channel.module';
import { AppsModule } from '../apps/apps.module';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
  imports: [forwardRef(() => ChannelModule), forwardRef(() => AppsModule)],
})
export class UtilsModule {}
