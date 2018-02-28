# BTime V2 Migration

## Usage

### Copy enviroment file and change local configuration

	cp .env.dist .env

### Example of how to generate a migration:

	./generate table_name

### Example of how to run a specific migration:

	./import ./migrations/migration_contributor_121901242018

### How to run all migrations:

	./import ./migrations all
