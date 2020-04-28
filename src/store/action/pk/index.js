import { pk } from "../../mutation-types/index";

//导航菜单数据项
export const getNavData = ({ commit }, data) => {
  commit(pk.GET_NAV_DATA, data);
};

export const getMultipleSelection = ({ commit }, data) => {
  commit(pk.GET_NAV_DATA_TEST, data);
};

export const getAllLinks = ({ commit }, data) => {
  commit(pk.GET_All_LINKS, data);
};

export const insertLinks = ({ commit }, data) => {
  commit(pk.INSERT_LINKS_ITEM, data);
};

export const inserSubtLinks = ({ commit }, data) => {
  commit(pk.INSERT_SUB_LINKS_ITEM, data);
};

export const setlinksId = ({ commit }, data) => {
  commit(pk.SET_STEPS_CONNECTON_ID, data);
};

export const getSubFlowSteps = ({ commit }, data) => {
  commit(pk.INSERT_SUB_STEPS_DATA, data);
};

export const getStepList = ({ commit }, data) => {
  commit(pk.GET_RIGHT_ASIDE_DATA, data);
};
