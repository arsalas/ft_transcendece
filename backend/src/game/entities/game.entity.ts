import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public startedAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public finishAt: Date;
}
