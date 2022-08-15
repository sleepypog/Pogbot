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

		this.guilds = this.sequelize.define('guild', Guild, {
			timestamps: false
		});
		
		this.members = this.sequelize.define('member', Member, {
			timestamps: false
		});

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
	}

	/**
 	* Get or create an Pogbot guild from its id.
 	* @param {string} id
 	*/
	async getGuild(id) {
		const [guild, created] = await this.guilds.findOrCreate({
			where: {
				guild_id: id
			},
			defaults: {
				guild_id: id,
				channels: '',
				triggers: '',
				master: ''
			}
		});

		if (created) {
			console.debug(`Created guild ${id}`);
		}

		return guild;
	}
	
	/**
	 * Get or create an Pogbot member.
	 * @param {string} guild
	 * @param {string} user
	 */
	async getMember(guild, user) {
		const [member, created] = await this.members.findOrCreate({
			where: {
				guild_id: guild,
				member_id: user
			},
			defaults: {
				guild_id: guild,
				member_id: user,
				score: 0
			}
		});

		if (created) {
			console.debug(`Created member ${user} in guild ${guild}`);
		}

		return member;
	}

	/**
	 * Get the top members for an guild.
	 * @param {string} guild 
	 * @param {number?} count 
	 */
	async getTopMembers(guild, count) {
		return await this.members.findAll({
			where: {
				guild_id: guild
			},
			order: [
				[
					'id', 'ASC'
				]
			],
			limit: count ?? 5
		});
	}
}
