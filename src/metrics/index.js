import { Pushgateway } from 'prom-client';
export default class PrometheusMetrics {
	
	gateway;

	constructor() {
		this.gateway = new Pushgateway();
	}
}
