const figlet = require('figlet');

const errorCache = [];

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
            if(data.length > 2000) {
                data = data.substring(data.length - 2000);
            }
            if (data && data.length > 750 && data[data.length - 1] === '\n') {
                console.log(processName + ': ' + data);
            }
            if (data.toLowerCase().indexOf('stop') !== -1 || data.toLowerCase().indexOf('exit') !== -1 || data.toLowerCase().indexOf('fail') !== -1) {
                if(!errorCache.includes(processName)) {
                    errorCache.push(processName);
                    logError(processName, 'stopped working');
                }
            }
        }
    );
}

module.exports = {
    logError,
    logger
};