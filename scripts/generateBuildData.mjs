import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';

/**
 * Structure of an builddata.json file.
 * @typedef {Object} BuildDataObject
 * @property {string} prop1
 * @property {string} [prop2]
 */
const object = {
	version: process.env.npm_package_version,
	commit: getCommit(),
};

function getCommit() {
	return execSync('git rev-parse --short HEAD').toString().trim();
}

writeFile('./builddata.json', JSON.stringify(object), { encoding: 'utf-8' }).then(() => {
	console.log('Wrote builddata file successfully!');
}).catch((error) => {
	console.error('Could not write builddata file: ' + error);
});
