import { Profile } from 'src/user/entities';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Index(['user', 'blockUser'], { unique: true }) // Here
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  user: Profile;

  @ManyToOne(() => Profile, (profile) => profile.login, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  blockUser: Profile;

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
}
