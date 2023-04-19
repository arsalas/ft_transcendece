import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get("signIn/:code")
	async signIn(@Param('code') code: string) {
		return await this.userService.signIn(code);
	}
}
