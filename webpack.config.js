'use strict'

var path = require('path')

module.exports = {
  context: path.join(__dirname, '/src'),

  entry: 'client.js',

  output: {
    path: 'dist/',
    filename: 'jsdebugger.js',
    libraryTarget: 'umd',
    library: 'jsdebugger',
    umdNamedDefine: true
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: path.join(__dirname, '/node_modules'),
      include: path.join(__dirname, '/src'),
      query: {
        presets: ['es2015']
      }
    }]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    alias: {
      node_modules: path.join(__dirname, '/node_modules')
    }
  }

}
