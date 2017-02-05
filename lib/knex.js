'use strict'

const knex = require('knex')
const config = require('config')

module.exports = knex({
  client: 'pg',
  connection: config.pg
})
