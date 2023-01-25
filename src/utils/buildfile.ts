import * as build from '../../build.json' assert {
        type: 'json'
        };

export const
    BUILD_VERSION = build.version,
    BUILD_TIME = build.timestamp,
    BUILD_COMMIT = build.vcs.commit,
    BUILD_BRANCH = build.vcs.branch

