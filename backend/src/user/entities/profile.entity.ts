import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity()
export class Profile {
	@PrimaryColumn()
	login: string;

	@Column({ unique: true, nullable: true })
	username: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ default: false })
	tfa: boolean;

	@Column({ nullable: true })
	status: string;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;
}
