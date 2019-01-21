# BTime V2 Migration

## :books: Table of Contents

1. [Installation](#installation)
1. [Usage](#usage)
1. [Testing](#testing)
1. [Linting](#linting)

## **Installation**
### NPM Repository
	$ npm i -S @btime/migration

### GitHub Repository
	$ npm i -S github:Btime/btime-migration

### Copy the enviroment file to your project root and configure it
	$ cp ./{PACKAGE_ROOT}/.env.dist {PROJECT_ROOT}/.env

:bulb: **TIP** Both **_migrate_** and **_rollback_** allows for the specification of a **custom env file**,
through the **`--env`** flag.

## **Usage**
To facilitate the use of this CLI tool, you might install it globally or map
its commands to the _package.json scripts_, as follows:

```json
"scripts": {
    "generate": "./node_modules/.bin/generate",
    "migrate": "./node_modules/.bin/migrate",
    "rollback": "./node_modules/.bin/rollback"
}
```
:information_source: **IMPORTANT** Don't forget that the mapping above requires
you to invoke such scripts as **npm run \<script>**. [More on NPM scripts](https://docs.npmjs.com/cli/run-script).

### **Generating a migration**

	$ generate -t sql

> **Example output:** _Generated new migration file: /home/user/projects/btime-migration/migrations/Version**20181002114415382**.js_

All run migrations get **versioned**, based on it's name - which reflects a unique timestamp. That's the version used when [**rolling back the migration**](#rolling-back-migrations).

By default, migration files are created at **`./migrations`** (project root). You can specify a custom directory by utilizing the **`--workdir`** flag:

	$ generate -t sql --workdir ./custom-mirations-dir
> The *generate*, *migrate* and *rollback* commands support a custom directory to be specified.

:information_source: **IMPORTANT**	The directory must exist in order to be used.

### **Running migrations**

	$ migrate

The above command **will run (_up_)** all migration files, considering default options (flags).

### Hitting multiple databases
The migration process might target multiple databases through the *`"--multiple"`* flag.

	$ migrate --multiple

:information_source: **IMPORTANT** Environment variables prefixed with _"MULTIPLE\__" are used in order to find target databases.

### **Rolling back migrations**

	$ rollback --version [version]

The above command **will run (down)** the specified migration, considering default options (flags).

Just like the _migrate_ command, you can make use of the **`--multiple`** flag and target multiple databases:

	$ rollback --version [version] --multiple

_All commands come with a **`--help`** flag, which displays useful information about it's usage options._

## Testing

Tests are run using [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com). Coverage is provided by [Istanbul CLI](https://github.com/istanbuljs/nyc).

Run test suite (coverage included)

	$ npm test

## Linting
To scan the code base and "auto-fix" all that violates the defined lint rules, run:

	$ npm run fixStyle
