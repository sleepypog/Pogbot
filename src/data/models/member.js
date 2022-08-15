import { DataTypes } from 'sequelize';

export default {
	guild_id: {
		type: DataTypes.STRING,
	},
	member_id: {
		type: DataTypes.STRING
	},
	score: {
		type: DataTypes.INTEGER
	}
};
