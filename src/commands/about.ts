import { Command } from '../object/command/Command';
import { MessageEmbed, version } from 'discord.js';

import { duration, list } from '../utils';
import * as build from '../../build.json' assert {
    type: 'json'
};

// TODO: Strings

export default <Command> {
    name: 'about',
    description: 'See some stats for the bot.',
    restrictions: {
        enabled: true,
        isGuildOnly: false,
        isAdminOnly: false,
    },
    run: async ({  client, interaction }) => {
        const embed = new MessageEmbed()
            .setTitle(`About ${client.user?.username}`)
            .setDescription('Pogbot is an open-sourced bot meant for counting user reactions.')
            .setColor('BLURPLE')
            .addFields([
                {
                    name: 'Client Uptime',
                    value: duration(Date.now() - (client.uptime as number))
                },
                {
                    name: 'Guilds',
                    value: `${client.guilds.cache.size} guilds`
                },
                {
                    name: 'Version',
                    value: list([
                        `Pogbot ${build.version} (commit ${build.vcs.commit})`,
                        `Node.js ${process.version}`,
                        `Discord.js ${version}`
                    ], false)
                }
            ])

        await interaction.reply({
            embeds: [ embed ]
        })
    }
}
