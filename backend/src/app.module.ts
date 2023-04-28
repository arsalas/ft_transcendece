import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageController } from './image/image.controller';

@Module({
	imports: [TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'database',
		port: 5432,
		username: 'root',
		password: 'trascendencepass',
		database: 'transcendence',
		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		synchronize: true
	}), UserModule, AuthModule],
	controllers: [AppController, ImageController],
	providers: [AppService],
	
})
export class AppModule { }
