import ms from 'ms';

/**
 * Milliseconds to human-friendly format.
 * @param {number} milliseconds
 * @return {string}
 */
export function toDuration(milliseconds) {
	return ms(milliseconds);
}

/**
 * Number to human-friendly place emoji.
 * @param {number} number
 */
export function asPlaceEmoji(number) {
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
 * @param {string[]} array
 * @param {boolean?} numbered
 */
export function buildList(array, numbered = true) {
	if (numbered) {
		return array.map((value, index) => {
			return `[${index + 1}] ${value}`;
		}).join('\n');
	} else {
		return array.map((value) => {
			return `- ${value}`;
		}).join('\n');
	}
}
