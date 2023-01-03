import {Command} from '../objects/Command.js';
import {MessageEmbed} from "discord.js";

export default <Command> {
    name: 'about',
    restrictions: {
        enabled: true,
        guild: false,
        admin: false,
    },
    data: {
        name: 'about',
        description: 'See some stats for the bot.'
    },
    run: (ctx) => {
        const embed = new MessageEmbed()
            .setTitle()
            .setDescription()
        return;
    }
}
