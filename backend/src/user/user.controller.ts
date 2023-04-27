import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Req, Res, Next, UseGuards, Request } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jw-auth.guard';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateUserDto, CreateUserDto } from './dto';

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
	async update(@Request() req, @Body() userDto: UpdateUserDto) {
		return await this.userService.updateUser(req.user.name, userDto)
	}

}