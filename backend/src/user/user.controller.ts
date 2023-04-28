import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Req, Res, Next, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jw-auth.guard';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateUserDto, CreateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }


	@Get()
	findAll(@Request() req) {
		console.log(req.user)
		return req.user
	}




	@Put()
	@UseInterceptors(FileInterceptor(
		'file', // Nombre input formulario
		{
			// Donde se va a guardar
			storage: diskStorage({
				destination: './uploads',
				filename: function (req, file, cb) {
					cb(null, Date.now() + '_' + file.originalname)
				}
			})
		}
	))
	async update(@Request() req, @Body() userDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
		if (file)
			console.log(file)
		return await this.userService.updateUser(req.user.name, userDto, file)
	}

}