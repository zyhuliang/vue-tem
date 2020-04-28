import { dataflow } from '../../mutation-types/index';

const history = {
  state: {
    dataFlow:{},
    dataflowSet:{},
    stepData:{},
    status:true,
    pamSet:[],
    dblSteps:{},
    setting:[],
    links:[],
    stepParameter:{}
  },
  mutations: {
    [dataflow.GET_DATA_FLOW](state, data) {
      state.dataFlow = data;
    },
    [dataflow.GET_DATA_FLOW_SET](state, data) {
      state.dataflowSet = data[0];
    },
    [dataflow.GET_STEP_DATA](state, data) {
      state.stepData = data
    },
    [dataflow.GET_STEP_STATUS](state, data) {
      state.status = data
    },
    [dataflow.GET_SET_FLOW](state,data) {
      state.pamSet = data
    },
    [dataflow.GET_DBL_STEP](state,data) {
      state.dblSteps = data
    },
    [dataflow.GET_STEP_SETTING](state,data){
      state.setting = data
    },
    [dataflow.GET_ACTION_LINKS](state,data){
      state.links = data
    },
    [dataflow.GET_STEP_PARAMETER](state,data){
      state.stepParameter = data
    }

  }
}

export default history;
