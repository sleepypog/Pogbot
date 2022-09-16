import { ApplicationCommandOptionType, codeBlock, inlineCode } from 'discord.js';
import { fromArray } from '../utils/arrayUtils.js';
import { buildList } from '../utils/stringUtils.js';

/**
 * @type {import("../types").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: true,
	data: {
		name: 'dump',
		description: 'Dump information for debugging.',
		options: [
			{
				name: 'guild',
				description: 'Multiple guild data.',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'full',
						description: 'Dump all guild data as JSON.',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'triggers',
						description: 'Dump all triggers as an list.',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'channels',
						description: 'Dump all channels as an list.',
						type: ApplicationCommandOptionType.Subcommand
					},
					{
						name: 'master',
						description: 'Dump the ID for the current master.',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			},
		]
	},
	execute: async (client, interaction) => {
		if (interaction.options.getSubcommandGroup(true) === 'guild') {
			const guild = await client.database.getGuild(interaction.guildId);
			switch (interaction.options.getSubcommand(true)) {
			case 'full': {
				await interaction.reply({ 
					content: codeBlock('json', JSON.stringify(guild.toJSON(), null, '\t')), 
					ephemeral: true
				});
				break;
			}
			case 'triggers': {
				await interaction.reply({ 
					content: codeBlock(buildList(fromArray(guild.get('triggers')))), 
					ephemeral: true
				});
				break;
			}
			case 'channels': {
				await interaction.reply({ 
					content: codeBlock(buildList(fromArray(guild.get('channels')))), 
					ephemeral: true
				});
				break;
			}
			case 'master': {
				await interaction.reply({ 
					content: inlineCode(guild.get('master')), 
					ephemeral: true
				});
				break;
			}
			}
		}
	}
};
