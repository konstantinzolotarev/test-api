// Update with your config settings.

const config = require('config')

module.exports = {

  development: {
    client: 'pg',
    connection: config.pg
  },

  staging: {
    client: 'pg',
    connection: config.pg
  },

  production: {
    client: 'pg',
    connection: config.pg
  }

}
