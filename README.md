# composer

A tool for quickly cloning all your applications, installing dependencies and bootstrapping them instead of running them one by one from different folders.

Harness the power of composer and go get a coffee while composer starts all the applications for you.


### Installation

run **`npm i -g lazy-composer`**

### compose.json

If you are using composer, majority of your time would be spent in this file. Please refer to the examples folder to see sample compose.json files with various types of configurations.

Here are the list of options that are available within composer:

TODO: add options

### Usage

To use composer, simply go into the folder with your composer configuration and run the following command:

**`composer`**

By default composer would look for **compose.json** file if no explicit path to the configuration is passed.

If you have your composer configuration saved at a custom location, you can invoke composer as follows:

**`composer /path/to/compose.json`**