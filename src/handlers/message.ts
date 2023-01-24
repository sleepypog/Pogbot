import { EventKind, DiscordHandler } from '../object/DiscordHandler';
import { GuildMember, Message } from 'discord.js';
import { canManage, destringifyArray } from '../utils';
import { PogListener } from '../object/PogListener';

export default <DiscordHandler> {
    name: 'messageCreate',
    kind: EventKind.ON,
    execute: async (client, data: Message) => {
        if (data.inGuild()) {
            const guild = await client.database.getGuild(data.guildId);

            const triggers: string[] = destringifyArray(guild.get('triggers')) as string[];

            if (!data.author.bot) {
                if (!client.pogListeners.has(data.guildId)) {
                    if (canManage(data.member as GuildMember)) {
                        if (triggers.some((trigger) => {
                            return data.content.toLowerCase().includes(trigger);
                        })) {
                            await data.react('👀');
                            client.pogListeners.set(data.guildId, {
                                creationTimestamp: Date.now()
                            });
                        }
                    }
                } else {
                    const guild = await client.database.getGuild(data.guildId);
                    const channels = destringifyArray(guild.get('channels'));

                    if (channels.some((channel) => {
                        return channel === data.channelId;
                    })) {
                        if (data.content.toLowerCase().includes('pog')) {
                            const { creationTimestamp } = client.pogListeners.get(data.guildId) as PogListener;
                            client.pogListeners.delete(data.guildId);

                            const member = await client.database.getMember(data.guildId, data.author.id);
                            await (await member.increment('score')).reload();
                            (await guild.update({ master: data.author.id }));

                            try {
                                await data.react('🎉');
                                await data.reply('Congrats <@' + message.author.id + '>, you got 1 point from pogging! It took you ' + toDuration(Date.now() - awakedAt) + ' to do so!');
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
}
