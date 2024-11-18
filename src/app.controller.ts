import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/run')
  getStatus(): any {
    return this.appService.getStatus();
  }
  @Get('/health')
  getHello(): any {
    return this.appService.getHello();
  }
}
