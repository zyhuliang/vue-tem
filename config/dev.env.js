'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	BASE_PROJECT: JSON.stringify(process.env.npm_config_baseproject) || '"Baymax"'
});
