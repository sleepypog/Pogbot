import { Client, Collection, Intents } from 'discord.js';
import Database from './data/database.js';
import { readdir } from 'fs/promises';
import { buildData } from './utils/commandUtils.js';
import { createLogger, format, transports} from 'winston';

export default class Bot extends Client {

	database;

	/**
	 * @type {Collection<string, import('./types/index.js').Command>}
	 */
	commands;

	/**
	 * @type {Collection<string, import('./types/index.js').Listener}
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
			}
		});

		this.logger = createLogger({
			format: format.combine(
				format.colorize(),
				format.simple()
			),
			transports: [ 
				new transports.Console({
					level: 'debug'
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

	/**
	 * @private
	 */
	registerCommands() {
		this.logger.silly('Registering commands');
		readdir('./src/commands').then((commands) => {
			for (const command of commands) {
				if (command.endsWith('.js')) {
					import('./commands/' + command).then(({ default: module }) => {
						this.commands.set(command.replace('.js', ''), module);
						this.logger.silly('Registering command ' + module.data.name);
						this.application.commands.create(buildData(module).data).then((data) => {
							module._commandId = data.id;
							this.logger.silly('Registered command ' + module.data.name + ', version ' + data.version);
						});
					});
				}
			}
		});
	}

	/**
	 * @private
	 */
	registerEventListeners() {
		this.logger.silly('Registering event listeners');
		readdir('./src/listeners').then((listeners) => {
			for (const listener of listeners) {
				if (listener.endsWith('.js')) {
					import('./listeners/' + listener).then(({ default: module }) => {
						this.on(listener.replace('.js', ''), (...args) => {
							return module(this, args);
						});
						this.logger.silly('Registered listener ' + listener);
					});
				}
			}
		});
	}
}
