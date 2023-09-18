import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your secret key for JWT
      signOptions: { expiresIn: process.env.JWT_LIFETIME }, // Adjust the expiration time as needed
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply the middleware to all routes
  }
}
