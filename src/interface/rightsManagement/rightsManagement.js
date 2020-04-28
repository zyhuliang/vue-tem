
// 权限管理接口汇总
// 用户
import userManagement from './userManagement/userManagement'
import roleManagement from './roleManagement/roleManagement'
import rolePermission from './rolePermission/rolePermission'
import logAudit from './logAudit/logAudit'
export default {
  ...userManagement,
  ...roleManagement,
  ...rolePermission,
  ...logAudit
}
