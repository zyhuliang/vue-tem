import { analyze } from '../../mutation-types/index';
import _ from 'lodash';

const analyzeMutation = {
    state: {
        parametDataCep: {},
        setStepData: {},
        stepDialogSate: false,
        outData: [],
        inputData: [],
        selectCheckedDataSet: {},
        parametData: {}, // 表单项
        currentFlowData: [],
        initParametData: {}, //dataset 选择项
        checkedOutData: [],
        initCheckedOutData: [], //初始化输出已选字段
        checkedinPUTData: [],
        initCheckedinputData: [], //初始化输入已选字段
        initInputData: [], //初始化输入备选字段
        initOutInputData: [], //初始化输出备选字段
        loadingStatus: false,
        formItemList: [],
        adList: [],
        adForm: {},
        splitEndpoint: [],
        dialogCepFormVisibleStatus: false,
        stepDialogDataOption: {},
        cepFlowData: {},
        currentSelectStep: {},
        flowCepStepsData: [],
        flowCepLinksStyle: 'NEXT',
        IS_FLOW_CEP_LINK_ADD: false,
        FLOW_CEP_DATA_STATA: {
            name: '',
            events: [],
            links: []
        },
        FLOW_CEP_DATA_STATA_STATE: {}
    },
    mutations: {
        [analyze.SET_STEP_INPUT_CHECKED_DATA](state, data) {
            state.FLOW_CEP_DATA_STATA_STATE = data;
        },
        [analyze.FLOW_CEP_DATA](state, data) {
            state.FLOW_CEP_DATA_STATA = data;
        },
        [analyze.IS_FLOW_CEP_LINK_ADD](state, data) {
            state.IS_FLOW_CEP_LINK_ADD = data;
        },
        [analyze.SET_FLOW_CEP_LINKS_STYLE](state, data) {
            state.flowCepLinksStyle = data;
        },
        [analyze.MODIFY_FLOW_CEP_STEPS_DATA](state, data) {
            state.flowCepStepsData = data;
        },
        [analyze.CURRENT_SELECT_CEP_STEP](state, data) {
            state.currentSelectStep = data;
        },
        [analyze.SET_CEP_FLOW_DATA](state, data) {
            state.cepFlowData = data;
        },
        [analyze.SET_STEP_DIALOGZ_OPTION](state, data) {
            state.stepDialogDataOption = data;
        },
        [analyze.SET_CEP_CONFIG_dIALOG](state, data) {
            state.dialogCepFormVisibleStatus = data;
        },
        [analyze.SET_SPLIT_ENDPOINT](state, data) {
            state.splitEndpoint = data;
        },
        [analyze.SET_STEP_SETTING](state, data) {
            state.setStepData = data;
        },
        [analyze.SET_STEP_DIALOG](state, data) {
            state.stepDialogSate = data;
        },
        [analyze.SET_STEP_OUT_DATA](state, data) {
            state.outData = data;
        },
        [analyze.SET_STEP_INPUT_DATA](state, data) {
            state.inputData = data;
        },
        [analyze.SET_SELECT_DATASET_ITEM](state, data) {
            state.selectCheckedDataSet = data;
        },
        [analyze.SET_PARAMERTER_DATA](state, data) {
            state.parametData = data;
        },
        [analyze.SET_CURRENT_FLOW_DATA](state, data) {
            state.currentFlowData = data;
        },
        [analyze.INIT_FORM_DATA](state, data) {
            state.initParametData = data;
        },
        [analyze.SET_OUT_CHECKED_DATA](state, data) {
            state.checkedOutData = data;
        },
        [analyze.INIT_OUT_CHECKED_DATA](state, data) {
            state.initCheckedOutData = data;
        },
        [analyze.SET_INPUT_CHECKED_DATA](state, data) {
            state.checkedinPUTData = data;
        },
        [analyze.INIT_INPUT_CHECKED_DATA](state, data) {
            state.initCheckedinputData = data;
        },
        [analyze.INIT_INPUT_DATA](state, data) {
            state.initInputData = data;
        },
        [analyze.INIT_OUTPUT_DATA](state, data) {
            state.initOutInputData = data ? data : [];
        },
        [analyze.MODIFY_LOADING_STATUS](state, data) {
            state.loadingStatus = data;
        },
        [analyze.SET_FORM_ITEM_LIST](state, data) {
            state.formItemList = data;
        },
        [analyze.SET_AD_LIST](state, data) {
            state.adList = data;
        },
        [analyze.SET_AD_FORM](state, data) {
            state.adForm = data;
        },
        [analyze.SET_PARAMERTER_DATA_CEP](state, data) {
            state.parametDataCep = data;
        }
    }
};

export default analyzeMutation;
