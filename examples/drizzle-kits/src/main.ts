import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
import { hbsSetup } from './setup';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /*
  指定了静态资源的路径，就可以在模板中直接引用，示例：
    <img src='{{imagePath}}' alt='logo' width='200' height='100' />
    <img src='_media/nest-drizzle.webp' alt='logo' width='250' height='140' />

    @Get()
    @Render('index')
    root() {
      return {
        imagePath: '_media/kiwi.svg',
      };
  }
  */
  // app.useStaticAssets(join(__dirname, 'assets'));
  // app.setBaseViewsDir(join(__dirname,  'views'));
  // app.setViewEngine('hbs');
  hbsSetup(app,'assets','views');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
