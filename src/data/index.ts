import { Sequelize } from 'sequelize';
import { Umzug } from 'umzug';

export class Storage {

    /**
     * @internal
     */
    private _sequelize: Sequelize;

    /**
     * @internal
     */
    private _umzug: Umzug;

    constructor() {
        this.setupSequelize();
        this.setupUmzug();
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
            }
        })
    }

    private setupUmzug(): Umzug {
        return new Umzug({
            migrations
        });
    }
}
