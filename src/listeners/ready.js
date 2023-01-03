/**
 * @param {import('../bot').default} client
 */
export default async function (client) {
	const { tag, id } = client.user;
	client.logger.info(`Logged in as ${tag} (${id})`);
	client.logger.silly(`Using intents: ${client.application.flags.toArray().join(', ')}`);
}
