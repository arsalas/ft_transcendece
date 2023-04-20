import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly userService: AuthService) { }

	@Get("signin/:code")
	async signIn(@Param('code') code: string) {
		return await this.userService.signIn(code);
	}
}