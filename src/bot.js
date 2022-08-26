import { Client, Collection, GatewayIntentBits } from 'discord.js';
import Database from './data/database.js';
import { readdir } from 'fs/promises';
import { buildData } from './utils/commandUtils.js';
import { createLogger, format, transports} from 'winston';

export default class Bot extends Client {

	database;

	commands;
	pogListeners;

	logger;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			]
		});

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
						this.application.commands.create(buildData(module).data);
						this.logger.debug('Registered command ' + module.data.name);
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
						this.logger.debug('Registered listener ' + listener);
					});
				}
			}
		});
	}
}
