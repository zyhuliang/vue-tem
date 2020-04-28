import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 更新版本信息
  queryRelease: () => { return serverApi.post(`${base}/version/release`) }
}
