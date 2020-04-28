import { analyze } from "../../mutation-types/index";

//导航菜单数据项
export const getStepConfiug = ({ commit }, data) => {
    commit(analyze.SET_STEP_SETTING, data);
};

export const openDialog = ({ commit }, data) => {
    commit(analyze.SET_STEP_DIALOG, data);
};

export const setOutData = ({ commit }, data) => {
    commit(analyze.SET_STEP_OUT_DATA, data);
};

export const setInputData = ({ commit }, data) => {
    commit(analyze.SET_STEP_INPUT_DATA, data);
};

export const setDataSetSelect = ({ commit }, data) => {
    commit(analyze.SET_SELECT_DATASET_ITEM, data);
};

export const setParamertData = ({ commit }, data) => {
    commit(analyze.SET_PARAMERTER_DATA, data);
};

export const setCurrentFlowData = ({ commit }, data) => {
    commit(analyze.SET_CURRENT_FLOW_DATA, data);
};

export const initParametData = ({ commit }, data) => {
    commit(analyze.INIT_FORM_DATA, data);
};

export const setOutCheckedData = ({ commit }, data) => {
    commit(analyze.SET_OUT_CHECKED_DATA, data);
};

export const initOutCheckedData = ({ commit }, data) => {
    commit(analyze.INIT_OUT_CHECKED_DATA, data);
};

export const setInputCheckedData = ({ commit }, data) => {
    commit(analyze.SET_INPUT_CHECKED_DATA, data);
};

export const initInputCheckedData = ({ commit }, data) => {
    commit(analyze.INIT_INPUT_CHECKED_DATA, data);
};

export const initInputData = ({ commit }, data) => {
    commit(analyze.INIT_INPUT_DATA, data);
};

export const initOutInputData = ({ commit }, data) => {
    commit(analyze.INIT_OUTPUT_DATA, data);
};

export const modifyLoadingStatus = ({ commit }, data) => {
    commit(analyze.MODIFY_LOADING_STATUS, data);
};

export const setFormItemList = ({ commit }, data) => {
    commit(analyze.SET_FORM_ITEM_LIST, data);
};

export const setAdList = ({ commit }, data) => {
    commit(analyze.SET_AD_LIST, data);
};

export const setAdForm = ({ commit }, data) => {
    commit(analyze.SET_AD_FORM, data);
};

export const getSplitEndpoint = ({ commit }, data) => {
    commit(analyze.SET_SPLIT_ENDPOINT, data);
};


export const setCepConfigDailog = ({ commit }, data) => {
    commit(analyze.SET_CEP_CONFIG_dIALOG, data);
};


export const setStepDailogDataOption = ({ commit }, data) => {
    commit(analyze.SET_STEP_DIALOGZ_OPTION, data);
};


export const setCepFlowData = ({ commit }, data) => {
    commit(analyze.SET_CEP_FLOW_DATA, data);
};


export const currentSelectStepAction = ({ commit }, data) => {
    commit(analyze.CURRENT_SELECT_CEP_STEP, data);
};

export const setParamertDataCep = ({ commit }, data) => {
    commit(analyze.SET_PARAMERTER_DATA_CEP, data);
};


export const modifyFlowCepStepsAction = ({ commit }, data) => {
    commit(analyze.MODIFY_FLOW_CEP_STEPS_DATA, data);
};

export const setFlowCepLinksStyleAction = ({ commit }, data) => {
    commit(analyze.SET_FLOW_CEP_LINKS_STYLE, data);
};


export const IS_FLOW_CEP_LINK_ADD_ACTION = ({ commit }, data) => {
    commit(analyze.IS_FLOW_CEP_LINK_ADD, data);
};


export const FLOW_CEP_DATA_ACTION = ({ commit }, data) => {
    commit(analyze.FLOW_CEP_DATA, data);
};


export const SET_STEP_INPUT_CHECKED_DATA_ACTION = ({ commit }, data) => {
    commit(analyze.SET_STEP_INPUT_CHECKED_DATA, data);
};

