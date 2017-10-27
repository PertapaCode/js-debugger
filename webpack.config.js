'use strict'

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const IS_PROD = process.argv.indexOf('prod') !== -1

const commonConfig = {
  context: process.cwd() + '/src/',

  entry: './client.js',

  output: {
    path: process.cwd() + '/dist/',
    filename: 'js-debugger.js',
    libraryTarget: 'umd',
    library: 'js-debugger',
    umdNamedDefine: true
  },

  devtool: (IS_PROD ? undefined : 'eval'),

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
          plugins: ['transform-object-assign']
        }
      }]
    }]
  },

  resolve: {
    modules: ['node_modules', 'src/config'],
    alias: {
      node_modules: process.cwd() + '/node_modules'
    }
  }
}

let tasks = [
  Object.assign({}, commonConfig, {
    name: 'unminified'
  })
]

if (IS_PROD) {
  tasks = tasks.concat([
    Object.assign({}, commonConfig, {
      name: 'minified',

      output: {
        path: process.cwd() + '/dist/',
        filename: 'js-debugger.min.js',
        libraryTarget: 'umd',
        library: 'js-debugger',
        umdNamedDefine: true
      },

      plugins: [new UglifyJSPlugin()]
    })
  ])
}

module.exports = tasks
