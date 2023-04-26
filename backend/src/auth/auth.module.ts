import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Profile, User } from 'src/user/entities';

@Module({
	imports: [TypeOrmModule.forFeature([User, Profile]), // queremos interactuar con la capa de datos de usuarios para hacer el login si existe
	JwtModule.register({
		global: true,
		secret: 'transcendence2023',
		signOptions: { expiresIn: '24h' }, // el código del usuario expira en 24 horas
	}),],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule { }