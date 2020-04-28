import { monitor } from '../../mutation-types/index';

const monitorData = {
    state: {
        responseData:{
            content:[],
            facetContent:[],
            total:1000,
            totalPages:0
        },
        tabType:""
        // navData: [{
        //   path: '/',
        //   name: '权限管理',
        //   iconCls: 'icon iconfont icon-ir-attestation nav',
        // }],
    },
    mutations: {
        /*[pk.GET_NAV_DATA](state, data) {

            console.log("mutations",data);

            state.navData = data;
        }*/
        changeResData(state,data){
            console.log("changeResData",data)
            state.responseData = data
        },
        changeTabType(state,data){
            console.log("changeTabType",data)
            state.tabType = data
        }
    }
}

export default monitorData;