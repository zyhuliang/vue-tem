// /**
//  * ------------------------------------------------------------------
//  * api.js
//  * ------------------------------------------------------------------
//  */
import axios from 'axios';
import { Loading } from 'element-ui'
import { Message } from 'element-ui'
import router from "@views/main.js";
import qs from 'qs';
let UnLoadingApiPaths = ["/api/auth/revoke"]
let globalLoading
// 显示loading的遮罩层
let startLoading = () => { // 使用Element loading-start 方法
  globalLoading = Loading.service({
        lock: true,
        text: '玩命加载中……',
        background: 'rgba(255,255,255,0.9)'
    })
}

// 关闭loading的遮罩层
let endLoading = () => { // 使用Element loading-close 方法,关闭loading
  setTimeout(() => {
    globalLoading.close()
  }, 2000)
}

// 请求时遮罩层基数加一
let needLoadingRequestCount = 0
let needLoadingRequestPath = []
export function showFullScreenLoading (config) {
  // 去除不添加loading的api
  if(UnLoadingApiPaths.indexOf(config.url) == -1){
    if (needLoadingRequestCount === 0) {
      startLoading()
    }
    needLoadingRequestCount++
    needLoadingRequestPath.push(config.url)
  }

}

// 响应时遮罩层基数减一
export function tryHideFullScreenLoading (response) {
  if (needLoadingRequestCount <= 0){
    return
  }

  let index = needLoadingRequestPath.indexOf(response.config.url)
  if(index != -1){
    needLoadingRequestPath.splice(index,1)
    needLoadingRequestCount--
  }
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

//监听headerToken
axios.interceptors.request.use((config) => {
    //存入headerToken
    const token = sessionStorage["x-auth-token"];
    if (config.method === 'post' || config.method === 'get' || config.method === 'put') {
        if (config.headers['Content-Type'] !== 'application/json') {

        }
    }
    if (token !== undefined) {
        config.headers['X-AUTH-TOKEN'] = token
    }
    if (config.method === 'get') {
        config.paramsSerializer = function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        };
      }
    // 添加loading
    // showFullScreenLoading(config)
    return config
}, err => {
    return Promise.reject(err)
})

//监听Token超时
axios.interceptors.response.use((response) => {
  tryHideFullScreenLoading(response)
  return response;
}, err => {
    
    // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
        var responseMessage = err.response.data.message
        switch (err.response.status) {
           
            case 400:
                err.response.message = responseMessage || '请求错误'
                Message({
                    message: "请求错误",
                    type: 'warning'
                });
                break

            case 401:
                err.response.message = responseMessage || '未授权，请登录'
                if( err.response.data.path=="/api/auth/login"){//
                    Message({
                        message: responseMessage,
                        type: 'warning'
                    });

                }else{
                    router.push('/login');
                    location.reload();
                    Message({
                        message: "未授权，请登录",
                        type: 'warning'
                    });
                }
                
                router.push("/login");
                break

            case 403:
                err.response.message = responseMessage || '拒绝访问'
                if( err.response.data.path=="/api/auth/login"){//
                    Message({
                        message: responseMessage,
                        type: 'warning'
                    });

                }else{
                    router.push('/login');
                    location.reload();
                    Message({
                        message: "拒绝访问",
                        type: 'warning'
                    });
                }
                router.push("/login");
                break

            case 404:
                err.response.message = responseMessage || `请求地址出错: ${err.response.config.url}`
                Message({
                    message: "请求地址出错: ${err.response.config.url}",
                    type: 'warning'
                });
                break

            case 405:
                err.response.message = responseMessage || '拒绝访问'
                Message({
                    message: "拒绝访问",
                    type: 'warning'
                });
                break

            case 408:
                err.response.message = responseMessage || '请求超时'
                Message({
                    message: "请求超时",
                    type: 'warning'
                });
                break

            case 500:
                err.response.message = responseMessage || '服务器内部错误'
                console.log(' case 500:',err);
                console.log(err)
                if (err.response.data['exception'] === 'io.jsonwebtoken.ExpiredJwtException') {
                    var msg = 'Token过期 超时,请重新登陆';
                    if (confirm(msg) === true) {
                        // router.push('/login');
                        // location.reload();
                    } else {

                    }
                } else {

                    Message({
                        message: err.response.data.err,
                        type: 'warning'
                    });
                

                }
                break

            case 501:
                err.response.message = responseMessage || '服务未实现'
                Message({
                    message: "服务未实现",
                    type: 'warning'
                });
                break

            case 502:
                err.response.message = responseMessage || '网络错误'
                Message({
                    message: "网络错误",
                    type: 'warning'
                });
                break

            case 503:
                err.response.message = responseMessage || '服务不可用'
                Message({
                    message: "服务不可用",
                    type: 'warning'
                });
                break

            case 504:
                err.response.message = responseMessage || '网络超时'
                Message({
                    message: "网络超时",
                    type: 'warning'
                });
                break

            case 505:
                err.response.message = responseMessage || 'HTTP版本不受支持'
                Message({
                    message: "HTTP版本不受支持",
                    type: 'warning'
                });
                break
            default:
                err.response.message = responseMessage

               
        }
    }

    return Promise.reject(err);
})

