import VueI18n from 'vue-i18n'
import Vue from 'vue'
Vue.use(VueI18n)
export default () => {
  return new VueI18n({
    // 定义默认语言
    locale: 'zh',
    messages: {
      zh: require('./zh'),
      en: require('./en')
    }
  })
}
