import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  @Get(':filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }
}
