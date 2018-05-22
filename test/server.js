/* eslint-env node */

'use strict'

let jsdebugger = require('../src/server')
const express = require('express')
const app = express()

// you can comment this to use the default options
jsdebugger = jsdebugger({
  disabled: false,
  app: app,
  globalDebug: 'debug',
  globalConsole: undefined,
  level: 'trace',
  line: true
})

const _log = jsdebugger('module')

_log.trace('trace')
_log.debug('debug')
_log.verbose('verbose')
_log.info('info')
_log.warn('warn')
_log.error('error')
_log.fatal('fatal')
_log.mark('mark')

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

setTimeout(() => process.exit(), 5000)
