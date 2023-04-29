import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { Request as RequestEx } from 'express';
import { ActivateTFADto } from './dto/activate-TFA.dto';
import { ConfirmTFADto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Get("signin/:code")
	async signIn(@Param('code') code: string) {
		return await this.authService.signIn(code);
	}

	@Post("confirm-tfa")
	async confirmTFA(@Body() confirmTFADto: ConfirmTFADto) {
		return await this.authService.confirmTFA(confirmTFADto);
	}

	@UseGuards(JwtAuthGuard)
	@Get("signin/recover-session")
	async recoverSession(@Request() req) {
		console.log(req.user.name)
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Get("generate-tfa")
	async generateTFASecret(@Request() req) {
		console.log(req.user.name)
		return await this.authService.generateTFASecret(req.user.name);
	}

	@UseGuards(JwtAuthGuard)
	@Post("activate-tfa")
	// async activateTFASecret(@Request() req:RequestEx) {
	async activateTFASecret(@Request() req, @Body() activateTFADto: ActivateTFADto) {
		this.authService.activateTFASecret(req.user.name, activateTFADto.token);
		console.log(req.user.name)
		return req.user;
	}
}