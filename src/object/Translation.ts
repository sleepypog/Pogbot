import i18n from 'i18next';
import Backend, { FsBackendOptions } from 'i18next-fs-backend';
import { FeatureUnavailableError } from '../errors.js';
import { Pogbot } from '../Pogbot';
import { BUILD_BRANCH, BUILD_COMMIT } from '../utils';

export class Translation {

	/**
	 * Context passed to all translation calls, allows for variables to be used independent of the string.
	 * Later merged with additional context.
	 */
	private static context: StringContext;

	public constructor() {
		i18n.use(Backend)
			.init<FsBackendOptions>({
				initImmediate: false,
				ns: [ 'pogbot' ],
				defaultNS: 'pogbot',
				backend: {
					loadPath: '../../resources/lang/{{lng}}.json5'
				}
			});

		Translation.context = this.getSharedContext();
	}

	public static of(key: string, additionalContext?: object): string {
		const context = { ... this.context, ... additionalContext ?? {}}

		if (i18n.isInitialized) {
			throw new FeatureUnavailableError('Translation class has not been initialized.')
		}
		return i18n.t(key, context);
	}

	private getSharedContext(): StringContext {
		return {
			me: {
				name: Pogbot.instance.user?.username,
				id: Pogbot.instance.user?.id
			}
		};
	}
}

export type StringContext = {

	/**
	 * Client/bot user data.
	 */
	me?: {
		name?: string,
		id?: string,
	},

	/**
	 * Error if applicable
	 */
	error?: Error
}
