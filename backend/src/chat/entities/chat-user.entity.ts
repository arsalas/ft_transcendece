import { User } from 'src/user/entities';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isOwner: boolean;

  @Column()
  isAdmin: boolean;

  @Column({type: 'timestamptz', nullable: true})
  mutedTo:Date;

  @Column({default: false})
  isBanned:boolean;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, (user) => user.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  user: User;
}
