import { permission } from '../../mutation-types/index';

export default {
    state: {
        permission: []
    },
    mutations: {
        // 登录之后获取权限列表
        // updatePermissiont (state, {data}) {
        //     state.permission = data
        // },
        // 权限正则
        // permissionReg (state, {data, callback}) {
        //     let permission = Array.from(state.permission)
        //     for (let item of permission) {
        //         let reg = new RegExp( `^${item}*$`, "gi")
        //         let result = reg.test(data)
        //         if (result) {
        //             // 如果能执行完说明 匹配到了

        //             callback(true)
        //             return true
        //         }
        //     }
        //     // 循环走完说明 没有匹配到
        //     callback(false)
        //     return false
        // }


        [permission.GET_NAV_DATA_PER](state, data) {
      
            state.permission = data;
          }
    },
}