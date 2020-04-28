import { dataset } from "../../mutation-types/index";

//运维监控数据
export const getMuseData = ({ commit }, data) => {
    commit(dataset.MUSESTATUS_DATA, data);
};