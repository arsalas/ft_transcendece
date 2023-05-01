import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { ActivateTFADto } from './dto/activate-TFA.dto';
import { ConfirmTFADto } from './dto';
import { JwtPayload } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signin/:code')
  async signIn(@Param('code') code: string) {
    return await this.authService.signIn(code);
  }

  @Post('confirm-tfa')
  async confirmTFA(@Body() confirmTFADto: ConfirmTFADto) {
    return await this.authService.confirmTFA(confirmTFADto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recover-session')
  async recoverSession(@Request() { user }: { user: JwtPayload }) {
    return await this.authService.recoverSession(user.login, user.avatar42);
  }

  @UseGuards(JwtAuthGuard)
  @Get('generate-tfa')
  async generateTFASecret(@Request() { user }: { user: JwtPayload }) {
    return await this.authService.generateTFASecret(user.login);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-tfa')
  async activateTFASecret(
    @Request() { user }: { user: JwtPayload },
    @Body() activateTFADto: ActivateTFADto,
  ) {
    return this.authService.activateTFASecret(user.login, activateTFADto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('desactivate-tfa')
  async desactivateTFASecret(
    @Request() { user }: { user: JwtPayload },
    @Body() activateTFADto: ActivateTFADto,
  ) {
    return this.authService.desactivateTFASecret(
      user.login,
      activateTFADto.token,
    );
  }
}
