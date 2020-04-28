import serverApi from '@interface/ajax.js'
// 权限管理
import rightsManagement from '@interface/rightsManagement/rightsManagement'

// 数据监控
import monitor from '@interface/monitor'

// 登陆 页面
import login from './login'

// 关于我们
import aboutUs from './aboutUs'
const baseWoven = '/api/woven'
const base = '/api'

export default {
  ...aboutUs,
  ...login,
  ...rightsManagement,
  ...monitor,
  // 全局都能用的到
  tempDetail: (modelId) => { return serverApi.get(`${baseWoven}/zmod/${modelId}`) },
  // 查询 flow
  queryFlow: (params) => { return serverApi.post(`${base}/flows/query`, params) },
  queryDataset: (params) => { return serverApi.post(`${base}/datasets/query`, params) },
  // 获取资源目录根
  queryRoots: (params) => { return serverApi.get(`${baseWoven}/resource/roots${params}`) },
  // 查询 数据集 tree 的子项
  queryResource: (id) => { return serverApi.get(`${baseWoven}/resource/${id}`) },
  // 数据集预览   需要调两个接口
  previewinit: (id, tenantId, rows) => { return serverApi.get(`${base}/datasets/${id}/previewinit?tenant=${tenantId}&rows=${rows}`) },
  previewresult: (id, tenantId, statementId, clusterId) => { return serverApi.get(`${base}/datasets/${id}/previewresult?tenant=${tenantId}&statementId=${statementId}&clusterId=${clusterId}`) },
  analyzeCancel: (statementId) => { return serverApi.get(`${base}/datasets/statement/cancel?statementId=${statementId}`) },
  // 请求 表头信息
  querySchema: (id) => { return serverApi.get(`${base}/schemas/${id}`) },

  // 复杂搜索
  search: (catalog, params) => { return serverApi.get(`${catalog}/filed/info`, params) }
}
