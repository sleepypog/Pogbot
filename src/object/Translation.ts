import i18n from 'i18next';
import Backend, { FsBackendOptions } from 'i18next-fs-backend';
import { FeatureUnavailableError } from '../errors.js';

export class Translation {
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
	}

	public static of(key: string): string {
		if (i18n.isInitialized) {
			throw new FeatureUnavailableError('Translation class has not been initialized.')
		}
		return i18n.t(key);
	}
}
