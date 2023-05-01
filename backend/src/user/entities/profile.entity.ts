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

@Entity()
export class Profile {
	@PrimaryColumn()
	login: string;

	@Column({ unique: true, nullable: true })
	username: string;

	@Column({ nullable: true })
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

	@Column({ nullable: true })
	status: string;

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
