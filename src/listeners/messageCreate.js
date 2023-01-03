import { canManageGuild } from '../utils/commandUtils.js';
import { fromArray } from '../utils/arrayUtils.js';
import { toDuration } from '../utils/stringUtils.js';
import { Pogbot } from '../Pogbot.js';

/**
 * @param {import("discord.js").Message} message
 */
export default async function (message) {
	const client = Pogbot.instance;

	if (message.inGuild) {
		const guild = await client.database.getGuild(message.guildId);

		const triggers = fromArray(guild.get('triggers'));

		if (!message.author.bot) {
			if (!client.pogListeners.has(message.guildId)) {
				if (canManageGuild(message.member)) {
					if (triggers.some((trigger) => {
						return message.content.toLowerCase().includes(trigger);
					})) {
						await message.react('👀');
						client.pogListeners.set(message.guildId, {
							awakedAt: Date.now()
						});
					}
				}
			} else {
				const guild = await client.database.getGuild(message.guildId);
				const channels = fromArray(guild.get('channels'));

				if (channels.some((channel) => {
					return channel === message.channelId;
				})) {
					if (message.content.toLowerCase().includes('pog')) {
						const { awakedAt } = client.pogListeners.get(message.guildId);

						client.pogListeners.delete(message.guildId);

						client.logger.silly('Pog in guild ' + message.guild.name);

						const member = await client.database.getMember(message.guildId, message.author.id);
						(await member.increment('score')).reload();
						(await (await client.database.getGuild(message.guildId)).update({ master: message.author.id }));

						try {
							await message.react('🎉');
							await message.reply('Congrats <@' + message.author.id + '>, you got 1 point from pogging! It took you ' + toDuration(Date.now() - awakedAt) + ' to do so!');
						} catch (error) {
							if (error.name === 'DiscordAPIError') {
								// MissingPermissions
								if (error.code === 50013) {
									const dm = await (await message.guild.fetchOwner()).createDM();
									await dm.send('Hello! I can\'t send messages in <#' + message.channelId + '>. Points were silently awarded.');
									return;
								}

							}
							console.error('Could not react/send message to Pog channel, continuing: ' + error);

						}
					}
				}

			}
		}
	}
}
