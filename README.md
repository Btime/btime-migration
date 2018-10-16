# BTime V2 Migration

## :books: Table of Contents

1. [Setup](#setup)
1. [Usage](#usage)
1. [Testing](#testing)
1. [Linting](#linting)

## **Setup**
### Copy enviroment file and configure the variables
	$ cp .env.dist .env

### Install dependencies
	$ npm i

## **Usage**
### **Generating a migration**

	$ ./bin/generate -t sql

> **Example output:** _Generated new migration file: /home/user/projects/btime-migration/migrations/Version**20181002114415382**.js_

All run migrations get **versioned**, based on it's name - which reflects a unique timestamp. That's the version used when [**rolling back the migration**](#rolling-back-migrations).

By default, migration files are created at **`./migrations`** (project root). You can specify a custom directory by utilizing the **`--workdir`** flag:

	$ ./bin/generate -t sql --workdir ./custom-mirations-dir
> The *generate*, *migrate* and *rollback* commands support a custom directory to be specified.

:information_source: **Important**	The directory must exist in order to be used.

### **Running migrations**

	$ ./bin/migrate

The above command **will run (_up_)** all migration files, considering default options (flags).

### Hitting multiple databases
The migration process might target multiple databases through the *`"--multiple"`* flag.

	$ ./bin/migrate --multiple

:information_source: **Important** Environment variables prefixed with _"MULTIPLE\__" are used in order to find target databases.

### **Rolling back migrations**

	$ ./bin/rollback --version [version]

The above command **will run (down)** the specified migration, considering default options (flags).

Just like the _migrate_ command, you can make use of the **`--multiple`** flag and target multiple databases:

	$ ./bin/rollback --version [version] --multiple

_All commands come with a **`--help`** flag, which displays useful information about it's usage options._

## Testing

Tests are run using [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com).

Run test suite

	$ npm run test

Run coverage report

	$ npm run coverage

Run coverage report in HTML

	$ npm run htmlCoverage

## Linting
To scan the code base and "auto-fix" all that violates the defined lint rules, run:

	$ npm run fixStyle
