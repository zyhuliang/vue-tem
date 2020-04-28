import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from "../lang"; // Internationalization
import '@assets/fonts/iconfont.css'
import '@assets/font/iconfont.css'
import VueRouter from 'vue-router'
import congfigData from "@config/data/index.json";

import Blob from './../components/jsExcel/Blob';
import Export2Excel from './../components/jsExcel/Export2Excel';

Vue.prototype.$systemData = congfigData[process.env.BASE_PROJECT ? process.env.BASE_PROJECT : "Baymax"];

Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
});
/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
import store from '@store/index'
import routes from '@route/routes'
import 'font-awesome/css/font-awesome.min.css'
import VueResource from 'vue-resource'
import echarts from 'echarts'
import *  as globalFun from '@components/jsCollector/global.js'
import * as utils from '@components/utils/utils'
import { getRequest } from '@components/utils/index'
import '@components/utils/dialogDrag'
import * as custom from '@components/filter/filter'
import VeLine from 'v-charts/lib/line.common'
import VeHeatmap from 'v-charts/lib/heatmap.common'
import Histogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueMeta from "vue-meta";



// 公共样式
import '@css/reset.scss'
//中英转换
//通用
import * as cnFilter from '@assets/js/filter/cnFilter'
//资源目录相关
import * as resFilter from '@assets/js/filter/reourceMan'
//流程管理相关
import * as stepFilter from '@assets/js/filter/step'
//高级选项相关
import * as advFilter from '@assets/js/filter/advancedOptions'
//http request 拦截器
import "@components/utils/axios";

//Custom Style
import '@styles/rfStyle/common.scss'

import { messageDialog, fullScreen } from "@/components/utils/index"

import creareI18n from '@assets/js/i18n/index'

import globalConfig from '@components/utils/global'

Vue.prototype.messageDialog = messageDialog;
Vue.prototype.fullScreen = fullScreen;


import VueDragDrop from "vue-drag-drop"; //https://github.com/cameronhimself/vue-drag-drop

Vue.use(VueDragDrop);

// 拷贝
import VueClipboard from 'vue-clipboard2'
import { map, forEach } from "lodash";
import { encrypt, decrypt } from "@components/encryption/aes.js";
import Qs from "qs";
import Base64 from "js-base64";
const base64 = Base64.Base64;

// 接口
import http from "@interface/index.js";

import * as serverApi from '@js/util/serverApi.js'
import * as util from '@js/util/util.js'

Vue.prototype.$https = http
Vue.use(serverApi)

Vue.use(VueClipboard)
Vue.use(VueResource);
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(globalFun)
Vue.use(utils)
Vue.use(util)
Vue.use(NProgress)
Vue.component(VeLine.name, VeLine)
Vue.component(Histogram.name, Histogram)
Vue.component(VePie.name, VePie)
Vue.component(VeRing.name, VeRing)
Vue.component(VeHeatmap.name, VeHeatmap)

Vue.mixin(globalConfig)

NProgress.configure({ showSpinner: false });

Vue.prototype.$echarts = echarts
Vue.prototype.beiruanModel = false
// 注册
Vue.filter('my-filter', function (value) {
    // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')

//label 中文转义过滤
Object.keys(cnFilter).forEach(key => {
    Vue.filter(key, cnFilter[key])
})

//resourceMan中用到的label 中文转义过滤
Object.keys(resFilter).forEach(key => {
    Vue.filter(key, resFilter[key])
})

//step 中文转义过滤
Object.keys(stepFilter).forEach(key => {
    Vue.filter(key, stepFilter[key])
})

//高级选项 中文转义过滤
Object.keys(advFilter).forEach(key => {
    Vue.filter(key, advFilter[key])
})

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.path == '/login') {
        localStorage.removeItem('user');
    }
    var queryStringData = getRequest(window.location.href).queryString;
    if (queryStringData) {
        var responseData = JSON.parse(
            base64.decode(decodeURIComponent(queryStringData))
        );;
        forEach(responseData, (value, key) => {
            responseData[key] = encrypt(base64.encode(value));
        });
        Vue.prototype.serverApi({
            params: Qs.stringify(responseData),
            interface: "requestLogin",
            success: data => {
                Vue.prototype.__setItem("userInfo", { name: data.username, userId: data.userId, refreshToken: data.refreshToken, password: responseData.password }, "localStorage");
                Vue.prototype.__setItem("isAdmin", data.admin);
                Vue.prototype.__setItem("x-auth-token", data.tokenType + " " + data.accessToken);
                next()
            }
        });
    } else {
        var user = sessionStorage.length;
        if (!user && to.path != '/login' && to.path != '/license/activate') {
            next({ path: '/login' })
        } else {
            next()
        }
    }


    if ((to.path == "/realtime/editor" && from.path == "/realtime/list/index") || (from.path == "/realtime/editor" && to.path == "/realtime/list/index")) {
    } else {
        sessionStorage.removeItem("list-pagination")
    }


    // var user=sessionStorage.length;
    // if (!user && to.path != '/login' && to.path != '/license/activate'&&!responseData.loginType) {
    //     next({ path: '/login' })
    // }else {
    //     next()
    // }
})

router.afterEach(transition => {
    NProgress.done();
});

Vue.use(VueMeta, {
    // optional pluginOptions
    refreshOnceOnNavigation: true
});
new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    watch: {   //监听路由变化
        $route(to, from) {
            localStorage.removeItem("parameter");
            // to , from 分别表示从哪跳转到哪，都是一个对象
            // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
        }
    }
}).$mount('#app')

Vue.http.interceptors.push((request, next) => {
    //request.credentials = true; // 接口每次请求会跨域携带cookie
    //request.method= 'POST'; // 请求方式（get,post）
    request.headers.set('X-AUTH-TOKEN', localStorage["x-auth-token"]) // 请求headers携带参数

    next(function (response) {
        return response;

    });
})


export default router;
