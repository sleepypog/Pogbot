import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import { Context } from 'vm';

import { Pogbot } from '../Pogbot.js';
import { AlreadyInitializedError } from '../errors';
import { Member } from './models/Member.js';
import { Guild } from './models/Guild.js';

export class Storage {

    /**
     * Use the {@link instance} getter/setter instead.
     * @internal
     */
    private static _instance: Storage;

    /**
     * @internal
     */
    private _sequelize: Sequelize;

    /**
     * @internal
     */
    private _umzug: Umzug;

    constructor() {
        Storage.instance = this;

        this._sequelize = this.setupSequelize();
        this._umzug = this.setupUmzug();
    }

    private setupSequelize(): Sequelize {
        return new Sequelize(process.env.DATABASE_URL as string, {
            logging: false,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            models: [ Guild, Member ]
        })
    }

    private setupUmzug(): Umzug {
        return new Umzug({
            migrations: {
                glob: './migrations/*.js'
            },
            context: this._sequelize.getQueryInterface() as Context,
            logger: Pogbot.instance.logger
        });
    }

    /**
     * Umzug type helper
     * @internal
     */
    get migrationType() {
        return this._umzug._types.migration;
    }

    static get instance(): Storage {
        return this._instance;
    }

    static set instance(db) {
        if (this._instance === undefined)
            this._instance = db;
        else
            throw new AlreadyInitializedError('Pogbot#instance');
    }
}

export type Migration = typeof Storage.instance.migrationType;
