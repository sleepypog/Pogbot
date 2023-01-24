import { Client, Intents, Options, Constants, Collection } from 'discord.js';
import { Logger, format, transports } from 'winston';

import { readdirSync } from 'fs';

import { PogListener } from './object/PogListener.js';
import { FinalizedCommand } from './object/command';
import { Translation } from './object/Translation.js';
// TODO: Get this working as an directory import
import { finalize } from './utils';
import { Storage } from './data';
import { AlreadyInitializedError } from './errors.js';
import { DiscordHandler } from './object/DiscordHandler';

export class Pogbot extends Client {

    /**
     * Use the {@link instance} getter/setter instead.
     * @internal
     */
    private static _instance: Pogbot;

    /**
     * Use the {@link translator} getter/setter instead.
     * @internal
     */
    private _translator: Translation;

    /**
     * Use the {@link logger} getter/setter instead.
     * @internal
     */
    private _logger: Logger;

    /**
     * Use the {@link storage} getter/setter instead.
     * @internal
     */
    private _storage?: Storage;

    readonly commands: Collection<string, FinalizedCommand> = new Collection<string, FinalizedCommand>;
    readonly pogListeners: Collection<string, PogListener> = new Collection<string, PogListener>;
    
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

        // TODO: Remove this, FeatureUnavailableError test.
        Translation.of('s');

        this._logger = this.setupLogger();
        this._translator = this.setupTranslation();

        this.setupHandlers();
		this.setupCommands();

        this.storage = new Storage();

		this.login(token)
			.then(() => {
                // TODO: string
                this._logger.info(Translation.of(''))
			}).catch((error: Error) => {
                // TODO: string
                this._logger.error(Translation.of(''))
			})
    }

    private setupLogger(): Logger {
        return new Logger({
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.simple()
            ),
            transports: [ new transports.Console ]
        });
    }

    private setupTranslation(): Translation {
        return new Translation();
    }

    private setupHandlers(): void {
        this.logger.debug('Registering event handlers');

        const files = readdirSync('./handlers').filter((filename) => {
            return filename.endsWith('.js');
        });

        for (const file of files) {
            import('./handlers/' + file).then(({ default: module }) => {
                const { name, kind, execute }: DiscordHandler = module;

            });
        }
    }

	private setupCommands(): void {
		this.logger.debug('Registering commands');

		const files = readdirSync('./commands').filter((filename) => {
			return filename.endsWith('.js');
		});

		for (const file of files) {
			import('./commands/' + file).then(({ default: module }) => {
                const { name, _json }: FinalizedCommand = finalize(module);

				this.commands.set(name, module);
				this.application?.commands.create(_json).then((command) => {
                    module._id = command.id;
					this.logger.silly(`Registered command ${name}, version ${command.version}`);
				});
			});
		}
	}

    get logger(): Logger {
        return this._logger as Logger;
    }

    set logger(winston) {
        if (this._logger === undefined)
            this._logger = winston;
        else
            throw new AlreadyInitializedError('Pogbot#logger')
    }

    static get instance(): Pogbot {
        return Pogbot._instance;
    }

    static set instance(bot) {
        if (this._instance === undefined)
            this._instance = bot;
        else
            throw new AlreadyInitializedError('Pogbot#instance');
    }

    get storage(): Storage {
        return this._storage as Storage;
    }

    set storage(db: Storage) {
        if (this._storage === undefined)
            this._storage = db;
        else
            throw new AlreadyInitializedError('Pogbot#storage');
    }
}
