import { Sequelize } from 'sequelize';

import Guild from './models/guild.js';
import Member from './models/member.js';

export default class Database {
	/**
	 * Please use the methods in the Database class or individual models instead.
	 * @private
	 */
	sequelize;

	guilds;
	members;

	constructor() {
		// eslint-disable-next-line no-undef
		this.sequelize = new Sequelize(process.env.DATABASE_URL, {
			logging: false,
			dialect: 'postgres',
			dialectOptions: {
				ssl: {
					require: true,
					rejectUnauthorized: false
				}
			}
		});

		this.guilds = Guild;
		this.members = Member;

		this.initializeAssociations();

		this.sequelize.sync().then(() => {
			console.debug('Synced database!');
		});
	}

	/**
	 * @private
	 */
	initializeAssociations() {
		this.guilds.hasMany(this.members, {
			foreignKey: 'guild_id'
		});
		this.members.belongsTo(this.members);
	}
}
