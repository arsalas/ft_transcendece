import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('image')
export class ImageController {

	@Get(':filename')
	getImage(@Param('filename') filename: string, @Res() res) {
		res.sendFile(filename, { root: './uploads' })
	}
}
