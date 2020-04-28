const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        vue: ['vue', 'axios', 'vuex', 'vue-router', 'vuex-persistedstate', 'vue-resource', 'vue-json-pretty', 'vue-i18n', 'vue-drag-drop', 'vue-clipboard2', 'vue-avatar'],
        lodash: ['lodash'],
        vue2AcEeditor: ['vue2-ace-editor', 'brace'],
        echarts: ['echarts'],
        jsplumb: ['jsplumb'],
        // elementUI: ['element-ui'],
        util: ['cronstrue', 'js-base64',  'nprogress', 'panzoom'],
        moment: ['moment', 'format-json'],
        // formatter: ['sql-formatter', 'jsonexport']
    },
    output: {
        filename: '[name].dll.js',
        path:path.resolve(__dirname, '../dll'),
        library: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: '/node_modules/' //排除node_modules，用babel-loader进行编译
            },


        ]
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path:path.resolve(__dirname, '../dll/[name].manifest.json'),
        })
    ]
}