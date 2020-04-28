import serverApi from '@interface/ajax.js'
// const baseWoven = '/api/woven'
const base = '/api'

export default {
  // 获取许可证
  getLicenseInfo: () => { return serverApi.get(`${base}/license/info`) },
  // 登录
  requestLogin: params => { return serverApi.post(`${base}/auth/login`, params) },
  // 获取系统信息
  systemInfo: () => { return serverApi.get(`${base}/system/info`) },
  // 加载登录用户的菜单列表
  loadMenus: () => { return serverApi.post(`${base}/menu/loadMenus`) },
  // 退出登录
  revoke: () => { return serverApi.post(`${base}/auth/revoke`) },
  refresh: params => { return serverApi.get(`${base}/auth/refresh?token=${params}`) },
  // 修改密码
  updateUserPassword: (params) => { return serverApi.post(`${base}/user/changePwd`, params) },
  // 查版本号
  queryVersion: () => { return serverApi.post(`${base}/version/query`) }
}
