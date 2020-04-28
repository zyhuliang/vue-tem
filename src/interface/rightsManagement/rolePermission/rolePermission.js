import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 查询权限列表，树状数据结构
  rootsTreePerm: params => { return serverApi.post(`${base}/perm/rootsTree`, params) },
  // 保存 角色
  savePerm: params => { return serverApi.post(`${base}/perm/save`, params) },
  // 编辑角色
  updatePerm: params => { return serverApi.post(`${base}/perm/update`, params) },
  // 根据ID删除权限信息
  deleteByIdPerm: params => { return serverApi.post(`${base}/perm/deleteById/${params}`) }
}
