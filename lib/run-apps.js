const cmd = require('node-cmd');
const { logger, logError } = require('./utils');

const runApps = (apps, outputFolderLocation) => {
    apps.forEach((appDtls) => {
        let dependencyCmd = '';

        appDtls.dependencies.forEach((dependency) => {
            dependencyCmd += dependency + '\n';
        })

        const command =
            (appDtls.path ? `cd ${outputFolderLocation}/${appDtls.path}\n` : '') +
            (appDtls.branch ? `git checkout ${appDtls.branch}\ngit pull origin ${appDtls.branch}\n` : '') + dependencyCmd;

        console.log(`installing dependencies for ${appDtls.name} app ...`);

        const processRef = cmd.get(command, (err) => {
            if (err) {
                logError(appDtls.name, err.message);
            } else {
                console.log(`installed all dependencies for ${appDtls.name} app`);
                if (appDtls.run) {
                    console.log(`firing up ${appDtls.name} app ...`);

                    const runResult =

                        cmd.get(`cd ${outputFolderLocation}/${appDtls.path}\n${appDtls.run}\n`,
                            (err) => {
                                if (err) {
                                    logError(appDtls.name, err.message);
                                }
                            });

                    logger(runResult, appDtls.name);
                }
            }
        });
    });
}

module.exports = {
    runApps
}