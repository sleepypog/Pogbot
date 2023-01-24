import { Command } from './object/command/Command';

export class CommandFinalizationError extends Error {
	public constructor(cmd: Command, message?: string) {
		super(`Could not finalize command ${cmd.name}: ${message}`);
	}
}

export class FeatureUnavailableError extends Error {
	public constructor(feature: string) {
		super(`Feature is not available: ${feature}`);
	}
}

export class AlreadyInitializedError extends Error {
	public constructor(path: string) {
		super(`${path} was already initialized before!`)
	}
}
