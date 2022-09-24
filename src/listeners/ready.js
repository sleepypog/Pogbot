/**
 * @param {import('../bot').default} client
 */
export default async function (client) {
	client.logger.info('Logged in as ' + client.user.username);
	client.logger.debug('Using intents: ' + client.application.flags.toArray().join(', '));
}
