import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jw-auth.guard';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }


	@UseGuards(JwtAuthGuard)
	@Get()
	findAll() {
		return 'todos los usuario'
	}
}