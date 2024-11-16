import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

export const hbsSetup = (
  app: NestExpressApplication,
  dirAssets: string,
  dirViews: string
) => {
  app.useStaticAssets(join(__dirname, dirAssets));
  app.setBaseViewsDir(join(__dirname, dirViews));
  app.setViewEngine('hbs');
};
