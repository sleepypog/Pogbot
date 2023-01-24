import { GuildMember, Permissions } from 'discord.js';

import { Command, FinalizedCommand } from '../object/command/Command'
import { CommandFinalizationError } from '../errors.js';
import { Pogbot } from '../Pogbot.js';

/**
 * Finalize a command by adding permissions and restrictions.
 * Creates an object that can be accepted by Discord
 */
export function finalize(initial: Command): FinalizedCommand {
	const cmd: FinalizedCommand = initial as FinalizedCommand;

	const { isAdminOnly, isGuildOnly } = cmd.restrictions;
	const basicInfo = {
		name: cmd.name,
		description: cmd.description
	};

	cmd._json = { ...basicInfo, ...cmd.additionalData }

	cmd._json.dmPermission = !isGuildOnly ?? true

	const permissions: bigint[] = [Permissions.FLAGS.USE_APPLICATION_COMMANDS];

	if (isAdminOnly) {
		if (!isGuildOnly) {
				throw new CommandFinalizationError(cmd, 'Cannot require admin if not limited to guilds');
		}
		permissions.push(Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_GUILD);
	}

	cmd._json.defaultMemberPermissions = permissions;

	return cmd;
}

/**
 * Create a slash mention from a command's name and Discord assigned ID.
 */
export function mention(name: string): string {
	// Splitting the command name helps support subcommands without having to add more code.
	return `</${name}:${Pogbot.instance.commands.get(name.split(' ')[0])?._id}>`;
}

/**
 * Check if a member has permission to manage the guild or has the administrator permission.
 */
export function canManage(member: GuildMember): boolean {
	return member.permissions.has(Permissions.FLAGS.MANAGE_GUILD, true);
}
