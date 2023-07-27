import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async createUser(username: string, password: string): Promise<User> {
    const existing = await this.findByUsername(username);
    if (existing) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    return this.userRepository.save(user);
  }
  async validatePassword(password: string, userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    console.log(password);
    return await bcrypt.compare(password, user.password);
  }
}
