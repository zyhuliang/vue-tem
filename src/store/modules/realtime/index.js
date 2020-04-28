import { realtime } from '../../mutation-types/index';
import _ from 'lodash';

const realtimeMutation = {
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
		FLOW_CEP_DATA_STATA_STATE: {},
		CEP_GROUP_STEPS: {},
		CEP_FLOW_GROUP_DATA: []
	},
	mutations: {
		[realtime.SET_FLOW_DATA_GROUP](state, data) {
			//state.CEP_FLOW_GROUP_DATA = data;
			if (_.isArray(data)) {
				state.CEP_FLOW_GROUP_DATA = data;
			} else {
				state.CEP_FLOW_GROUP_DATA = [ ...state.CEP_FLOW_GROUP_DATA, data ];
			}
		},
		[realtime.SET_STEP_LIST_GROUP](state, data) {
			state.CEP_GROUP_STEPS = data;
		},
		[realtime.SET_STEP_INPUT_CHECKED_DATA](state, data) {
			state.FLOW_CEP_DATA_STATA_STATE = data;
		},
		[realtime.FLOW_CEP_DATA](state, data) {
			state.FLOW_CEP_DATA_STATA = data;
		},
		[realtime.IS_FLOW_CEP_LINK_ADD](state, data) {
			state.IS_FLOW_CEP_LINK_ADD = data;
		},
		[realtime.SET_FLOW_CEP_LINKS_STYLE](state, data) {
			state.flowCepLinksStyle = data;
		},
		[realtime.MODIFY_FLOW_CEP_STEPS_DATA](state, data) {
			state.flowCepStepsData = data;
		},
		[realtime.CURRENT_SELECT_CEP_STEP](state, data) {
			state.currentSelectStep = data;
		},
		[realtime.SET_CEP_FLOW_DATA](state, data) {
			state.cepFlowData = data;
		},
		[realtime.SET_STEP_DIALOGZ_OPTION](state, data) {
			state.stepDialogDataOption = data;
		},
		[realtime.SET_CEP_CONFIG_dIALOG](state, data) {
			state.dialogCepFormVisibleStatus = data;
		},
		[realtime.SET_SPLIT_ENDPOINT](state, data) {
			state.splitEndpoint = data;
		},
		[realtime.SET_STEP_SETTING](state, data) {
			state.setStepData = data;
		},
		[realtime.SET_STEP_DIALOG](state, data) {
			state.stepDialogSate = data;
		},
		[realtime.SET_STEP_OUT_DATA](state, data) {
			state.outData = data;
		},
		[realtime.SET_STEP_INPUT_DATA](state, data) {
			state.inputData = data;
		},
		[realtime.SET_SELECT_DATASET_ITEM](state, data) {
			state.selectCheckedDataSet = data;
		},
		[realtime.SET_PARAMERTER_DATA](state, data) {
			state.parametData = data;
		},
		[realtime.SET_CURRENT_FLOW_DATA](state, data) {
			state.currentFlowData = data;
		},
		[realtime.INIT_FORM_DATA](state, data) {
			state.initParametData = data;
		},
		[realtime.SET_OUT_CHECKED_DATA](state, data) {
			state.checkedOutData = data;
		},
		[realtime.INIT_OUT_CHECKED_DATA](state, data) {
			state.initCheckedOutData = data;
		},
		[realtime.SET_INPUT_CHECKED_DATA](state, data) {
			state.checkedinPUTData = data;
		},
		[realtime.INIT_INPUT_CHECKED_DATA](state, data) {
			state.initCheckedinputData = data;
		},
		[realtime.INIT_INPUT_DATA](state, data) {
			state.initInputData = data;
		},
		[realtime.INIT_OUTPUT_DATA](state, data) {
			state.initOutInputData = data ? data : [];
		},
		[realtime.MODIFY_LOADING_STATUS](state, data) {
			state.loadingStatus = data;
		},
		[realtime.SET_FORM_ITEM_LIST](state, data) {
			state.formItemList = data;
		},
		[realtime.SET_AD_LIST](state, data) {
			state.adList = data;
		},
		[realtime.SET_AD_FORM](state, data) {
			state.adForm = data;
		},
		[realtime.SET_PARAMERTER_DATA_CEP](state, data) {
			state.parametDataCep = data;
		}
	}
};

export default realtimeMutation;
