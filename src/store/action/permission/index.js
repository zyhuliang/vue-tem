import { permission } from "../../mutation-types/index";

//导航菜单数据项
export const updatePermissiont = ({ commit }, data) => {
  commit(permission.GET_NAV_DATA_PER, data);
};
