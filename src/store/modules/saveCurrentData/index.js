export default {
    state: {
        saveCurrentData: 'default'
    },
    mutations: {
        // 登录之后获取权限列表
        updateParameter (state, {data}) {
            state.saveCurrentData = data
        },
    },
}