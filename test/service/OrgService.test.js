'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line
const OrgService = require('../../service/OrgService')
const knex = require('../../lib/knex')

/*eslint no-underscore-dangle: ['error', { 'allow': ['_insertOrg', '_insertRef', '_loadOrg'] }]*/

describe('OrgService :: ', () => {

  describe('_insertOrg() :: ', () => {

    after(() => {
      return knex('organizations').del()
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
        ._insertOrg({org_name: chance.hash()})
        .then((rec) => {
          expect(rec).to.be.an('object')
          expect(rec.id).to.be.ok
        })
    })

  })

  describe('_insertRef() :: ', () => {

    let orgs

    before(() => {
      return knex('organizations').insert([
        {
          name: chance.hash()
        }, {
          name: chance.hash()
        }
      ]).returning(['id', 'name', 'level']).then((recs) => {
        expect(recs).to.be.an('array').and.to.have.lengthOf(2)

        orgs = recs
      })
    })

    after(() => {
      return knex('refs').del().then(() => knex('organizations').del())
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

  describe('_loadOrg() :: ', () => {

    let org

    before(() => {
      return OrgService
        ._insertOrg({org_name: chance.hash()})
        .then((rec) => {
          expect(rec).to.be.an('object')
          expect(rec.id).to.be.ok

          org = rec
        })
    })

    after(() => {
      return knex('organizations').del()
    })

    it('should exist', () => {
      expect(OrgService._loadOrg).to.be.a('function')
    })

    it('reject without name', () => {
      return OrgService
        ._loadOrg()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong name passed')
        })
    })

    it('reject on empty', () => {
      return OrgService
        ._loadOrg('')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong name passed')
        })
    })

    it('load record', () => {
      return OrgService
        ._loadOrg(org.name)
        .then((rec) => {
          expect(rec).to.be.an('object')
          expect(rec.id).to.be.ok
        })
    })

    it('load empty for non existing', () => {
      return OrgService
        ._loadOrg(chance.hash())
        .then((rec) => {
          expect(rec).to.be.null
        })
    })
  })

  describe('store() :: ', () => {

    afterEach(() => {
      return knex('refs').del()
        .then(() => knex('organizations').del())
    })

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

    it('should store a new org', () => {
      return OrgService
        .store({org_name: chance.hash()})
        .then((recs) => {
          expect(recs).to.be.an('array')
            .and.to.have.length.above(0)
        })
    })

    it('should store with child', () => {
      const data = {
        org_name: chance.hash(),
        daughters: [
          {
            org_name: chance.hash()
          }, {
            org_name: chance.hash()
          }
        ]
      }
      return OrgService
        .store(data)
        .then((recs) => {
          expect(recs).to.be.an('array')

          return knex('organizations').select()
        })
        .then((list) => {
          expect(list).to.be.an('array').and.to.have.lengthOf(3)
        })
    })

    it('store list', () => {
      const data = {
        org_name: chance.hash(),
        daughters: [
          {
            org_name: chance.hash(),
            daughters: [
              {
                org_name: chance.hash()
              }, {
                org_name: chance.hash()
              }
            ]
          }
        ]
      }
      return OrgService
        .store(data)
        .then((recs) => {
          expect(recs).to.be.an('array')

          return knex('organizations').select()
        })
        .then((list) => {
          expect(list).to.be.an('array')
            .and.to.have.lengthOf(4)

          return knex('refs').select()
        })
        .then((refs) => {
          expect(refs).to.be.an('array')
            .and.to.have.lengthOf(3)
        })
    })

    it('store construction', () => {
      const data = {
        org_name: 'Paradise Island',
        daughters: [
          {
            org_name: 'Banana tree',
            daughters: [
              {
                org_name: 'Yellow Banana'
              }, {
                org_name: 'Brown Banana'
              }, {
                org_name: 'Black Banana'
              }
            ]
          }, {
            org_name: 'Big banana tree',
            daughters: [
              {
                org_name: 'Yellow Banana'
              }, {
                org_name: 'Brown Banana'
              }, {
                org_name: 'Green Banana'
              }, {
                org_name: 'Black Banana',
                daughters: [
                  {
                    org_name: 'Phoneutria Spider'
                  }
                ]
              }
            ]
          }
        ]
      }

      return OrgService
        .store(data)
        .then((recs) => {
          expect(recs).to.be.an('array')

          return knex('organizations').select()
        })
        .then((list) => {
          expect(list).to.be.an('array').and.to.have.length.above(4)

          return knex('refs').select()
        })
        .then((refs) => {
          expect(refs).to.be.an('array').and.to.have.length.above(3)
        })
    })
  })
})
