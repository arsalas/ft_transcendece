import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
	@PrimaryColumn()
	login: string;

	@Column({ default: false })
	twoFactorAuth: boolean;

	@Column({ nullable: true })
	secret: string;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;

	// @OneToOne(() => Profile)
	// profile: Profile;
}
