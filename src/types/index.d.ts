import { ApplicationCommandData, CommandInteraction } from "discord.js";
import Bot from "../bot";

declare type Command = {
    /**
     * Is this command limited to guilds only?
     */
    guildOnly: boolean;
    
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
    execute: (client: Bot,  interaction: CommandInteraction) => Promise<void>;

    /**
     * Suggest valid values for this interaction.
     */
    autocomplete?: (client: Bot, interaction: CommandInteraction) => Promise<void>;

    /**
     * Discord-assigned command ID.
     */
    _commandId: string; 
}

declare type Listener = (client: Bot, ...args: any) => void;
