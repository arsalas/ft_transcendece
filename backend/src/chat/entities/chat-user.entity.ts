import { User } from 'src/user/entities';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isOwner: boolean;

  @Column()
  isAdmin: boolean;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  chatRoomId: ChatRoom;

  @OneToOne(() => User, (user) => user.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  userId: User;
}
