import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from './apps.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App)
    private appRepository: Repository<App>,
  ) {}

  async createApp(name: string, creator: User): Promise<App> {
    const app = new App();
    app.name = name;
    app.creator = creator;
    return this.appRepository.save(app);
  }

  async findAppById(id: number): Promise<App | undefined> {
    return this.appRepository.findOne({
      relations: ['creator', 'channels'],
      where: {
        id: id,
      },
    });
  }

  async findAppsByUser(user: User): Promise<App[]> {
    return this.appRepository.find({
      where: { creator: user },
      relations: ['channels'],
    });
  }

  async deleteAppById(id: number) {
    return await this.appRepository.delete(id);
  }

  async patchAppById(id: number, newData: App) {
    return await this.appRepository.update(id, newData);
  }
}
