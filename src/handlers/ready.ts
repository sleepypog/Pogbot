import { EventKind, DiscordHandler } from '../object/DiscordHandler';

export default <DiscordHandler> {
    name: 'ready',
    kind: EventKind.ONCE,
    execute: (client) => {
        client.logger.info('Logged in as %s (%s).')
    }
}
