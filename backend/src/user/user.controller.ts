import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
import { UserService } from './user.service';

// @ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }
	// @UseGuards(JwtAuthGuard)
}