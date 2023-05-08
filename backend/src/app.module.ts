import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageController } from './image/image.controller';
import { ImageHelpers } from './image/image.helpers';
import { CommonModule } from './common/common.module';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { FriendsModule } from './friends/friends.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { NotificationsWsModule } from './notifications-ws/notifications-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: Number(process.env.BBDD_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    HttpModule,
    UserModule,
    AuthModule,
    CommonModule,
    FriendsModule,
    MessagesWsModule,
    NotificationsWsModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, ImageHelpers],
})
export class AppModule { }
