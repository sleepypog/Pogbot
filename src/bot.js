import { Client, Collection, Intents, Options } from 'discord.js';
import Database from './data/database.js';
import { readdirSync } from 'fs';
import { buildData } from './utils/commandUtils.js';
import { createLogger, format, transports } from 'winston';

import readyListener from './listeners/ready.js';
import interactionListener from './listeners/interactionCreate.js';
import messageListener from './listeners/messageCreate.js';

export default class Bot extends Client {

	static instance;

	database;

	/**
	 * @type {Collection<string, import('discord.js').ApplicationCommand>}
	 */
	commands;

	/**
	 * @type {Collection<string, import('./types').Listener>}
	 */
	pogListeners;

	logger;

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.MESSAGE_CONTENT
			],
			presence: {
				activities: [
					{
						name: 'Pog-a-thon',
						type: 'COMPETING'
					}
				]
			},
			makeCache: Options.cacheWithLimits({
				...Options.defaultMakeCacheSettings,
				ReactionManager: 0,
			})
		});

		Bot.setInstance(this);

		this.logger = createLogger({
			format: format.combine(
				format.colorize(),
				format.simple()
			),
			transports: [
				new transports.Console({
					level: 'silly'
				})
			]
		});

		this.database = new Database(this.logger);

		this.commands = new Collection();
		this.pogListeners = new Collection();

		this.registerEventListeners();

		// eslint-disable-next-line no-undef
		this.login(process.env.TOKEN).then(() => {
			this.registerCommands();
		}).catch((error) => {
			this.logger.error('Could not login to Discord: ' + error);
		});

	}

	static getInstance() {
		return this.instance;
	}

	static setInstance(bot) {
		if (this.instance === undefined) {
			this.instance = bot;
		} else {
			throw new Error('Bot.instance is already defined!');
		}
	}

	/**
	 * @private
	 */
	registerCommands() {
		this.logger.debug('Registering commands');
		const files = readdirSync('./src/commands').filter((filename) => {
			return filename.endsWith('.js');
		});

		for (const file of files) {
			import('./commands/' + file).then(({ default: module }) => {
				this.commands.set(module.data.name, module);
				this.application.commands.create(buildData(module).data).then((command) => {
					module._commandId = command.id;
					this.logger.silly(`Registered command ${module.data.name}, version ${command.version}`);
				});
			});
		}
	}

	/**
	 * @private
	 */
	registerEventListeners() {
		this.once('ready', readyListener);
		this.on('messageCreate', (message) => {
			return messageListener(this, message);
		});
		this.on('interactionCreate', (interaction) => {
			// array for compatibility with the existing method.
			return interactionListener(this, [interaction]);
		});
	}
}
