import { ApplicationCommandData, CommandInteraction } from "discord.js";

declare type Command = {
    /**
     * Is this command limited to guilds only?
     */
    guildOnly: boolean;

    /**
     * Is this command limited to bot developers?
     */
    devOnly?: boolean;

    /**
     * Does this command require ADMINISTRATOR or MANAGE GUILD permissions?
     */
    requireAdmin?: boolean;

    /**
     * JSON data for registering/updating the command.
     * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure}
     */
    data: ApplicationCommandData;

    /**
     * Execute the interaction.
     */
    execute: (interaction: CommandInteraction) => Promise<void>;
}
