(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("js-debugger", [], factory);
	else if(typeof exports === 'object')
		exports["js-debugger"] = factory();
	else
		root["js-debugger"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* jscs:disable jsDoc */
	var Logger = __webpack_require__(1);

	//handle browser without console
	var console = console || {
	  log: function log() {}
	};

	//define global _log
	window._log = {
	  debug: window.console.info.bind(window.console, '%s'),
	  info: window.console.info.bind(window.console, '%s'),
	  warn: window.console.warn.bind(window.console, '%s'),
	  error: window.console.error.bind(window.console, '%s'),
	  fatal: window.console.error.bind(window.console, '%s')
	};

	//use default settings for logger
	Logger.useDefaults();

	//define global __debug
	window.__debug = function (what) {

	  what = what || 'js-debugger';

	  var logger = Logger.get(what);

	  logger.setLevel(Logger.WARN);

	  logger.warn = window.console.warn.bind(window.console, '[' + what + '] %s');
	  logger.error = window.console.error.bind(window.console, '[' + what + '] %s');
	  logger.fatal = window.console.error.bind(window.console, '[' + what + '] %s');

	  logger.defineLevel = function (level) {
	    if (level && Logger[level.toUpperCase()]) {
	      Logger.get(what).setLevel(Logger[level.toUpperCase()]);
	    }

	    return logger;
	  };

	  return logger;
	};

	//bind _log with console
	function setDebug(isDebug, what) {
	  if (isDebug) {
	    what = {
	      debug: window.console.info.bind(window.console, '%s'),
	      info: window.console.info.bind(window.console, '%s'),
	      warn: window.console.warn.bind(window.console, '%s'),
	      error: window.console.error.bind(window.console, '%s'),
	      fatal: window.console.error.bind(window.console, '%s')
	    };
	  } else {
	    var __no_op = function __no_op() {};

	    what = {
	      debug: __no_op,
	      info: __no_op,
	      warn: __no_op,
	      error: __no_op,
	      fatal: __no_op
	    };
	  }
	}

	setDebug(true, window._log);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * js-logger - http://github.com/jonnyreeves/js-logger
	 * Jonny Reeves, http://jonnyreeves.co.uk/
	 * js-logger may be freely distributed under the MIT license.
	 */
	(function (global) {
		"use strict";

		// Top level module for the global, static logger instance.
		var Logger = { };

		// For those that are at home that are keeping score.
		Logger.VERSION = "1.2.0";

		// Function which handles all incoming log messages.
		var logHandler;

		// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
		var contextualLoggersByNameMap = {};

		// Polyfill for ES5's Function.bind.
		var bind = function(scope, func) {
			return function() {
				return func.apply(scope, arguments);
			};
		};

		// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
		var merge = function () {
			var args = arguments, target = args[0], key, i;
			for (i = 1; i < args.length; i++) {
				for (key in args[i]) {
					if (!(key in target) && args[i].hasOwnProperty(key)) {
						target[key] = args[i][key];
					}
				}
			}
			return target;
		};

		// Helper to define a logging level object; helps with optimisation.
		var defineLogLevel = function(value, name) {
			return { value: value, name: name };
		};

		// Predefined logging levels.
		Logger.DEBUG = defineLogLevel(1, 'DEBUG');
		Logger.INFO = defineLogLevel(2, 'INFO');
		Logger.TIME = defineLogLevel(3, 'TIME');
		Logger.WARN = defineLogLevel(4, 'WARN');
		Logger.ERROR = defineLogLevel(8, 'ERROR');
		Logger.OFF = defineLogLevel(99, 'OFF');

		// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
		// of each other.
		var ContextualLogger = function(defaultContext) {
			this.context = defaultContext;
			this.setLevel(defaultContext.filterLevel);
			this.log = this.info;  // Convenience alias.
		};

		ContextualLogger.prototype = {
			// Changes the current logging level for the logging instance.
			setLevel: function (newLevel) {
				// Ensure the supplied Level object looks valid.
				if (newLevel && "value" in newLevel) {
					this.context.filterLevel = newLevel;
				}
			},

			// Is the logger configured to output messages at the supplied level?
			enabledFor: function (lvl) {
				var filterLevel = this.context.filterLevel;
				return lvl.value >= filterLevel.value;
			},

			debug: function () {
				this.invoke(Logger.DEBUG, arguments);
			},

			info: function () {
				this.invoke(Logger.INFO, arguments);
			},

			warn: function () {
				this.invoke(Logger.WARN, arguments);
			},

			error: function () {
				this.invoke(Logger.ERROR, arguments);
			},

			time: function (label) {
				if (typeof label === 'string' && label.length > 0) {
					this.invoke(Logger.TIME, [ label, 'start' ]);
				}
			},

			timeEnd: function (label) {
				if (typeof label === 'string' && label.length > 0) {
					this.invoke(Logger.TIME, [ label, 'end' ]);
				}
			},

			// Invokes the logger callback if it's not being filtered.
			invoke: function (level, msgArgs) {
				if (logHandler && this.enabledFor(level)) {
					logHandler(msgArgs, merge({ level: level }, this.context));
				}
			}
		};

		// Protected instance which all calls to the to level `Logger` module will be routed through.
		var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

		// Configure the global Logger instance.
		(function() {
			// Shortcut for optimisers.
			var L = Logger;

			L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
			L.debug = bind(globalLogger, globalLogger.debug);
			L.time = bind(globalLogger, globalLogger.time);
			L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
			L.info = bind(globalLogger, globalLogger.info);
			L.warn = bind(globalLogger, globalLogger.warn);
			L.error = bind(globalLogger, globalLogger.error);

			// Don't forget the convenience alias!
			L.log = L.info;
		}());

		// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
		// object with the supplied log messages and the second being a context object which contains a hash of stateful
		// parameters which the logging function can consume.
		Logger.setHandler = function (func) {
			logHandler = func;
		};

		// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
		// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
		Logger.setLevel = function(level) {
			// Set the globalLogger's level.
			globalLogger.setLevel(level);

			// Apply this level to all registered contextual loggers.
			for (var key in contextualLoggersByNameMap) {
				if (contextualLoggersByNameMap.hasOwnProperty(key)) {
					contextualLoggersByNameMap[key].setLevel(level);
				}
			}
		};

		// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
		// default context and log handler.
		Logger.get = function (name) {
			// All logger instances are cached so they can be configured ahead of use.
			return contextualLoggersByNameMap[name] ||
				(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
		};

		// Configure and example a Default implementation which writes to the `window.console` (if present).  The
		// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
		Logger.useDefaults = function(options) {
			options = options || {};

			options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
				// Prepend the logger's name to the log message for easy identification.
				if (context.name) {
					messages.unshift("[" + context.name + "]");
				}
			};

			// Check for the presence of a logger.
			if (typeof console === "undefined") {
				return;
			}

			// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
			// that don't offer a native console method.
			var timerStartTimeByLabelMap = {};

			// Support for IE8+ (and other, slightly more sane environments)
			var invokeConsoleMethod = function (hdlr, messages) {
				Function.prototype.apply.call(hdlr, console, messages);
			};

			Logger.setLevel(options.defaultLevel || Logger.DEBUG);
			Logger.setHandler(function(messages, context) {
				// Convert arguments object to Array.
				messages = Array.prototype.slice.call(messages);

				var hdlr = console.log;
				var timerLabel;

				if (context.level === Logger.TIME) {
					timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

					if (messages[1] === 'start') {
						if (console.time) {
							console.time(timerLabel);
						}
						else {
							timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
						}
					}
					else {
						if (console.timeEnd) {
							console.timeEnd(timerLabel);
						}
						else {
							invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
								(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
						}
					}
				}
				else {
					// Delegate through to custom warn/error loggers if present on the console.
					if (context.level === Logger.WARN && console.warn) {
						hdlr = console.warn;
					} else if (context.level === Logger.ERROR && console.error) {
						hdlr = console.error;
					} else if (context.level === Logger.INFO && console.info) {
						hdlr = console.info;
					}

					options.formatter(messages, context);
					invokeConsoleMethod(hdlr, messages);
				}
			});
		};

		// Export to popular environments boilerplate.
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (Logger), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}
		else if (typeof module !== 'undefined' && module.exports) {
			module.exports = Logger;
		}
		else {
			Logger._prevLogger = global.Logger;

			Logger.noConflict = function () {
				global.Logger = Logger._prevLogger;
				return Logger;
			};

			global.Logger = Logger;
		}
	}(this));


/***/ }
/******/ ])
});
;