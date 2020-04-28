const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.common')
const utils = require('./utils')
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path')

const checkProject = require('../config/checkProject');

if (process.env.npm_config_baseproject != undefined && !checkProject(process.env.npm_config_baseproject)) {
	return;
}

module.exports = merge(baseConfig, {
    mode:'production',
    devtool: 'cheap-module-source-map',
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[hash:5].css'),
            chunkFilename: utils.assetsPath('css/[name].[hash:5].css')
        }),
        new webpack.DefinePlugin({
            "process.env": require("../config/prod.env")
        }),
             // copy custom static assets
        new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, "../static/jsLibrary/visualizer"),
            to: "static/jsLibrary/visualizer",
            ignore: [".*"]
        }
        ])
    ],
    module: {
        rules:[
            {
                test: /\.scss$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            //一个sass文件只进行一次从下至上的编译，这个属性importLoaders 可以让它走两遍，让sass文件中被引入的进行编译
                            // modules: true,
                            //开启css模块式的打包,一个css 文件的样式不会影响别的css 文件样式
                        }
                    },
                    'sass-loader',
                    // 'postcss-loader'
                ] //从右至左，从下至上
            },
            {
                test: /\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            //一个sass文件只进行一次从下至上的编译，这个属性importLoaders 可以让它走两遍，让sass文件中被引入的进行编译
                            // modules: true,
                            //开启css模块式的打包,一个css 文件的样式不会影响别的css 文件样式
                        }
                    }
                ]
            }
        ]
    }
})
