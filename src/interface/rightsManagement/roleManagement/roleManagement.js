import serverApi from '@interface/ajax.js'
const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 获取租户下所有的角色
  roleList: () => { return serverApi.post(`${base}/role/list`) },
  // 获取角色的列表
  listPageRole: params => { return serverApi.post(`${base}/role/listPage`, params) },
  // 修改角色的状态
  resetStatusRole: params => { return serverApi.post(`${base}/role/resetStatus`, params) },
  // 批量删除角色
  deleteByIdsRole: params => { return serverApi.post(`${base}/role/deleteByIds`, params) },
  // 添加角色信息
  saveRole: params => { return serverApi.post(`${base}/role/save`, params) },
  // 编辑角色信息
  updateRole: params => { return serverApi.post(`${base}/role/update`, params) },

  // 根据权限编码查询资源列表树
  ByCodeResourceTree: () => { return serverApi.post(`${baseWoven}/resource/resourceTree`) },
  // 查询角色列表
  roleInfoById: params => { return serverApi.get(`${base}/role/infoById`, params) },

  // 资源提交
  updateRrrs: params => { return serverApi.post(`${base}/role/updateRrrs`, params) }
}
