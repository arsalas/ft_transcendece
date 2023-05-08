import { User } from 'src/user/entities';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;
 
  @Column()
  isRead: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;


  @ManyToOne(() => User, (user) => user.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  userId: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  chatRoomId: ChatRoom;


}
