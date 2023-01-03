/**
 * @type {import("../types/index.d.ts").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: false,
	data: {
		name: 'score',
		description: 'Get the amount of points you (or someone else has).',
		options: [
			{
				name: 'user',
				description: 'The user to fetch score for. Defaults to you.',
				type: 'USER',
			},
		]
	},
	execute: async (client, interaction) => {
		const who = interaction.options.getUser('user') ?? interaction.user;
		const score = (await client.database.getMember(interaction.guildId, who.id)).get('score');
		await interaction.reply({
			content: (who.id === interaction.user.id ? 'You have ' : '<@' + who.id + '> has ') + score + ' points in this guild.',
			ephemeral: true
		});
	}
};
