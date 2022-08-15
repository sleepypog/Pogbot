import { canManageGuild } from '../utils/permissionUtils.js';

/**
 * @param {import("../bot.js").default} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
export default async function (client, [ interaction ]) {
	const { commandName } = interaction;

	if (client.commands.has(commandName)) {
		const command = client.commands.get(commandName);

		if (command.requireAdmin) {
			if (!canManageGuild(interaction.member)) {
				return await interaction.reply('This command is limited to administrators only!');
			}
		}

		command.execute(client, interaction);
	} else {
		console.error('Command %s does not have an handler!', commandName);
	}
}
