import { Profile } from 'src/user/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity()
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
}
