import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import actions from "./action/index";
import getters from "@/store/getters";
import mutations from "./modules/index";
import createPersistedState from "vuex-persistedstate";
import { pk } from "./mutation-types";

const debug = process.env.NODE_ENV !== "production";
Vue.use(Vuex);

const state = {};

const vuexPersisted = new createPersistedState({
  key: "myVuex",
  storage: window.localStorage,
  reducer: state => ({
    navData: state.pk.navData,
    permission: state.permission,
    saveCurrentData: state.saveCurrentData,
    dataflow: {
      dataFlow: state.dataflow.dataFlow,
      dataflowSet: state.dataflow.dataflowSet,
      getStepData: state.dataflow.getStepData,
      getStepsStatus: state.dataflow.getStepsStatus,
      setting: state.dataflow.setting,
      links: state.dataflow.getactionLinks
    },
    dataset:{
      musestatus: state.dataset.musestatus
    },
    PK: {
      multipleSelection: state.pk.multipleSelection,
      stepData: state.pk.stepData
    },
    common: {
      commonStepData: state.common.commonStepData
    }
  })
  // filter: mutation => (
  //   'CHANGE_LOADING' === mutation.type
  // )
});

const store = new Vuex.Store({
  state,
  actions,
  modules: mutations,
  getters,
  plugins: debug ? [createLogger(), vuexPersisted] : [vuexPersisted]
});
export default store;
