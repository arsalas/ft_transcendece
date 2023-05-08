import { Module } from '@nestjs/common';
import { NotificationsWsService } from './notifications-ws.service';
import { NotificationsWsGateway } from './notifications-ws.gateway';

import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  providers: [NotificationsWsGateway, NotificationsWsService],
  imports: [AuthModule, FriendsModule],
})
export class NotificationsWsModule {}
