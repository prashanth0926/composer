const cmd = require('node-cmd');

const localDeps = (localApps) => {

    localApps.forEach((localConfig) => {
        console.log('starting ' + localConfig.name + ' app ...');

        const processRef = cmd.get(localConfig.run, (err, data) => {
            if (err) {
                logError(localConfig.name, err.message);
            }
        });

        logger(processRef, localConfig.name);
    });
};

module.exports = {
    localDeps
};