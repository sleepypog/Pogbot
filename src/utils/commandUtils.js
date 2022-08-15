import { PermissionsBitField } from 'discord.js';

/**
 * Handle permissions and restrictions.
 * @param {import("../commands").Command} command 
 */
export function buildData(command) {
	command.data.dmPermission = !command.guildOnly ?? true;

	const defaultPermissions = new PermissionsBitField('UseApplicationCommands');

	if (command.requireAdmin) {
		if (!command.guildOnly) {
			throw new Error('Command cannot require admin if not limited to guilds!');
		}
		defaultPermissions.add('Administrator', 'ManageGuild');
	} 

	return command;
}
