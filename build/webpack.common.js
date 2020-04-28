const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const { VueLoaderPlugin } = require('vue-loader')
const Happypack = require('happypack')
const utils = require('./utils')
const execSync = require('child_process').execSync
// chalk是一个颜色的插件,在命令行提示的时候可以配置颜色
const chalk = require('chalk')


const configData = require("../config/data/index");

// 文件夹位置
function resolve(dir) {
    return path.join(__dirname, "..", dir);
}
//这个方法用 DllPlugin 避免了如果第三库的入口文件过多，不用一直在插件中new AddAssetHtmlWebpackPlugin，new webpack.DllReferencePlugin 
try {
    var files = fs.readdirSync(path.resolve(__dirname, '../dll'))
} catch (err) {
    console.log(chalk.black.bgYellow.bold('The DLL files are missing. Sit back while we build them for you with "npm run dll"'));
    execSync('npm run dll');
}
let DllPlugin = []
files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
        DllPlugin.push(new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../dll/', file),
            // 文件输出目录
            outputPath: 'static/vendor',
            // 脚本或链接标记的公共路径
            publicPath: 'static/vendor'

        }))
    }
    if (/.*\.manifest.json/.test(file)) {
        DllPlugin.push(new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../dll/', file),
        }))
    }
})
module.exports = {
    // entry:{
    //     main: './src/views/main.js',
    // },
    entry: {
        main: ["babel-polyfill", "./src/views/main.js"]
    },
    output: {
        filename: utils.assetsPath('js/[name].js'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                use: 'eslint-loader',
                enforce: 'pre',
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                js: 'happypack/loader?id=happyBabel'
                            },
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                // loader: 'happypack/loader?id=happyBabel',
                include: [
                    resolve("src"),
                    resolve("static"),
                ]
            },
            {
                test: /\.jpg|png|gif$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: utils.assetsPath('images/[name].[hash:7].[ext]'),
                        // outputPath: 'images/', // 自动打包到一个images文件夹下
                        limit: 10240 //超出1024放至images文件夹，小于用base64形式放至html里
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                    }
                }
            }
        ]
    },
    externals: {
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery"
        }),
        new Happypack({
            id: 'happyBabel',
            use: [{     // 将js的具体规则放置在此处
                loader: 'babel-loader',
            }]
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/views/', 'index.html'),
            inject: true,
            favicon: path.join(__dirname, '../static/icon/', `${process.env.npm_config_baseproject ? process.env.npm_config_baseproject : 'Baymax'}.icon`),
            title: configData[process.env.npm_config_baseproject ? process.env.npm_config_baseproject : "Baymax"]["systemTitle"]
        }),
        new CleanWebpackPlugin(),
    ].concat(DllPlugin),
    resolve: { //文件的查找
        extensions: ['.js', '.scss', '.vue', '.css'],
        alias: { //别名
            vue$: "vue/dist/vue.esm.js",
            "@node_modules": resolve("node_modules"),
            "@static": resolve("static"),
            "@": resolve("src"),
            "@styles": resolve("src/styles"),
            "@store": resolve("src/store"),
            "@assets": resolve("src/assets"),
            "@js": resolve("src/assets/js"),
            scss_vars: "@/styles/vars.scss",
            "@route": '@/route',
            "@api": "@/api/api.js",
            "@server": "@/api",
            "@mock": resolve("mock"),
            "@interface": resolve("src/interface"),
            "@components": resolve("src/components"),
            "@store": resolve("src/store"),
            "@modules": resolve("src/modules"),
            "@analysisRulesTree": resolve("src/components/analysisRulesTree"),
            "@collector": resolve("src/components/collector"),
            "@collectorSearch": resolve("src/components/collectorSearch"),
            "@dataSetInq": resolve("src/components/dataSetInq"),
            "@customPackage": resolve("src/components/customPackage"),
            "@dataSourceCol": resolve("src/components/dataSourceCol"),
            "@dataSourceInq": resolve("src/components/dataSourceInq"),
            "@dataTree": resolve("src/components/dataTree"),
            "@design": resolve("src/components/design"),
            "@echarts": resolve("src/components/echarts"),
            "@filter": resolve("src/components/filter"),
            "@flowInq": resolve("src/components/flowInq"),
            "@function": resolve("src/components/function"),
            "@globalSearch": resolve("src/components/globalSearch"),
            "@interceptorInq": resolve("src/components/interceptorInq"),
            "@jsCollector": resolve("src/components/jsCollector"),
            "@jsTask": resolve("src/components/jsTask"),
            "@monitor": resolve("src/components/monitor"),
            "@resourceTree": resolve("src/components/resourceTree"),
            "@rulesInq": resolve("src/components/rulesInq"),
            "@schemaInq": resolve("src/components/schemaInq"),
            "@schemaTree": resolve("src/components/schemaTree"),
            "@search": resolve("src/components/search"),
            "@table": resolve("src/components/table"),
            "@utils": "src/components/utils/utils.js",
            "@pages": resolve("src/pages"),
            "@views": resolve("src/views"),
            "@cheetah": resolve("src/views/cheetah"),
            "@griffin": resolve("src/views/griffin"),
            "@hippo": resolve("src/views/hippo"),
            "@rhinos": resolve("src/views/rhinos"),
            "@stream": resolve("src/views/stream"),
            "@zebra": resolve("src/views/zebra"),
            '@css': resolve('src/assets/css/'),
            '@images': resolve('src/assets/images/'),
            "@page": resolve('src/page/'),
            "@build": resolve('build'),
            "@config": resolve('config'),
            "@/lang/index": resolve('lang/index'),
        }
    },
}