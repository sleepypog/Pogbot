import { Column, ForeignKey, Model, PrimaryKey } from 'sequelize-typescript';
import { Member } from './Member';

export class Guild extends Model {
	@PrimaryKey
	@Column
	guild_id: string;

	@Column
	triggers: string;

	@Column
	channels: string;

	@ForeignKey(() => Member)
	@Column
	master: string;
};
