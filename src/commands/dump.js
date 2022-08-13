/**
 * @type {import(".").Command}
 */
export default {
	guildOnly: true,
	devOnly: true,
	requireAdmin: true,
	data: {
		name: 'dump',
		description: 'Dump information about this guild.',
		dmPermission: false
	},
	execute: async (interaction) => {
		interaction.reply('Hey!');
	}
};
