/**
 * @param {import("discord.js").Client} client
 */
export default async function (client) {
	console.log('Logged in as %s!', client.user.username);
	console.debug('Intents: %s', client.application.flags.toArray());
}
