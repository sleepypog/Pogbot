import { DataTypes } from 'sequelize';
import { Column, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Member } from './Member';

@Table
export class Guild extends Model {

	@PrimaryKey
	@Column
	guildId?: string;

	@Column
	triggers?: string;

	@Column
	channels?: string;

	@Column
	@HasOne(() => Member)
	master?: string;

	@Column
	reaction?: string;
}
