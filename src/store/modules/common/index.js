import { pk } from "../../mutation-types/index";
import _ from "lodash";
import { getLanguage } from '@/lang/index'

const history = {
  state: {
    commonStepData: {},
    language: getLanguage(),
  },
  mutations: {
    [pk.GET_RIGHT_ASIDE_DATA](state, data) {
      state.commonStepData = data;
    },
    [pk.SET_LANG_STATEE](state, data) {
      state.language = data;
    }
  }
};

export default history;
