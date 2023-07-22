import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { User } from '../user/user.entity';

interface CustomRequest extends Request {
  user: User;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth/')) {
      return next();
    }
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.verify(token);
        const user = await this.usersService.findById(decoded.sub);
        if (user) {
          req.user = user;
          return next(); // Proceed to the next middleware/route handler
        }
      } catch (err) {
        // Token is invalid
        throw new UnauthorizedException(
          'Unauthorized. Please provide a valid token.',
        );
      }
    }

    // If the token is missing or invalid, return an error response
    throw new UnauthorizedException(
      'Unauthorized. Please provide a valid token.',
    );
  }
}
