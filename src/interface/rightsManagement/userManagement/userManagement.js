import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 根据条件排序分页查询对象
  listPageUser: params => { return serverApi.post(`${base}/user/listPage`, params) },
  // 修改用户的状态
  resetStatusUser: params => { return serverApi.post(`${base}/user/resetStatus`, params) },
  // 根据ID删除实体对象
  deleteByIdsUser: params => { return serverApi.post(`${base}/user/deleteByIds`, params) },
  // 添加用户
  saveUser: params => { return serverApi.post(`${base}/user/save`, params) },
  // 编辑用户名
  updateUser: params => { return serverApi.post(`${base}/user/update`, params) },
  // 根据id 获取用户的详细信息
  infoByIdUser: params => { return serverApi.get(`${base}/user/infoById`, params) },
  //
  // 获取资源队列
  getResourceQueues: () => { return serverApi.post(`${base}/user/getResourceQueues`) }
}
