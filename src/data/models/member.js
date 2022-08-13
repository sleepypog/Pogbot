import { Model, DataTypes } from 'sequelize';

export default class Member extends Model {}

Member.init('member', {
	guild_id: {
		type: DataTypes.STRING,
	},
	member_id: {
		type: DataTypes.STRING
	},
	score: {
		type: DataTypes.INTEGER
	}
}, {
	timestamps: false
});
