'use strict'

const express = require('express')
const app = express()
const config = require('config')
const _ = require('lodash')
const bodyParser = require('body-parser')
const cors = require('cors')
const OrgService = require('./service/OrgService')

/**
 * Setup middleware
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors())

/**
 * Setup routing for application
 */
app.get('/', (req, res) => {
  res.send('Ok')
})

app.post('/org', (req, res) => {
  if (!_.isObject(req.body) || !req.body.org_name)
    return res.status(400).json({ message: 'Wrong input prarameters' })

  OrgService
    .store(req.body)
    .then(() => {
      res.json({})
    })
    .catch((err) => {
      res.status(500).json({ error: err.message || 'Something goes wrong '})
    })
})

app.get('/org/:name', (req, res) => {
  if (!req.params.name)
    return res.status(500).json({ error: 'Ooppps' })

  OrgService
    .loadOrg(req.params.name)
    .then((rec) => {
      if (!rec)
        return res.status(404).send()

      return OrgService
        .load(rec)
        .then((list) => {
          return list.map((org) => _.pick(org, ['org_name', 'relationship_type']))
        })
        .then((result) => res.json(result))
    })
    .catch((err) => res.status(500).json({ error: err.message || 'Ooops' }))
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
