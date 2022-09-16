import { MessageEmbed } from 'discord.js';

/**
 * @type {import('../types').Command}
 */
export default {
	guildOnly: true,
	requireAdmin: false,
	data: {
		name: 'leaderboard',
		description: 'See top scores for this guild.',
		options: [
			{
				name: 'amount',
				description: 'How many places to fetch.',
				type: 'INTEGER',
				minValue: 3,
				maxValue: 10
			}
		]
	},
	execute: async (client, interaction) => {
		const members = await client.database.getTopMembers(interaction.guildId);

		if (members.length === 0) {
			return await interaction.reply('😮 This is awkward, ' + interaction.guild.name + ' does not have any saved scores at all! Try using `/score` first.');
		}

		const embed = new MessageEmbed();

		embed.setTitle('Leaderboard for ' + interaction.guild.name);
		embed.setColor('Blueple');

		const scores = [];
		members.forEach((member) => {
			scores.push('<@' + member.get('member_id') + '> ' + member.get('score') + ' points');
		});

		embed.setDescription(scores.join('\n'));

		await interaction.reply({
			embeds: [ embed ]
		});
	}
};
