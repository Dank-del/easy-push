import { Module } from '@nestjs/common';
import { AppService } from './apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './apps.entity';

@Module({
  providers: [AppService],
  imports: [TypeOrmModule.forFeature([App])],
})
export class AppsModule {}
