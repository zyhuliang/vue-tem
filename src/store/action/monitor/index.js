import { monitor } from "../../mutation-types/index";

//运维监控数据
export const getMonitorData = ({ commit }, data) => {
    commit(monitor.MONITOR_DATA, data);
};