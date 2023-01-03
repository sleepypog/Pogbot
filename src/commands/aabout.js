import { MessageActionRow, MessageEmbed, version } from 'discord.js';

import { buildList, toDuration } from '../utils/stringUtils.js';
import * as build from '../../build.json' assert {
	type: 'json'
};

/**
 * @type {import("../types/index.d.ts").Command}
 */
export default {
	guildOnly: true,
	requireAdmin: true,
	data: {
		name: 'about',
		description: 'See some stats for the bot.'
	},
	execute: async (client, interaction) => {
		const embed = new MessageEmbed({
			title: `About ${client.user.name}`,
			description: 'Pogbot is an open-sourced bot meant for counting user reactions.',
			color: 'BLURPLE',
			fields: [
				{
					name: 'Client Uptime',
					value: toDuration(Date.now() - client.uptime)
				},
				{
					name: 'Guilds',
					value: `${client.guilds.cache.size} guilds`
				},
				{
					name: 'Version',
					value: buildList([
						`Pogbot ${build.version} (commit ${build.commit})`,
						`Node.js ${process.version}`,
						`Discord.js ${version}`
					], false)
				}
			]
		});

		const buttons = new MessageActionRow({
			components: [
				{
					type: 'BUTTON',
					style: 'LINK',
					url: 'https://github.com/GNosii/SimplePogbot',
					label: 'GitHub',
					emoji: '💻'
				}
			]
		});

		await interaction.reply({
			embeds: [ embed ],
			components: [ buttons ]
		});
	}
};
