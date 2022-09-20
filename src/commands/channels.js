import { MessageEmbed } from 'discord.js';
import { fromArray, toArray } from '../utils/arrayUtils.js';
import { mentionCommand } from '../utils/commandUtils.js';
import { buildList } from '../utils/stringUtils.js';

/**
 * @type {import("../types").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: true,
	data: {
		name: 'channels',
		description: 'Manage listened channels in this guild.',
		options:
			[

				{
					name: 'add',
					description: 'Start listening to an channel.',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'channel',
							description: 'Channel to listen to.',
							required: true,
							type: 'CHANNEL'
						}
					]
				},
				{
					name: 'remove',
					description: 'Stop listening to an channel.',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'channel',
							description: 'Channel to listen to.',
							required: true,
							type: 'CHANNEL'
						}
					]
				},
				{
					name: 'list',
					description: 'List all listened channels.',
					type: 'SUB_COMMAND',
				}
			]
	},
	execute: async (client, interaction) => {
		const subcommand = interaction.options.getSubcommand(true);

		const guild = await client.database.getGuild(interaction.guildId);
		const channels = guild.get('channels');

		switch (subcommand) {
		case 'add': {
			const { id, type } = interaction.options.getChannel('channel', true);
			const array = fromArray(channels);

			if (type !== 'GUILD_TEXT') {
				await interaction.reply('😡 That is not a text channel!');
				return;
			}

			if (array.includes(id)) {
				await interaction.reply('🙁 I\'m already listening to that channel!');
			} else {
				array.push(id);
				(await guild.update({ channels: toArray(array) })).reload();
				await interaction.reply('🔔 Now listening to <#' + id + '>');
			}
			break;
		}
		case 'remove': {
			const { id } = interaction.options.getChannel('channel', true);
			const array = fromArray(channels);

			if (array.includes(id)) {
				delete array[id];
				(await guild.update({ channels: toArray(array) })).reload();
				await interaction.reply('🔕 No longer listening to <#' + id + '>');
			} else {
				await interaction.reply('🙁 Seems like I do not listen to that channel. Did you intend to ' + mentionCommand(client, 'channels add') + ' it instead?');
			}
			break;
		}
		case 'list': {
			const array = fromArray(channels);

			if (array.length === 0) {
				await interaction.reply('🙁 I\'m not listening to any channels!');
			} else {
				const embed = new MessageEmbed();
				embed.setTitle('Listened channels (' + array.length + ')');
				embed.setColor('Blurple');

				embed.setDescription(buildList(array, false));

				await interaction.reply({ embeds: [ embed ] });
			}
			break;
		}
		}
	},
};
