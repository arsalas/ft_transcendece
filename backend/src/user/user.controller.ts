import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jw-auth.guard';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }
	// @UseGuards(JwtAuthGuard)
}