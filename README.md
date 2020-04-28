# Europa

基于 vue-cli 脚手架的数据管理集合项目

# To start

npn install 安装依赖

npn run dev (默认 Baymax)

npm run dev --baseproject="Dam"

其他项目更改参数即可

npn run build (默认 Baymax)

npm run build --baseproject="Dam"

其他项目更改参数即可

解决 sass 版本报错：
cnpm install node-sass@latest

# Folder structure

- build - webpack config files
- config - webpack config files
- dist - build
- src -your app
  - api
  - assets
  - components - your vue components
  - styles
  - views - your pages
  - vuex
  - App.vue
  - main.js - main file
  - routes.js
- static - static assets

# Theme

You can change theme by

1. Generate theme packages by [https://elementui.github.io/theme-preview/#/](https://elementui.github.io/theme-preview/#/)
2. Put theme packages in src/assets/theme/
3. Edit src/main.js

```bash
   import 'element-ui/lib/theme-default/index.css'
   to
   import './assets/theme/your-theme/index.css'
```

4. Edit src/styles/vars.scss

# Browser support

Modern browsers and IE 10+.

# License

[MIT](http://opensource.org/licenses/MIT)

## branch

0.9.2 金科
