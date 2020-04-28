import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 获取租户下所有的角色
  logsMetrics: (params) => { return serverApi.get(`${base}/logs/metrics/request/page`, params) },
  metricsQueryMenus: () => { return serverApi.get(`${base}/logs/metrics/request/queryMenus`) }
}
