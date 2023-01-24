import { Pogbot } from '../Pogbot';
import { Client, Interaction, Message } from 'discord.js';

export interface DiscordHandler {
    readonly name: string;

    readonly kind: EventKind;

    readonly execute: (client: Pogbot, data?: unknown) => Promise<void>;
}

export enum EventKind {
    ONCE,

    ON
}
