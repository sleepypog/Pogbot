import { Client, Collection, GatewayIntentBits } from 'discord.js';
import Database from './data/database.js';
import { readdir } from 'fs/promises';

export default class Bot extends Client {

	database;

	commands;
	pogListeners;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			]
		});

		this.database = new Database();

		this.commands = new Collection();
		this.pogListeners = new Collection();

		this.registerCommands();
		this.registerEventListeners();

		// eslint-disable-next-line no-undef
		this.login(process.env.TOKEN);
	}

	/**
	 * @private
	 */
	registerCommands() {
		readdir('./src/commands').then((commands) => {
			for (const command in commands) {
				const { default: module } = import('./commands/' + command);
				this.commands.set(command.replace('.js', ''), module);
				console.debug('Registered command %s', command);
			}
		});
	}

	/**
	 * @private
	 */
	registerEventListeners() {
		readdir('./src/listeners').then((listeners) => {
			for (const listener in listeners) {
				const { default: module } = import('./listeners/' + listener);
				this.on(listener.replace('.js', ''), (...args) => {
					return module(this, args);
				});
				console.debug('Registered listener %s', listener);
			}
		});
	}
}
