import { realtime } from "../../mutation-types/index";

//导航菜单数据项
export const getStepConfiug = ({ commit }, data) => {
  commit(realtime.SET_STEP_SETTING, data);
};

export const openDialog = ({ commit }, data) => {
  commit(realtime.SET_STEP_DIALOG, data);
};

export const setOutData = ({ commit }, data) => {
  commit(realtime.SET_STEP_OUT_DATA, data);
};

export const setInputData = ({ commit }, data) => {
  commit(realtime.SET_STEP_INPUT_DATA, data);
};

export const setDataSetSelect = ({ commit }, data) => {
  commit(realtime.SET_SELECT_DATASET_ITEM, data);
};

export const setParamertData = ({ commit }, data) => {
  commit(realtime.SET_PARAMERTER_DATA, data);
};

export const setCurrentFlowData = ({ commit }, data) => {
  commit(realtime.SET_CURRENT_FLOW_DATA, data);
};

export const initParametData = ({ commit }, data) => {
  commit(realtime.INIT_FORM_DATA, data);
};

export const setOutCheckedData = ({ commit }, data) => {
  commit(realtime.SET_OUT_CHECKED_DATA, data);
};

export const initOutCheckedData = ({ commit }, data) => {
  commit(realtime.INIT_OUT_CHECKED_DATA, data);
};

export const setInputCheckedData = ({ commit }, data) => {
  commit(realtime.SET_INPUT_CHECKED_DATA, data);
};

export const initInputCheckedData = ({ commit }, data) => {
  commit(realtime.INIT_INPUT_CHECKED_DATA, data);
};

export const initInputData = ({ commit }, data) => {
  commit(realtime.INIT_INPUT_DATA, data);
};

export const initOutInputData = ({ commit }, data) => {
  commit(realtime.INIT_OUTPUT_DATA, data);
};

export const modifyLoadingStatus = ({ commit }, data) => {
  commit(realtime.MODIFY_LOADING_STATUS, data);
};

export const setFormItemList = ({ commit }, data) => {
  commit(realtime.SET_FORM_ITEM_LIST, data);
};

export const setAdList = ({ commit }, data) => {
  commit(realtime.SET_AD_LIST, data);
};

export const setAdForm = ({ commit }, data) => {
  commit(realtime.SET_AD_FORM, data);
};

export const getSplitEndpoint = ({ commit }, data) => {
  commit(realtime.SET_SPLIT_ENDPOINT, data);
};


export const setCepConfigDailog = ({ commit }, data) => {
  commit(realtime.SET_CEP_CONFIG_dIALOG, data);
};


export const setStepDailogDataOption = ({ commit }, data) => {
  commit(realtime.SET_STEP_DIALOGZ_OPTION, data);
};


export const setCepFlowData = ({ commit }, data) => {
  commit(realtime.SET_CEP_FLOW_DATA, data);
};


export const currentSelectStepAction = ({ commit }, data) => {
  commit(realtime.CURRENT_SELECT_CEP_STEP, data);
};

export const setParamertDataCep = ({ commit }, data) => {
  commit(realtime.SET_PARAMERTER_DATA_CEP, data);
};


export const modifyFlowCepStepsAction = ({ commit }, data) => {
  commit(realtime.MODIFY_FLOW_CEP_STEPS_DATA, data);
};

export const setFlowCepLinksStyleAction = ({ commit }, data) => {
  commit(realtime.SET_FLOW_CEP_LINKS_STYLE, data);
};


export const IS_FLOW_CEP_LINK_ADD_ACTION = ({ commit }, data) => {
  commit(realtime.IS_FLOW_CEP_LINK_ADD, data);
};


export const FLOW_CEP_DATA_ACTION = ({ commit }, data) => {
  commit(realtime.FLOW_CEP_DATA, data);
};


export const SET_STEP_INPUT_CHECKED_DATA_ACTION = ({ commit }, data) => {
  commit(realtime.SET_STEP_INPUT_CHECKED_DATA, data);
};


export const SET_STEP_LIST_GROUP_ACTION = ({ commit }, data) => {
  commit(realtime.SET_STEP_LIST_GROUP, data);
};


export const SET_FLOW_DATA_GROUP_ACTION = ({ commit }, data) => {
  commit(realtime.SET_FLOW_DATA_GROUP, data);
};

