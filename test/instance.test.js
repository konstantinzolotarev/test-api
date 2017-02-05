'use strict'

const expect = require('chai').expect
const supertest = require('supertest')

describe('Instance test :: ', () => {

  it('should exist', () => {
    expect(global.app).to.be.ok
  })

  it('should have / route', () => {
    return supertest(global.app)
      .get('/')
      .expect(200)
  })
})
