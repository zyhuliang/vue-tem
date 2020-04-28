import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 查询 数据资源
  statisticsDatasource: () => { return serverApi.get(`${base}/statistics/datasource`) },
  // 数据共享-接口访问
  requestIncrease: () => { return serverApi.get(`${base}/logs/metrics/request/increase`) },
  // 数据流程
  statisticsTaskinfo: () => { return serverApi.get(`${base}/statistics/taskinfo`) }
}
