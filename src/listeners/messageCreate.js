import { canManageGuild } from '../utils/permissionUtils.js';
import { fromArray } from '../utils/arrayUtils.js';
import { parseDuration } from '../utils/stringUtils.js';

/**
 * @param {import("../bot.js").default} client
 * @param {import("discord.js").Message} message
 */
export default async function (client, message) {
	if (message.inGuild) {
		const guild = await client.database.getGuild(message.guildId);

		const triggers = fromArray(guild.get('triggers'));

		if (!message.author.bot) {
			if (!client.pogListeners.has(message.guildId)) {
				if (canManageGuild(message.member)) {
					if (triggers.some((trigger) => {return message.content.toLowerCase().includes(trigger);})) {
						await message.react('👀');
						client.pogListeners.set(message.guildId, {
							awakedAt: Date.now()
						});
					}
				}
			} else {
				const guild = await client.database.getGuild(message.guildId);
				const channels = fromArray(guild.get('channels'));

				if (channels.some((channel) => {return channel === message.channelId;})) {
					if (message.content.toLowerCase().includes('pog')) {
						client.logger.debug('Pog in guild ' + message.guild.name);

						const member = await client.database.getMember(message.guildId, message.author.id);
						(await member.increment('score')).reload();

						await message.react('🎉');
						await message.reply('Congrats <@' + message.author.id + '>, you got 1 point from pogging! It took you ' + parseDuration(Date.now() - client.pogListeners.get(message.guildId).awakedAt) + ' to do so!');
					}
				}

			}
		}
	}
}
