import { asPlaceEmoji } from '../utils/stringUtils.js';
import { MessageEmbed } from 'discord.js';

/**
 * @type {import('../types/index.d.ts').Command}
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
		const guild = await client.database.getGuild(interaction.guildId);
		const members = await client.database.getTopMembers(interaction.guildId);

		if (members.length === 0) {
			return await interaction.reply('😮 This is awkward, ' + interaction.guild.name + ' does not have any saved scores at all! Try using `/score` first.');
		}

		const scores = [];
		members.forEach((member, place) => {
			const string = [];
			if (member.get('score') !== 0) {
				if (guild.get('master') === member.get('member_id')) {
					string.push('👑 ');
				}
				if ((place + 1) <= 3) {
					string.push(asPlaceEmoji(place + 1) + ' ');
				}
			}
			string.push(`<@${member.get('member_id')}> ${member.get('score')} pogs`);
			scores.push(string.join(''));
		});

		const embed = new MessageEmbed({
			title: `Leaderboard for ${interaction.guild.name}`,
			color: 'BLURPLE',
			thumbnail: interaction.guild.iconURL(),
			description: scores.join('\n')
		});

		await interaction.reply({
			embeds: [embed]
		});
	}
};
