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
import { EventEmitterSubscriber } from './event/event.subscriber';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilsModule } from './utils/utils.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User, Event, Channel, App],
      synchronize: true,
      autoLoadEntities: true,
      subscribers: [EventEmitterSubscriber],
    }),
    AuthModule,
    UserModule,
    AppsModule,
    ChannelModule,
    EventModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
