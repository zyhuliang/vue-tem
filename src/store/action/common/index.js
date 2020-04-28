import { pk } from "../../mutation-types/index";

//导航菜单数据项
export const getCommonStepData = ({ commit }, data) => {
  commit(pk.GET_RIGHT_ASIDE_DATA, data);
};

export const getLangStatus = ({ commit }, data) => {
  commit(pk.SET_LANG_STATEE, data);
};
