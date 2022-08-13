/**
 * Convert from an stringified array.
 * @param {string} stringified
 * @returns {any[]}
 */
export function fromArray(stringified) {
	return (stringified === '' ? [] : stringified.split(','));
}

/**
 * Convert to an stringified array.
 * @param {any[]} array
 * @returns {string}
 */
export function toArray(array) {
	return array.join();
}
