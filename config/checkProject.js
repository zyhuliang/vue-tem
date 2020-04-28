const _ = require('lodash');
const projects = require('./data/index.json');
const chalk = require('chalk');
module.exports = (projectName) => {
	let keysProject = _.keys(projects);
	if (!projectName) {
		console.log(chalk.red('项目名称不可以为空'));
		return false;
	}
	if (_.indexOf(keysProject, projectName) >= 0) {
		console.log('当前正在运行项目:', projectName);
		//BASE_PROJECT
		process.env.BASE_PROJECT = projectName;
		return true;
	} else {
		console.log(chalk.red('输入的项目名不存在！！！'));
		console.log(chalk.red('项目名称取值范围如下:'));
		console.log(_.keys(projects));
		return false;
	}
};
