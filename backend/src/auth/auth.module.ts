import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { Profile, User } from 'src/user/entities';
import { ImageHelpers } from 'src/image/image.helpers';
import { JwtStrategy } from './jwt.strategy';
import { CommonModule } from 'src/common/common.module';
import { Api42Service, TfaService } from 'src/common/services';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from 'src/game/game.module';
// import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([User, Profile]), // queremos interactuar con la capa de datos de usuarios para hacer el login si existe
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }, // el código del usuario expira en 24 horas
    }),
    UserModule,
    CommonModule,
    ConfigModule,
    GameModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Api42Service,
    TfaService,
    UserService,
    JwtService,
    JwtStrategy,
    ImageHelpers,
  ],
  exports: [JwtModule, JwtStrategy, TypeOrmModule],
})
export class AuthModule {}
