'use strict';

var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',

  entry: 'debugger.js',

  output: {
    path: 'dist/',
    filename: 'js-debugger.js',
    libraryTarget: 'umd',
    library: 'js-debugger',
    umdNamedDefine: true
  },

  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    //new webpack.optimize.CommonsChunkPlugin('index', 'index.js', null, 2),
    //new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: __dirname + '/node_modules',
      include: __dirname + '/src',
      query: {
        presets: ['es2015']
      }
    }]
  },

  //debug: true,
  //devtool: 'eval',

  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    alias: {
      vendor: __dirname + '/vendor'
    }
  }

};
