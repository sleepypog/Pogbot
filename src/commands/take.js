/**
 * @type {import("../types/index.d.ts").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: true,
	data: {
		name: 'take',
		description: 'Take points from the specified user.',
		options: [
			{
				name: 'user',
				description: 'The user you want to take points from.',
				required: true,
				type: 'USER',
			},
			{
				name: 'points',
				description: 'How many points to take. Defaults to one.',
				type: 'INTEGER',
			},
		]
	},
	execute: async (client, interaction) => {
		const { id } = interaction.options.getUser('user', true);
		const member = await client.database.getMember(interaction.guildId, id);
		const amount = interaction.options.getInteger('points') ?? 1;

		await member.decrement('score', { by: amount });
		await member.reload();

		await interaction.reply({
			content: 'Took ' + amount + ' points from <@' + id + '>',
		});
	}
};
