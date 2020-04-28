
// 颜色插件,在命令行提示的时候可以配置颜色
const chalk = require('chalk')
const webpack = require('webpack');

const ora = require('ora')
// 命令行 loadding
const spinner = ora('正在打包项目...')
spinner.start()
  const webpackConfig = require('./webpack.prod.js')
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
  
    if (stats.hasErrors()) {
        console.log(chalk.red('  打包出错了，请重新打包。。。'))
        process.exit(1)
    }
    console.log(chalk.cyan('打包完成！！！.\n'))
  })