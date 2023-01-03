import { MessageEmbed } from 'discord.js';
import { fromArray, toArray } from '../utils/arrayUtils.js';
import { mentionCommand } from '../utils/commandUtils.js';
import { buildList } from '../utils/stringUtils.js';

/**
 * @type {import("../types/index.d.ts").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: true,
	data: {
		name: 'triggers',
		description: 'Manage triggers for this guild.',
		options:
			[

				{
					name: 'add',
					description: 'Add an trigger to this guild.',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'trigger',
							description: 'Trigger to add.',
							required: true,
							type: 'STRING'
						}
					]
				},
				{
					name: 'remove',
					description: 'Remove an trigger from this guild.',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'trigger',
							description: 'Trigger to remove.',
							required: true,
							type: 'INTEGER'
						}
					]
				},
				{
					name: 'list',
					description: 'List all triggers for this guild.',
					type: 'SUB_COMMAND',
				}
			]
	},
	execute: async (client, interaction) => {
		const subcommand = interaction.options.getSubcommand(true);

		const guild = await client.database.getGuild(interaction.guildId);
		const triggers = guild.get('triggers');

		switch (subcommand) {
			case 'add': {
				const trigger = interaction.options.getString('trigger', true);
				const array = fromArray(triggers);

				if (array.includes(trigger)) {
					await interaction.reply('🙁 That trigger already exists!');
				} else {
					if (trigger.includes(',')) {
						await interaction.reply('🙁 That trigger contains invalid characters!');
					} else {
						array.push(trigger);
						(await guild.update({ triggers: toArray(array) })).reload();
						await interaction.reply('🔔 Added trigger `' + trigger + '` at index ' + array.length);
					}
				}
				break;
			}
			case 'remove': {
				const trigger = interaction.options.getInteger('trigger', true);
				const array = fromArray(triggers);

				if (array.length <= trigger) {
					await interaction.reply('🙁 That index does not exist! Did you mean to ' + mentionCommand('triggers add') + ' one?');
				} else {
					const string = array[trigger - 1];
					array.splice(trigger - 1, 1);
					(await guild.update({ triggers: toArray(array) })).reload();
					await interaction.reply('🙁 Removed trigger at index ' + trigger + ' with content `' + string + '`');
				}
				break;
			}
			case 'list': {
				const array = fromArray(triggers);

				if (array.length === 0) {
					await interaction.reply('🙁 No triggers in sight!');
				} else {
					const embed = new MessageEmbed();
					embed.setTitle('Registered triggers (' + array.length + ')');
					embed.setColor('Blurple');

					embed.setDescription(buildList(array, true));

					await interaction.reply({ embeds: [embed] });
				}
				break;
			}
		}
	},
};
