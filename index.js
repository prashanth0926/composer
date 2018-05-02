#!/usr/bin/env node

const cmd = require('node-cmd');
const fs = require('fs');
const figlet = require('figlet');

const configFile = process.argv[2] || 'config.json';
let folderName = 'AppsBot';

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

const runApps = (apps, i) => {
  for (let j in apps) {
    const cmdT = require('node-cmd');
    const appDtls = apps[j];
    let dependencyCmd = '';
    if (appDtls.dependencies && appDtls.dependencies.length) {
      for (let i in appDtls.dependencies) {
        dependencyCmd += appDtls.dependencies[i];
      }
    }
    const command = (appDtls.path ? `cd ${folderName}/${appDtls.path}\n` : '') +
      (appDtls.branch ? `git checkout ${appDtls.branch}\ngit pull origin ${appDtls.branch}\n` : '') + dependencyCmd;
    console.log(`installing dependencies for ${appDtls.name} app ...`);
    const processRef = cmdT.get(command, (err) => {
      if (err) {
        logError(appDtls.name, err.message);
      } else {
        console.log(`installed all dependencies for ${appDtls.name} app`);
        if (appDtls.run) {
          console.log(`firing up ${appDtls.name} app ...`);
          const processRef = cmdT.get(`
            cd ${folderName}/${appDtls.path} 
            ${appDtls.run}
          `, (err) => {
            if (err) {
              logError(appDtls.name, err.message);
            }
          });
          logger(processRef, appDtls.name);
        }
      }
    });
  }
}

const runGit = (gitConfig) => {
  for (let i in gitConfig) {
    const gitDtls = gitConfig[i];
    console.log(`cloning repo ${gitDtls.gitRepo} ...`);
    const command = 'cd ' + folderName + '\n' + (gitDtls.gitRepo ? 'git clone ' + gitDtls.gitRepo + '\n' : '');
    cmd.get(command, () => {
      if (gitDtls.gitRepo) {
        console.log(`${gitDtls.gitRepo} repo has been cloned`);
      }
      if (gitDtls.apps && gitDtls.apps.length) {
        runApps(gitDtls.apps, i);
      }
    });
  }
}

const localDeps = (config) => {
  if (config.local && config.local.length) {
    for (let i in config.local) {
      const cmdT = require('node-cmd');
      console.log('starting ' + config.local[i].name + ' app ...');
      const processRef = cmdT.get(config.local[i].run, (err, data) => {
        if (err) {
          logError(config.local[i].name, err.message);
        }
      });
      logger(processRef, config.local[i].name);
      processRef.stdin.on('data', (out) => {
        console.log(out.toString());
      });
    }
  }
  if (config.git && config.git.length) {
    runGit(config.git);
  }
}

const createDir = (config) => {
  console.log(`creating folder ${folderName} ...`);
  cmd.get(`
    mkdir ${folderName}
  `, () => {
    console.log(`${folderName} folder created`);
    localDeps(config);
  });
};

const readConfigFile = () => {
  fs.readFile(`./${configFile}`, (err, data) => {
    if (err) {
      logError('config.json', ' not found');
    } else {
      try {
        const config = JSON.parse(data.toString());
        folderName = config.folderName || folderName;
        createDir(config);
      } catch (err) {
        logError('JSON', ' format incorrect');
      }
    }
  });
}

figlet.text(`<<< COMPOSE >>>`, {
  font: 'Dancing Font',
  horizontalLayout: 'default',
  verticalLayout: 'default'
}, function (err, data) {
  if (err) {
    console.log('<<< COMPOSE >>>');
    readConfigFile();
    return;
  }
  console.log(data);
  readConfigFile();
});