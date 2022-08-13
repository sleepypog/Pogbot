import { Model, DataTypes } from 'sequelize';

export default class Guild extends Model {
}

Guild.init('guilds', {
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
}, {
	timestamps: false
});
