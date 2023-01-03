import { Client, Intents, Options, Constants, Collection } from 'discord.js';
import { Logger, format, transport } from 'winston';

import { PogListener } from './objects/PogListener.js';
import messageCreate from './listeners/messageCreate.js';
import interactionCreate from './listeners/interactionCreate.js';
import { Command } from './objects/Command.js';

export class Pogbot extends Client {
    /**
     * Use the {@link instance} getter/setter instead.
     * @internal
     */
    static _instance: Pogbot;

    /**
     * Use the {@link logger} getter/setter instead.
     * @internal
     */
    private _logger: Logger;

    private commands: Collection<string, Command>;
    private pogListeners: Collection<string, PogListener>;
    
    constructor(token: string) {
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
                        type: Constants.ActivityTypes.COMPETING
                    }
                ]
            },
            makeCache: Options.cacheWithLimits({
                ... Options.defaultMakeCacheSettings,
                ReactionManager: 0,
            })
        });

        Pogbot.instance = this;

        this.setupLogger();
        this.setupHandlers();

    }

    private setupLogger(): void {
        this.logger = new Logger({
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
            transports: [new transport.Console()]
        })
    }

    private setupHandlers(): void {
        this.once('ready', (client) => {
            this.logger.info(`Logged in as ${client.user.tag}, id ${client.user.id}`);
        });

        this.on('messageCreate', messageCreate);
        this.on('interactionCreate', interactionCreate);
    }

    get logger(): Logger {
        return this._logger;
    }

    set logger(winston) {
        if (this._logger === undefined)
            this._logger = winston;
        else
            throw new Error('Pogbot#logger was already initialized!')
    }

    static get instance(): Pogbot {
        return Pogbot._instance;
    }

    static set instance(bot) {
        if (this._instance === undefined)
            this._instance = bot;
        else
            throw new Error('Pogbot was already initialized!');
    }
}
