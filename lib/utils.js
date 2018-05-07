const figlet = require('figlet');

const logError = (processName, errMsg) => {
    figlet.text(`${processName}`, function (err, data) {
        if (err) {
            console.log(processName + '\n' + errMsg);
            return;
        }
        console.log(data + errMsg);
    });
}

const logger = (processRef, processName) => {
    processRef.stdout.on(
        'data',
        function (data) {
            if (data[data.length - 1] === '\n') {
                console.log(processName + ': ' + data);
            }
            if (data.toLowerCase().indexOf('error') !== -1 || data.toLowerCase().indexOf('exit') !== -1 || data.toLowerCase().indexOf('fail') !== -1) {
                logError(processName, 'stopped working')
            }
        }
    );
}

module.exports = {
    logError,
    logger
};