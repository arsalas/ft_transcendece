import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly userService: AuthService) { }

	@Get("signin/:code")
	async signIn(@Param('code') code: string) {
		return await this.userService.signIn(code);
	}

	@UseGuards(JwtAuthGuard)
	@Get("signin/recover-session")
	async recoverSession(@Request() req) {
		console.log(req.user.name)
		return req.user;
	}
}