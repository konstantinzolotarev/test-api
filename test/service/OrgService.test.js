'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line
const OrgService = require('../../service/OrgService')
const knex = require('../../lib/knex')

/*eslint no-underscore-dangle: ["error", { "allow": ["_insertOrg", "_insertRef"] }]*/

describe('OrgService :: ', () => {

  describe('_insertOrg() :: ', () => {

    after(() => {
      return knex('organizations')
        .del()
    })

    it('should exist', () => {
      expect(OrgService._insertOrg).to.be.a('function')
    })

    it('reject without org', () => {
      return OrgService
        ._insertOrg()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong org parameter passed')
        })
    })

    it('reject with wrong org', () => {
      return OrgService
        ._insertOrg({})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong org parameter passed')
        })
    })

    it('insert new org', () => {
      return OrgService
        ._insertOrg({
          org_name: chance.hash()
        })
        .then((rec) => {
          expect(rec).to.be.an('object')
          expect(rec.id).to.be.ok
        })
    })

  })

  describe('_insertRef() :: ', () => {

    let orgs

    before(() => {
      return knex('organizations')
        .insert([
          {
            name: chance.hash()
          },
          {
            name: chance.hash()
          }
        ])
        .returning(['id', 'name', 'level'])
        .then((recs) => {
          expect(recs).to.be.an('array')
            .and.to.have.lengthOf(2)
        })
    })

    after(() => {
      return knex('refs')
        .del()
        .then(() => knex('organizations').del())
    })

    it('should exist', () => {
      expect(OrgService._insertRef).to.be.a('function')
    })

    it('reject without params', () => {
      return OrgService
        ._insertRef()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Input parameters are invalid')
        })
    })

    it('reject without child', () => {
      return OrgService
        ._insertRef(1)
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Input parameters are invalid')
        })
    })

    it('reject on equal', () => {
      return OrgService
        ._insertRef(1, 1)
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Parameters could not be equal')
        })
    })

    it('reject on non existing', () => {
      return OrgService
        ._insertRef(99, 100)
        .then(() => Promise.reject())
        .catch((err) => {
          console.log('==========================')
          console.log(err)
          console.log('==========================')
          expect(err).to.be.ok
        })
    })

    it('add new record', () => {
      return OrgService
        ._insertRef(orgs[0].id, orgs[1].id)
        .then((rec) => {
          expect(rec).to.be.ok
        })
    })
  })

  describe('store() :: ', () => {

    it('should exist', () => {
      expect(OrgService.store).to.be.a('function')
    })

    it('reject without set', () => {
      return OrgService
        .store()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Organization is required parameter')
        })
    })

    it('reject with wrong org', () => {
      return OrgService
        .store({})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong organization passed')
        })
    })
  })
})
