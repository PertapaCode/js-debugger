'use strict'

const log4js = require('log4js')
const log4jsextend = require('log4js-extend')
const morgan = require('morgan')

let _instance

const _options = {
  disabled: false,
  globalDebug: undefined,
  globalConsole: undefined,
  level: 'info',
  line: false,
  morgan: {
    format: 'dev',
    opts: {}
  },
  notify: {
    smtp: {
      host: '',
      port: 587,
      auth: {
        user: '',
        pass: ''
      }
    },
    email: {
      from: '',
      subject: '',
      to: ''
    }
  }
}

/**
 * debug module
 */
module.exports = function (options) {
  // console.log('options', options);

  if (_instance) {
    return _instance
  }

  Object.assign(_options, options)

  /**
   * handle morgan
   */
  if (_options.morgan && _options.morgan.app) {
    let app = _options.morgan.app
    let format = _options.morgan.format

    app.use(morgan(format, _options.morgan))
  }

  /**
   * handle line
   */
  if (_options.line !== false) {
    if (typeof _options.line !== 'object') {
      _options.line = {}
    }

    _options.line.path = _options.line.path || __dirname

    log4jsextend(log4js, _options.line)
  }

  /**
   * does something
   */
  log4js.getLogger('jsdebugger').setLevel(_options.level)

  let transports = [{
    type: 'console'
  }]

  log4js.configure({
    replaceConsole: true,
    appenders: transports
  })

  log4js.levels.forName('VERBOSE', log4js.levels.DEBUG.level + 1)

  /**
   * handle global
   * @param  {string} what
   * @return {Object}
   */
  const g = _instance = function (what) {
    what = what || 'minimal'

    let logger = {}
    let l = log4js.getLogger(what)
    l.setLevel(_options.level)

    logger.info = l.info.bind(l)
    logger.debug = l.debug.bind(l)
    logger.verbose = l.verbose.bind(l)
    logger.warn = l.warn.bind(l)
    logger.error = l.error.bind(l)
    logger.fatal = l.fatal.bind(l)
    logger.trace = l.trace.bind(l)

    /**
     * define level
     * @param  {string} level
     * @return {void}
     */
    logger.level = function (level) {
      l.setLevel(level)
      return logger
    }

    return logger
  }

  /**
   * handle global
   */
  if (_options.globalDebug) {
    global[_options.globalDebug] = g
  }

  return g
}
