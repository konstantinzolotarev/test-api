# Test API application

## Installation
Application requires Node.js 4+ because uses some ES6 features

## Dependencies

You have to install dependencies using:
```bash
$ npm install
```

## Configuration

All application configs are int `config/` folder.

Base file for configuration is `config/default.js` it has default configs and could be overwrited by
`config/{ENV}.js` or `config/local.js`

Note that `config/local.js` have to be ignored in git and will be used only for development !

## Migrations
After configuration you will have to run migrations.

**Don't forget to create database that you configured**

Application uses `knex` for DB manipulations and it's migrations.
Run migrations:
```bash
$ NODE_ENV=development ./node_modules/knex/bin/cli.js migrate:latest
```

Rolling migrations back:
```bash
$ NODE_ENV=development ./node_modules/knex/bin/cli.js migrate:rollback
```

## Running application
To run application use this command:
```bash
$ npm start
```

Or
```bash
$ NODE_ENV=development node index.js
```

## Tests

Tests include checking of code style and testing base functionality for application

To run tests use this commands:

Will run code style check and run tests if everything os ok:
```bash
$ npm test
```

Will run only tests without code style:
```bash
$ npm run mocha
```
