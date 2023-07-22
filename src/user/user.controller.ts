import { Controller, Get, Request } from '@nestjs/common';
import { AuthorizedRequest } from '../auth/auth.middleware';

@Controller('user')
export class UserController {
  @Get('/getme')
  getMe(@Request() request: AuthorizedRequest) {
    return request.user;
  }
}
