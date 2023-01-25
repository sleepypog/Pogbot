import { ApplicationCommand, ApplicationCommandData, CommandInteraction } from 'discord.js';
import { CommandContext } from './CommandContext';
import { Restrictions } from './Restrictions';

export interface Command {

    /**
     * The name of this command.
     */
    readonly name: string;

    /**
     * Represents the execution limits this command has.
     */
    readonly restrictions: Restrictions;

    /**
     * Additional command data object given to discord.js
     */
    additionalData?: ApplicationCommandData;

    /**
     * Function executed when this command is used.
     */
    readonly run: (ctx: CommandContext) => Promise<void>;
}

export type FinalizedCommand = Command & {

    /**
     * Final object given to Discord.js
     */
    _json: ApplicationCommandData;

    /**
     * ID provided by Discord when registering the command.
     */
    readonly _id: string;
}
