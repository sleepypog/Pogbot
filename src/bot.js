import { Client, Collection, GatewayIntentBits } from 'discord.js';
import Database from './data/database.js';
import { readdir } from 'fs/promises';
import { buildData } from './utils/commandUtils.js';

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
		readdir('./src/commands').then((commands) => {
			for (const command of commands) {
				if (command.endsWith('.js')) {
					import('./commands/' + command).then(({ default: module }) => {
						this.commands.set(command.replace('.js', ''), module);
						this.application.commands.create(buildData(module).data);
						console.debug('Registered command %s', command);
					});
				}
			}
		});
	}

	/**
	 * @private
	 */
	registerEventListeners() {
		readdir('./src/listeners').then((listeners) => {
			for (const listener of listeners) {
				if (listener.endsWith('.js')) {
					import('./listeners/' + listener).then(({ default: module }) => {
						this.on(listener.replace('.js', ''), (...args) => {
							return module(this, args);
						});
						console.debug('Registered listener %s', listener);
					});
				}
			}
		});
	}
}
