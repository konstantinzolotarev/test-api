'use strict'

const expect = require('chai').expect
const OrgService = require('../../service/OrgService')

describe('OrgService :: ', () => {

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
