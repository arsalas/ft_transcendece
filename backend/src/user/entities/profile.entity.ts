import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  GAME = 'game',
}

@Entity()
export class Profile {
  @PrimaryColumn()
  login: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({
    nullable: true,
    transformer: {
      to(value) {
        return value;
      },
      from(value: string) {
        if (value) return process.env.WEB_URL + '/image/' + value;
        return value;
      },
    },
  })
  avatar: string;

  @Column()
  avatar42: string;

  @Column()
  coallition: string;

  @Column()
  icon: string;

  @Column()
  background: string;

  @Column()
  color: string;

  @Column({ default: 100, type: 'int' })
  ladder: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.OFFLINE,
  })
  status: UserStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  // @OneToOne(() => User)
  // @JoinColumn({ referencedColumnName: "login" })
  // user: User;
}
