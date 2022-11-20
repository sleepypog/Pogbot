import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: false })
export class Member extends Model {

	@ForeignKey(() => Guild)
	@Column
	guild_id: string;

	@Column
	member_id: string;

	@Column
	score: number;
}
