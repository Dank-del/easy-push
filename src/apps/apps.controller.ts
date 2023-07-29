import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { AuthorizedRequest } from '../auth/auth.middleware';
import CreateAppDto from './dto/createAppDto';
import { AppService } from './apps.service';
import { UtilsService } from '../utils/utils.service';

@Controller('apps')
export class AppsController {
  constructor(
    private appService: AppService,
    private utilsService: UtilsService,
  ) {}
  @Post()
  async createApp(
    @Request() request: AuthorizedRequest,
    @Body() body: CreateAppDto,
  ) {
    return await this.appService.createApp(body.name, request.user);
  }
  @Get(':id')
  async getApp(@Request() request: AuthorizedRequest, @Param('id') id: number) {
    return await this.utilsService.isAppOwned(id, request.user.id);
  }
  @Patch(':id')
  async editApp(
    @Request() request: AuthorizedRequest,
    @Param('id') id: number,
    @Body() body: CreateAppDto,
  ) {
    const app = await this.utilsService.isAppOwned(id, request.user.id);
    return await this.appService.patchAppById(id, {
      ...app,
      name: body.name,
    });
  }

  @Delete(':id')
  async deleteApp(
    @Request() request: AuthorizedRequest,
    @Param('id') id: number,
  ) {
    const app = await this.utilsService.isAppOwned(id, request.user.id);
    return await this.appService.deleteAppById(app.id);
  }

  @Get()
  async getAllApps(@Request() request: AuthorizedRequest) {
    return await this.appService.findAppsByUser(request.user);
  }
}
