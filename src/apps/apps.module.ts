import { forwardRef, Module } from '@nestjs/common';
import { AppService } from './apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './apps.entity';
import { AppsController } from './apps.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [AppService],
  imports: [TypeOrmModule.forFeature([App]), forwardRef(() => UtilsModule)],
  controllers: [AppsController],
  exports: [AppService],
})
export class AppsModule {}
