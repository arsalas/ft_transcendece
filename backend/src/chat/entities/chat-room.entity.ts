import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column( {nullable: true })
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  password: string;
}
