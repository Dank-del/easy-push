import { Module } from '@nestjs/common';
import { AppService } from './apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './apps.entity';
import { AppsController } from './apps.controller';

@Module({
  providers: [AppService],
  imports: [TypeOrmModule.forFeature([App])],
  controllers: [AppsController],
  exports: [AppService],
})
export class AppsModule {}
