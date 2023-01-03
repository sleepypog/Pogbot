/**
 * @type {import("../types/index.d.ts").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: false,
	data: {
		name: 'master',
		description: 'See the current Pog master for the guild.',
	},
	execute: async (client, interaction) => {
		const master = await (await client.database.getGuild(interaction.guildId)).get('master');

		if (master === '') {
			await interaction.reply({
				content: 'This guild has not crowned their Pog Master yet.',
			});
		} else {
			const { displayName } = await interaction.guild.members.fetch(master);
			await interaction.reply({
				content: '👑 The Pog Master of ' + interaction.guild.name + ' is ' + displayName
			});
		}
	}
};
