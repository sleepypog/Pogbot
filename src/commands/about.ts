import { Command } from '../object/command/Command';
import { MessageEmbed, version } from 'discord.js';

import { BUILD_BRANCH, BUILD_COMMIT, BUILD_TIME, BUILD_VERSION, duration, list } from '../utils';
import { Translation } from '../object/Translation';

// TODO: Strings

export default <Command> {
    name: 'about',
    restrictions: {
        enabled: true,
        isGuildOnly: false,
        isAdminOnly: false,
    },
    run: async ({  client, interaction }) => {
        const embed = new MessageEmbed()
            .setTitle(Translation.of('reply.about.title'))
            .setDescription(Translation.of('reply.about.body'))
            .setColor('BLURPLE')
            .addFields([
                {
                    name: Translation.of('reply.about.uptime'),
                    value: duration(Date.now() - (client.uptime as number))
                },
                {
                    name: Translation.of('reply.about.guilds'),
                    value: Translation.of('reply.about.guildcount', {
                        count: client.guilds.cache.size
                    })
                },
                {
                    name: Translation.of('reply.about.version'),
                    value: list([
                        `Pogbot ${BUILD_VERSION}`,
                        `Node.js ${process.version}`,
                        `Discord.js ${version}`
                    ], false)
                },
                {
                    name: Translation.of('reply.about.build'),
                    value: list([
                        Translation.of('reply.about.commit', {
                            commit: BUILD_COMMIT
                        }),
                        Translation.of('reply.about.branch', {
                            branch: BUILD_BRANCH
                        }),
                        Translation.of('reply.about.time', {
                            time: BUILD_TIME
                        }),
                    ])
                }
            ])

        await interaction.reply({
            embeds: [ embed ]
        })
    }
}
