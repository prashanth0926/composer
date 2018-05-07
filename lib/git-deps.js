const { forEach, isEmpty } = require('lodash');
const cmd = require('node-cmd');
const { runApps } = require('./run-apps');

const gitDeps = (config, outputFolderLocation) => {
    forEach(config.appSources.git, (gitDtls, i) => {
        console.log(`cloning repo ${gitDtls.gitRepo} ...`);

        const command = 'cd ' + outputFolderLocation + '\n' + (gitDtls.gitRepo ? 'git clone ' + gitDtls.gitRepo + '\n' : '');

        cmd.get(command, () => {
            if (gitDtls.gitRepo) {
                console.log(`${gitDtls.gitRepo} repo has been cloned`);
            }

            if (!isEmpty(gitDtls.apps)) {
                runApps(gitDtls.apps, outputFolderLocation);
            }
        });

    });
};

module.exports = {
    gitDeps
}