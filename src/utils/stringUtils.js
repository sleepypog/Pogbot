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
 */
export function buildList(array) {
	return array.map((value, index) => {
		return `[${index}] ${value}`;
	}).join('\n');
}
