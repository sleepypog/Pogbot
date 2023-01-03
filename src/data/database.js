import { Sequelize } from 'sequelize';

import Guild from './models/guild.js';
import Member from './models/member.js';

export default class Database {
	/**
	 * Please use the methods in the Database class or individual models instead.
	 * @private
	 */
	sequelize;

	logger;

	guilds;
	members;

	constructor(logger) {
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

		this.logger = logger;

		this.guilds = this.sequelize.define('guild', Guild, {
			timestamps: false
		});

		this.members = this.sequelize.define('member', Member, {
			timestamps: false
		});

		this.initializeAssociations();

		this.sequelize.sync().then(() => {
			this.logger.debug('Synced database!');
		});
	}

	/**
	 * @private
	 */
	initializeAssociations() {
		this.guilds.hasMany(this.members, {
			foreignKey: 'guild_id'
		});

		this.members.belongsTo(this.guilds, {
			foreignKey: 'guild_id'
		});
	}

	/**
	 * Get or create an Pogbot guild from its id.
	 * @param {string} id
	 */
	async getGuild(id) {
		const [guild] = await this.guilds.findOrCreate({
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

		return guild;
	}

	/**
	 * Get or create an Pogbot member.
	 * @param {string} guild
	 * @param {string} user
	 */
	async getMember(guild, user) {
		const associated = await this.getGuild(guild);

		const [member] = await this.members.findOrCreate({
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

		associated.addMember(member);

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
					'score', 'DESC'
				]
			],
			limit: count ?? 5
		});
	}
}
