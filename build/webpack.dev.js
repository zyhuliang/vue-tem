'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path')

const commonConfig = require('./webpack.common');
const checkProject = require('../config/checkProject');
// const configData=require("../config/data/index");

if (process.env.npm_config_baseproject != undefined && !checkProject(process.env.npm_config_baseproject)) {
  return;
}

// console.log('path.resolve(__dirname, "../static/jsLibrary")',path.resolve(__dirname, "../static/jsLibrary"));

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    compress: true,
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    // contentBase: "./dist/",
    contentBase: false, // since we use CopyWebpackPlugin.
    port: 9000,
    open: true,
    inline: true,
    overlay: { warnings: true, errors: true },
    hot: true,
    hotOnly: true,
    historyApiFallback: true,
    proxy: [{
      // 请求到 '/mobileTest' 下 的请求都会被代理到 target： http://debug.xxx.com 中
      context: ['/api'],
      //  target: 'http://192.168.2.200:8515',
      // target:'http://192.168.2.248:8515/',
      // target: 'http://192.168.1.84:8515',
      // target: 'http://192.168.2.145:8515',
      // target: 'http://192.168.1.75:8515',
      // target: 'http://192.168.2.248:8515',
      // target: 'http://192.168.2.145:8515',
      target: 'http://192.168.2.200:8515',
      secure: false, // 接受 运行在 https 上的服务
      changeOrigin: true
    }],
    publicPath: "/",
    // headers: { 'Content-Security-Policy': 'default-src http: https:' }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static/jsLibrary/visualizer"),
        to: "static/jsLibrary/visualizer",
        ignore: [".*"]
      }
    ])
  ]
});
