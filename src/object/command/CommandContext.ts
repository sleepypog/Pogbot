import { Pogbot } from '../../Pogbot';
import { Logger } from 'winston';
import { CommandInteraction } from 'discord.js';

/**
 * Represents the context of a command execution.
 * Contains shared references to the logger, database, and more.
 */
export interface CommandContext {
    client: Pogbot;

    logger: Logger;

    interaction: CommandInteraction;
}
