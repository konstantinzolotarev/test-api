'use strict'

const knex = require('../lib/knex')
const _ = require('lodash')

const ORG_TABLE = 'organizations'
const REF_TABLE = 'refs'

module.exports = {

  /**
   * Insert organization
   * @private
   * @param {Object} org
   * @param {String} org.org_name
   * @param {Number} [org.level]
   * @return {Promise}
   */
  _insertOrg (org) {
    if (!_.isObject(org) || !org.org_name)
      return Promise.reject(new Error('Wrong org parameter passed'))

    return knex(ORG_TABLE)
      .insert({
        name: org.org_name,
        level: org.level || 0
      })
      .returning(['id', 'name', 'level'])
  },

  /**
   * Insert reference between parent and child
   * @private
   * @param {Number} parentId
   * @param {Number} childId
   * @return {Promise}
   */
  _insertRef (parentId, childId) {
    if (!_.isFinite(parentId) || !_.isFinite(childId))
      return Promise.reject(new Error('Input parameters are invalid'))

    if (parentId == childId)
      return Promise.reject(new Error('Parameters could not be equal'))

    return knex(REF_TABLE)
      .insert({
        parent: parentId,
        child: childId
      })
      .returning(['parent', 'child'])
  },

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
      .then((record) => {
        if (!_.isObject(parent) || !parent.id)
          return record

        return this
          ._insertRef(parent.id, record.id)
          .then(() => record)
      })
      .then((record) => {
        if (!_.isArray(org.daughters) || !org.daughters.length)
          return record

        return Promise.map(org.daughters, (child) => {
          return this.store(child, record)
        })
      })
  },

}
