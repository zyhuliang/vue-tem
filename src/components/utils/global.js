function forEach(obj, fn) {
    // Don't bother if no value provided  直接返回
    if (obj === null || typeof obj === 'undefined') {
      return;
    }
    // Iterate over object keys
    for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      fn.call(null, obj[key], key, obj);
    }
  }
  }


function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
}

let userConfig = window.userConfig

let config = {
    systemTitle: 'Baymax - 睿帆科技大数据管理系统',
    systemName: 'Baymax',
    systemVersion: 0.9
}

if (userConfig) {
    config = deepMerge(config, userConfig)
}
export default {
    data() {
      return {
          globalConfig: config
      }
    }
}