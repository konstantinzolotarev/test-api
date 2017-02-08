'use strict'

const expect = require('chai').expect
const supertest = require('supertest')
const knex = require('../lib/knex')

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

const clean = () => {
  return knex('refs').del()
    .then(() => knex('organizations').del())
}
describe('Instance test :: ', () => {

  before(clean)
  after(clean)

  it('should exist', () => {
    expect(global.app).to.be.ok
  })

  it('should have / route', () => {
    return supertest(global.app)
      .get('/')
      .expect(200)
  })

  it('store data', () => {
    return supertest(global.app)
      .post('/org')
      .set('Accept', 'application/json')
      .send(data)
      .expect(200)
      .then(() => knex('organizations').select())
      .then((list) => {
        expect(list).to.be.an('array')
          .and.to.have.lengthOf(8)
      })
  })

  it('should load correct order', () => {
    return supertest(global.app)
      .get('/org/' + 'Black Banana')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array')
          .and.to.have.length.above(5)
      })
  })
})
