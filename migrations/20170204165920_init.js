'use strict'

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('organizations', function(table) {
      table.increments()
      table.string('name').unique()
      table.integer('level').defaultTo(0)
    })
    .then(() => {
      return knex.schema.createTable('refs', function(table) {
        table.integer('parent').references('organizations.id')
        table.integer('child').references('organizations.id')
        table.unique(['parent', 'child'])
      })
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('refs')
    .then(() => knex.schema.dropTable('organizations'))
}
