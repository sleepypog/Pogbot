import { config } from 'dotenv';

import Bot from './bot.js';
import PrometheusMetrics from './metrics/index.js';

const startup = performance.now();

config();
new Bot().bindMetrics(new PrometheusMetrics().onMetricEvent({
	type: 'STARTUP',
	count: (performance.now() - startup)
}));
