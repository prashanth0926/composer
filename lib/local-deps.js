const { forEach } = require('lodash');
const cmd = require('node-cmd');

const localDeps = (config) => {

    forEach(config.local, (localConfig) => {
        console.log('starting ' + localConfig.name + ' app ...');

        const processRef = cmd.get(localConfig.run, (err, data) => {
            if (err) {
                logError(localConfig.name, err.message);
            }
        });

        logger(processRef, localConfig.name);

        processRef.stdin.on('data', (out) => {
            console.log(out.toString());
        });
    });
};

module.exports = {
    localDeps
};