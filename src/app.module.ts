import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AppsModule } from './apps/apps.module';
import { ChannelModule } from './channel/channel.module';
import { EventModule } from './event/event.module';
import { User } from './user/user.entity';
import { Event } from './event/event.entity';
import { Channel } from './channel/channel.entity';
import { App } from './apps/apps.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      entities: [User, Event, Channel, App],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AppsModule,
    ChannelModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
