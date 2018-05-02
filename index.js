#!/usr/bin/env node

const { logger, logError } = require('./lib/utils');
const { localDeps } = require('./lib/local-deps');
const { gitDeps } = require('./lib/git-deps');

const cmd = require('node-cmd');
const fs = require('fs');
const figlet = require('figlet');
const path = require('path');
const _ = require('lodash');
const configFile = path.resolve(process.cwd(), process.argv[2] || 'compose.json');
let outputFolderLocation;

const createDirOutput = (config) => {
  console.log(`Creating folder at ${outputFolderLocation} ...`);
  
  cmd.get(`mkdir ${outputFolderLocation}`, () => {

    console.log(`${outputFolderLocation} folder created`);

    localDeps(config);

    gitDeps(config, outputFolderLocation);
  });
};

const readConfigFile = () => {
  fs.readFile(configFile, (err, data) => {
    if (err) {
      logError('Could not load config file');
    } else {
      try {
        const config = JSON.parse(data.toString());
        outputFolderLocation = path.resolve(process.cwd(), config.outputDir);
        
        createDirOutput(config);
      } catch (err) {
        logError('JSON', 'config file could not be parsed');
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
    console.log(err);
    return;
  }

  readConfigFile();
});