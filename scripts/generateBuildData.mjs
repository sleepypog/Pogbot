import {execSync} from 'child_process';
import {writeFile} from 'fs/promises';

/**
 * Structure of a build.json file.
 */
const object = {
	version: process.env.npm_package_version,
	timestamp: new Date().toJSON(),
	vcs: {
		commit: getCommit(),
		branch: getBranch()
	}
};

function getCommit() {
	return execSync('git rev-parse --short HEAD').toString().trim();
}

function getBranch() {
	return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

writeFile('./build.json', JSON.stringify(object, null, 2), { encoding: 'utf-8' }).then(() => {
	console.log('Wrote builddata file successfully!');
}).catch((error) => {
	console.error('Could not write builddata file: ' + error);
});
