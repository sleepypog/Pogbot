import { EmbedBuilder } from 'discord.js';

/**
 * @type {import('.').Command}
 */
export default {
	guildOnly: true,
	requireAdmin: false,
	data: {
		name: 'leaderboard',
		description: 'See top scores for this guild.'
	},
	execute: async (client, interaction) => {
		const embed = new EmbedBuilder();
		const guild = await client.database.getTopMembers(interaction.guildId);
	}
};
