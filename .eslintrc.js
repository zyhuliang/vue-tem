module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true,
    mocha: true,
    jquery: true
  },
  "globals": {
    "expect": true
  },
  // extends: [
  //   'plugin:vue/recommended',
  //   'standard'
  // ],
  plugins: [
    'vue'
  ],
  rules: {
    'no-tabs': 'off',
    "indent": ["off", 2],
    'generator-star-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', //不允许出现debugger语句
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', //不允许出现debugger语句
    "vue/component-name-in-template-casing": 0, // 不检测 component 标签
    'vue/no-v-html': 0,  // 可以使用 v-html 指令
    'vue/no-template-key': 0,  //可以使用 template 做为标签
    'vue/valid-v-for': 0, // :key=""
    'no-proto': 0, // 可以使__proto__
    'vue/attribute-hyphenation': 0, // v-bind: 可以使用驼峰命名法
    'no-undef': 0, // 可以使用 Object.keys()
    'vue/multiline-html-element-content-newline': 0
  }
}
