import { DataTypes } from 'sequelize';

export default {
	guild_id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	triggers: {
		type: DataTypes.STRING
	},
	channels: {
		type: DataTypes.STRING
	},
	master: {
		type: DataTypes.STRING
	}
};
