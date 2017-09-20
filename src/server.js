'use strict'

const log4js = require('log4js')
const log4jsextend = require('log4js-extend')
const morgan = require('morgan')

let _instance

const _options = {
  disabled: false,
  globalDebug: undefined,
  globalConsole: undefined,
  levelMethod: 'level',
  level: 'info',
  line: false,
  morgan: {
    format: 'dev',
    opts: {}
  },
  appenders: {
    console: {
      type: 'console'
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

  log4js.getLogger('jsdebugger').level = _options.level

  // define default categories based on appenders
  let categories = {
    default: {
      appenders: [],
      level: 'ALL'
    }
  }
  for (let appender in _options.appenders) {
    if (_options.appenders[appender].type !== 'smtp') {
      categories.default.appenders.push(appender)
    }
  }

  // initialize log4js
  log4js.configure({
    levels: {
      VERBOSE: {
        value: 15000,
        colour: 'cyan'
      }
    },
    appenders: _options.appenders,
    categories: categories
  })

  /**
   * handle global
   * @param  {string} what
   * @return {Object}
   */
  const g = _instance = function (what) {
    what = what || 'minimal'

    let logger = {}
    let l = log4js.getLogger(what)
    l.level = _options.level

    logger.trace = l.trace.bind(l)
    logger.debug = l.debug.bind(l)
    logger.verbose = l.verbose.bind(l)
    logger.info = l.info.bind(l)
    logger.warn = l.warn.bind(l)
    logger.error = l.error.bind(l)
    logger.fatal = l.fatal.bind(l)
    logger.mark = l.mark.bind(l)

    /**
     * define level
     * @param  {string} level
     * @return {void}
     */
    logger[_options.levelMethod] = function (level) {
      l.level = level
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
