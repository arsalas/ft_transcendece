import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ TypeOrmModule.forFeature([User]), // queremos interactuar con la capa de datos de usuarios para hacer el login si existe
    JwtModule.register({
    global: true,
    secret: "secret",
    signOptions: { expiresIn: '24h' }, // el código del usuario expira en 24 horas
  }),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }