/**
 * @type {import("../types").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: false,
	data: {
		name: 'master',
		description: 'See the current Pog master for the guild.',
	},
	execute: async (client, interaction) => {
		const guild = await client.database.getGuild(interaction.guildId);
		const master = guild.get('master');

		if (master === '') {
			await interaction.reply({
				content: 'This guild has not crowned their Pog Master yet.',
			});
		} else {
			const { nickname } = await interaction.guild.members.fetch(master);
			await interaction.reply({
				content: '👑 The Pog Master of ' + interaction.guild.name + ' is ' + nickname
			});
		}
	}
};
