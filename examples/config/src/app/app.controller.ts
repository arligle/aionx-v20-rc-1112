import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  show(): void {
    return this.appService.show();
  }
  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }
}
