import ms from 'ms';

/**
 * Milliseconds to human-friendly format.
 */
export function duration(milliseconds: number): string {
	return ms(milliseconds);
}

/**
 * Number to human-friendly place emoji.
 */
export function placeEmoji(number: number): string {
	switch (number) {
		case 1:
			return ':first_place:';
			case 2:
				return ':second_place:';
				case 3:
					return ':third_place:';
					default:
						return '';
	}
}

/**
 * Build a numbered list from an array.
 */
export function list(array: unknown[], numbered?: boolean): string {
	if (numbered !== undefined && numbered) {
		return array.map((value, index) => {
			return `[${index + 1}] ${value}`;
		}).join('\n');
	} else {
		return array.map((value) => {
			return `- ${value}`;
		}).join('\n');
	}
}

/**
 * Convert from an stringified array.
 */
export function destringifyArray(stringified: string): unknown[] {
	return (stringified === '' ? [] : stringified.split(','));
}

/**
 * Convert to an stringified array.
 */
export function stringifyArray(array: unknown[]): string {
	return array.join(',');
}
