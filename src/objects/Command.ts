import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { Pogbot } from '../Pogbot.js';
import {Logger} from "winston";

export interface Command {

    /**
     * The name of this command.
     */
    readonly name: string;

    /**
     * Represents the execution limits this command has.
     * @todo Implement more limitations.
     */
    readonly restrictions: Restrictions;

    /**
     * The command data object given to discord.js
     */
    readonly data: ApplicationCommandData;

    /**
     * Function executed when this command is used.
     */
    readonly run: (ctx: CommandContext) => void;
}

/**
 * Represents the restrictions a command has.
 */
export interface Restrictions {

    /**
     * Can this command be registered by the bot?
     */
    readonly enabled: boolean;

    /**
     * Can this command be run by admins only?
     */
    readonly admin: boolean;

    /**
     * Can this command be run inside guilds only?
     */
    readonly guild: boolean;
}

/**
 * Represents the context of a command execution.
 * Contains shared references to the logger, database, and more.
 */
export interface CommandContext {
    client: Pogbot;

    logger: Logger;

    interaction: CommandInteraction;
}
