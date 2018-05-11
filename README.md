# Lazy Composer

A tool for quickly cloning all your applications, installing dependencies and bootstrapping them instead of running them one by one from different folders.

Harness the power of composer and go get a coffee while composer starts all the applications for you.


### Installation

run **`npm i -g lazy-composer`**

### compose.json

If you are using composer, majority of your time would be spent in this file. Please refer to the examples folder to see sample compose.json files with various types of configurations.

Here are the list of options that are available within composer:

| Name                   | Value            | Description                                                                                                                                                                  |
|:-----------------------|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **outputDir**          | String (**Required**) | Target directory where all the composed apps must be cloned and run from. |
| **name**               | String (**Required**) | Name of the application. |
| **gitRepo**            | String                | Git repository link from where the application must be cloned (ssh or https). |
| **dependencies**       | Array of strings      | Commands to install dependencies for that application, if not provided compose would skip installing dependencies. |
| **run**                | String                | Commands to run the application, if not provided compose would skip running the application. |
| **branch**             | String (Default: *master*) | Git branch which should be checked out before running dependencies and starting the application, if not provided compose would defauld it to master. |
| **path**               | String (**Required if `dependencies` or `run` is present**) | The directory path where application dependencies can be installed and started. |

Here is a sample compose.json:

```
{
  "outputDir": "../../composer-example-apps",
  "appSources": {
    "git": [
      {
        "gitRepo": "https://github.com/cagataygurturk/spring-boot-boilerplate.git",
        "apps": [
          {
            "name": "spring-app",
            "branch": "master",
            "path": "spring-boot-boilerplate/"
          }
        ]
      },
      {
        "gitRepo": "https://github.com/ngx-rocket/starter-kit.git",
        "apps": [
          {
            "name": "ng-rocket-app",
            "path": "starter-kit/",
            "dependencies": [
              "npm install"
            ],
            "run": "npm start"
          }
        ]
      }
    ]
  }
}
```

Here are the list of things composer can perform:

*run multiple applications cloned from the same or different git repositories*

*install dependencies of applications without starting them by removing `run` field*

*start applications without running dependencies (after dependencies are installed) by removing `dependencies` field*

### Usage

To use composer, simply go into the folder with your composer configuration and run the following command:

**`compose`**

By default composer would look for **compose.json** file if no explicit path to the configuration is passed.

If you have your composer configuration saved at a custom location, you can invoke composer as follows:

**`compose /path/to/compose.json`**
