import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }

  @Get()
  @Render('index')
  root() {

    return {
      message: 'Hello world!!!!!!',
      title: 'Nest.js Drizzle Kits',
      imagePath: '_media/kiwi.svg',
    };
  }
}
