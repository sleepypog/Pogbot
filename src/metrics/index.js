import express from 'express';
import Bot from '../bot';

const METRICS_PORT = 9091;
const METRICS_PATH = "/metrics";

class MetricServer {

	app;

	bot;

	constructor(client) {
		this.app = express();
		this.bot = client;
		this.app.listen(METRICS_PORT, () => {
			this.bot.logger.debug('MetricServer is listening at port ' + METRICS_PORT);
		});
	}
}
