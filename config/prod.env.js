"use strict";
module.exports = {
  NODE_ENV: '"production"',
  BASE_PROJECT:
    JSON.stringify(process.env.npm_config_baseproject) || '"Baymax"'
};
