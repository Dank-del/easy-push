import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { UserCreateDto } from './dto/user';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('/signup')
  async signUp(@Body() user: UserCreateDto) {
    return await this.usersService.createUser(user.username, user.password);
  }

  @Post('/signin')
  async signIn(@Body() user: UserCreateDto) {
    const verifiedUser = await this.authService.validateUser(
      user.username,
      user.password,
    );
    return await this.authService.generateJwtToken(verifiedUser);
  }
}
