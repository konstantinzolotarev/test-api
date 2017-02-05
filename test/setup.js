'use strict'

const server = require('../app')

before((done) => {
  global.app = server.app
  server.start(done)
})

after(() => {
  server.stop()
})
