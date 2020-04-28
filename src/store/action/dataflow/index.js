import { dataflow} from "../../mutation-types/index";

//获取dataflow流程
export const getDataFlow = ({ commit }, data) => {
  commit(dataflow.GET_DATA_FLOW, data);
};
//获取参数设置
export const getDataflowset = ({ commit }, data) => {
  commit(dataflow.GET_DATA_FLOW_SET, data);
};
//获取单节点信息
export const getStepData = ( {commit }, data) => {
  commit (dataflow.GET_STEP_DATA, data)
}
//获取节点弹出层的状态
export const getStepsStatus = ( {commit }, data) => {
  commit (dataflow.GET_STEP_STATUS, data)
}
//获取流程设置的值
export const setFlowPam =({commit}, data) => {
  commit (dataflow.GET_SET_FLOW, data)
}
//双击节点获取的节点信息
export const getdblSteps =({commit}, data) => {
  commit (dataflow.GET_DBL_STEP, data)
}
//设置自定义规则
export const setSetting = ({commit},data) => {
  commit (dataflow.GET_STEP_SETTING,data)
}
//获取流程的连线
export const getactionLinks = ({commit}, data) =>{
  commit (dataflow.GET_ACTION_LINKS,data)
}
//获取自定义节点参数规则
export const getStepsparameter = ({commit},data) => {
  commit (dataflow.GET_STEP_PARAMETER,data)
}