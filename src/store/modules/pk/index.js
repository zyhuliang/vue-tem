import { pk } from "../../mutation-types/index";
import _ from "lodash";

const history = {
  state: {
    navData: [],
    multipleSelection: [],
    allLinks: [],
    insertLinks: [],
    subFlowLinks: [],
    linkID: "",
    subFlowSteps: [],
    stepData: []
  },
  mutations: {
    [pk.GET_NAV_DATA](state, data) {
      state.navData = data;
    },
    [pk.GET_RIGHT_ASIDE_DATA](state, data) {
      state.stepData = data;
    },
    [pk.GET_NAV_DATA_TEST](state, data) {
      state.multipleSelection = data;
    },
    [pk.GET_All_LINKS](state, data) {
      if (_.isArray(data)) {
        state.allLinks = data;
      } else {
        state.allLinks = [data, ...state.allLinks];
      }
    },
    [pk.INSERT_LINKS_ITEM](state, data) {
      if (_.isArray(data)) {
        state.insertLinks = data;
      } else {
        state.insertLinks = [...state.insertLinks, data];
      }
    },
    [pk.INSERT_SUB_LINKS_ITEM](state, data) {
      if (_.isArray(data)) {
        state.subFlowLinks = data;
      } else {
        state.subFlowLinks = [...state.subFlowLinks, data];
      }
    },
    [pk.SET_STEPS_CONNECTON_ID](state, data) {
      state.linkID = data;
    },
    [pk.INSERT_SUB_STEPS_DATA](state, data) {
      //state.subFlowSteps = data;

      if (_.isArray(data)) {
        state.subFlowSteps = data;
      } else {
        state.subFlowSteps = _.map(state.subFlowSteps, item => {
          if (data.id == item.id) {
            return data;
          } else {
            return item;
          }
        });
      }
    }
  }
};

export default history;
