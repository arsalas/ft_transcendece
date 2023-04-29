import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageController } from './image/image.controller';
import { ImageHelpers } from './image/image.helpers';
import { CommonModule } from './common/common.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'database',
			port: 5432,
			username: 'root',
			password: 'trascendencepass',
			database: 'transcendence',
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true
		}),
		HttpModule,
		UserModule, AuthModule, CommonModule
	],
	controllers: [AppController, ImageController],
	providers: [AppService, ImageHelpers],

})
export class AppModule { }
