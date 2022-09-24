import { Permissions } from 'discord.js';

/**
 * Handle permissions and restrictions.
 * @param {import("../types").Command} command 
 */
export function buildData(command) {
	command.data.dmPermission = !command.guildOnly ?? true;

	const defaultPermissions = [ Permissions.FLAGS.USE_APPLICATION_COMMANDS ];

	if (command.requireAdmin) {
		if (!command.guildOnly) {
			throw new Error('Command cannot require admin if not limited to guilds!');
		}
		defaultPermissions.push(Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_GUILD);
	} 

	return command;
}

/**
 * Create an slash mention from an command's name and Discord assigned ID.
 * @param {import('../bot').default} bot
 * @param {string} name
 */
export function mentionCommand(bot, name) {
	// Splitting the command name helps support subcommands without having to add more code.
	return '</' + name + ':' + bot.commands.get(name.split(' ')[0])._commandId + '>';
}

/**
 * Check if an member has permission to manage the guild or has the administrator permission.
 * @param {import("discord.js").GuildMember} member 
 * @returns {boolean}
 */
export function canManageGuild(member) {
	return member.permissions.has(Permissions.FLAGS.MANAGE_GUILD, true);
}
