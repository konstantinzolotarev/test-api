'use strict'

// const knex = require('../lib/knex')
const _ = require('lodash')

module.exports = {

  /**
   * Will store set of data from input
   * @param {Object} org
   * @return {Promise}
   */
  store (org) {
    if (!org || !_.isObject(org))
      return Promise.reject(new Error('Organization is required parameter'))

    if (!org.org_name)
      return Promise.reject(new Error('Wrong organization passed'))

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
