import ms from 'ms';

/**
 * Milliseconds to human-friendly format.
 * @param {number} milliseconds
 */
export function parseDuration(milliseconds) {
	return ms(milliseconds);
}

/**
 * Build an numbered list from an array.
 * @param {string[]} array 
 * @param {boolean?} numbered
 */
export function buildList(array, numbered = true) {
	if (numbered) {
		return array.map((value, index) => {
			return `[${index}] ${value}`;
		}).join('\n');
	} else {
		return array.map((value) => {
			return `${value}`;
		}).join('\n');
	}
}
