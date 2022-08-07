import { GuildMember, PermissionFlagsBits } from "discord.js";

/**
 * Check if an member has permission to manage the guild or has the administrator permission.
 * @param {GuildMember} member 
 * @returns {boolean}
 */
export function canManageGuild(member) {
	return member.permissions.has(PermissionFlagsBits.ManageGuild, true);
}
