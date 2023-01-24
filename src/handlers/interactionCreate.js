import { canManage } from '../utils/index.js';
import { Pogbot } from '../Pogbot.js';

/**
 * @param {import("discord.js").CommandInteraction} interaction
 */
export default async function ([interaction]) {
	const client = Pogbot.instance;

	const { commandName } = interaction;

	if (client.commands.has(commandName)) {
		const command = client.commands.get(commandName);

		if (interaction.isCommand()) {
			if (command.restrictions.isAdminOnly) {
				if (!canManage(interaction.member)) {
					return await interaction.reply('This command is limited to administrators only!');
				}
			}

			command.execute(client, interaction);
		} else if (interaction.isAutocomplete()) {
			command.autocomplete(client, interaction);
		}
	} else {
		client.logger.error(`Command ${commandName} does not have an handler!`);
	}
}
