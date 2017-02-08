'use strict'

const knex = require('../lib/knex')
const _ = require('lodash')
const Promise = require('bluebird')

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
      .then((recs) => recs[0])
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
   * Will load organization from DB
   * @param {String} name
   * @return {Promise}
   */
  loadOrg (name) {
    if (!_.isString(name) || !name.length)
      return Promise.reject(new Error('Wrong name passed'))

    return knex(ORG_TABLE)
      .select()
      .where('name', name)
      .then((list) => {
        if (!_.isArray(list) || !list.length)
          return null

        // No need to check length because name is unique
        return list[0]
      })
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

    const newLevel = (_.isObject(parent) && _.isNumber(parent.level)) ? parent.level + 1 : 0
    return this
      .loadOrg(org.org_name)
      .then((record) => {
        if (_.isObject(record))
          return record

        return this
          ._insertOrg({
            org_name: org.org_name,
            level: newLevel
          })
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
        }, { concurrency: 1 })
      })
      .then((result) => {
        if (!_.isArray(result))
          return [ result ]

        return result
      })
  },

  /**
   * Load org by it's name with all parents/childs
   * @param {Object} org
   * @param {Number} org.id
   * @param {Number} org.level
   * @param {String} org.name
   * @param {Object} [pagination]
   * @param {Number} [pagination.limit] limit of records pulled for 1 call
   * @param {Number} [pagination.skip]
   * @return {Promise}
   */
  load (org, pagination) {
    if (!_.isObject(org) || !org.id || !org.name || !org.level)
      return Promise.reject(new Error('Org is required parameter'))

    pagination = pagination || {}

    const sql = `
    select distinct org.id, org.name as org_name,
      case
        when org.level > :level then 'daughter'
        when org.level < :level then 'parent'
        else 'sister'
      end as relationship_type
    from :org_table: as org
    inner join :ref_table: as ref on org.id = ref.parent or org.id = ref.child
    where org.id != :id and
      (ref.parent in (
        select refs.parent from :ref_table: as refs where refs.child = :id or refs.parent = :id
      ) or ref.child = :id)
    order by org.name asc
    offset :skip
    limit :limit
    `
    return knex
      .raw(sql, {
        org_table: ORG_TABLE,
        ref_table: REF_TABLE,
        id: org.id,
        level: org.level,
        limit: pagination.limit || 100,
        skip: pagination.skip || 0
      })
      .then((resp) => resp.rows || [])
  }

}
