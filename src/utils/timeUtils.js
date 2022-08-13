import ms from 'ms';

/**
 * Milliseconds to human-friendly format.
 * @param {number} milliseconds
 */
export function parseDuration(milliseconds) {
	return ms(milliseconds);
}
