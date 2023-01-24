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
    readonly isAdminOnly: boolean;

    /**
     * Can this command be run inside guilds only?
     */
    readonly isGuildOnly: boolean;
}
