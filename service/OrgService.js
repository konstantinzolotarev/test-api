'use strict'

const knex = require('../lib/knex')
const _ = require('lodash')

const ORG_TABLE = 'organizations'
const REF_TABLE = 'refs'

module.exports = {

  /**
   * Will store set of data from input
   * @param {Object} org
   * @param {Object} [parent]
   * @return {Promise}
   */
  store (org, parent) {
    if (!org || !_.isObject(org))
      return Promise.reject(new Error('Organization is required parameter'))

    if (!org.org_name)
      return Promise.reject(new Error('Wrong organization passed'))

    return knex(ORG_TABLE)
      .insert({
        name: org.org_name,
        level: (_.has(parent, 'level') ? parent.level : 0)
      })
    if (_.isArray(org.parents) && org.parents.length > 0) {
      // TODO: store to parents
      // load parent
      // get his level
      // store current
    }

    if (_.isArray(org.daughters) && org.daughters.length > 0) {
      // TODO: store daughters
    }
  }
}
