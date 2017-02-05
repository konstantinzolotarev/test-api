'use strict'

const express = require('express')
const app = express()
const config = require('config')
const _ = require('lodash')
const bodyParser = require('body-parser')
const cors = require('cors')

/**
 * Setup middleware
 */
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(cors())

/**
 * Setup routing for application
 */
app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('/org', (req, res) => {
  res.json({})
})

app.get('/org/:name', (req, res) => {
  res.json({})
})


module.exports = {

  /**
   * express instance
   * @type {Express}
   */
  _server: null,

  /**
   * Application
   * @type {[type]}
   */
  app: app,

  /**
   * Server getter
   * @return {Express}
   */
  get server () {
    return this._server
  },

  /**
   * Start express server
   * @param {Function} [cb]
   */
  start (cb) {
    cb = cb || _.noop
    this._server = app.listen(config.app.port, function (err) {
      console.log(`Example app listening on port ${config.app.port}!`) // eslint-disable-line
      cb(err)
    })
  },

  /**
   * Stop express server if it's exist
   */
  stop () {
    if (!this._server)
      return
    return this._server.close()
  }
}
