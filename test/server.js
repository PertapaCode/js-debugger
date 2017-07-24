/* eslint-env node */

'use strict'

const jsdebugger = require('../src/server')
const express = require('express')
const app = express()

const _config = {
  disabled: false,
  globalDebug: 'debug',
  globalConsole: undefined,
  level: 'trace',
  line: false
}

jsdebugger(_config)

const _log = debug('module')

_log.info('info')
_log.debug('debug')
_log.verbose('verbose')
_log.warn('warn')
_log.error('error')
_log.fatal('fatal')
_log.trace('trace')

app.get('/', function (req, res) {
  res.send('hello, world!')
})

app.post('/', function (req, res) {
  res.send('hello, world!')
})

app.put('/', function (req, res) {
  res.send('hello, world!')
})

app.delete('/', function (req, res) {
  res.send('hello, world!')
})

app.listen(5000)
