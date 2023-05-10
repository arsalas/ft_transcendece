import { Profile } from 'src/user/entities';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public activedAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  sender: Profile;

  @ManyToOne(() => Profile, (profile) => profile.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  reciver: Profile;
}
