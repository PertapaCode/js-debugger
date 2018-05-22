'use strict'

import Logger from 'js-logger'

let _instance

const _options = {
  disabled: false,
  globalDebug: undefined,
  globalConsole: undefined,
  level: 'warn'
}

export default function (options) {
  // console.log('options', options);

  // if options is a string use default options and use string for logger name
  let name
  if (typeof options === 'string') {
    name = options
    options = {}
  }

  if (_instance) {
    return _instance
  }

  Object.assign(_options, options)

  // define global console
  if (_options.disabled !== true && _options.globalConsole) {
    window[_options.globalConsole] = {
      debug: window.console.info.bind(window.console, '%s'),
      verbose: window.console.info.bind(window.console, '%s'),
      info: window.console.info.bind(window.console, '%s'),
      warn: window.console.warn.bind(window.console, '%s'),
      error: window.console.error.bind(window.console, '%s'),
      fatal: window.console.error.bind(window.console, '%s')
    }
  } else if (_options.disabled === true && _options.globalConsole) {
    window[_options.globalConsole] = {
      debug: function () {},
      verbose: function () {},
      info: function () {},
      warn: function () {},
      error: function () {},
      fatal: function () {}
    }
  }

  // use default settings for logger
  Logger.useDefaults()

  /**
   * _debug
   * @param  {string} what
   * @return {Object}
   */
  let _debug = function (what) {
    what = what || 'jsdebugger'

    var logger = Logger.get(what)

    logger.setLevel(Logger[_options.level.toUpperCase()])

    logger.verbose = logger.debug.bind(logger)
    logger.warn = window.console.warn.bind(window.console, '[' + what + '] %s')
    logger.error = window.console.error.bind(window.console, '[' + what + '] %s')
    logger.fatal = window.console.error.bind(window.console, '[' + what + '] %s')

    logger.defineLevel = function (level) {
      if (level && Logger[level.toUpperCase()]) {
        Logger.get(what).setLevel(Logger[level.toUpperCase()])
      }

      return logger
    }

    return logger
  }

  if (_options.disabled === true) {
    _debug = function () {
      let _nop = {
        debug: function () {},
        verbose: function () {},
        info: function () {},
        warn: function () {},
        error: function () {},
        fatal: function () {}
      }

      _nop.defineLevel = function () { return _nop }

      return _nop
    }
  }

  // define global debug
  if (_options.globalDebug) {
    window[_options.globalDebug] = _debug
  }

  // handle browsers without console
  if (!console || !console.log) {
    const console = console || {
      log: function () {}
    }
  }

  _instance = _debug

  // if logger name exist use it to init the logger
  if (name) {
    return _debug(name)
  } else {
    return _debug
  }
}
