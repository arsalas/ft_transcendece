import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TfaService, Api42Service } from './services';
import { ImageHelpers } from 'src/image/image.helpers';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [Api42Service, TfaService, ImageHelpers],
})
export class CommonModule {}
