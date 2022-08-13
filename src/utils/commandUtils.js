import { PermissionsBitField } from 'discord.js';

/**
 * Handle permissions and restrictions.
 * @param {import("../commands").Command} command 
 */
export function buildData(command) {
	command.data.dmPermission = command.guildOnly ?? true;

	const defaultPermissions = new PermissionsBitField('UseApplicationCommands');

	if (command.requireAdmin) {
		defaultPermissions.add('Administrator', 'ManageGuild');
	} 

	return command;
}
