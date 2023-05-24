import { Profile } from 'src/user/entities';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity()
@Index(['userId', 'game'], { unique: true }) // Here
export class GameUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  userId: Profile;

  @ManyToOne(() => Game, (game) => game.id, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  game: Game;

  @Column({ nullable: true })
  result: number;

  @Column({ nullable: true })
  isWinner: boolean;
}
