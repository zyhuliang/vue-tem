<template>
  <div id="roleManagement">
    <operationPanel>
      <info-from slot="left" :config="config" :modelData="parameter"/>
      <div slot="right" class="operationListBtn">
        <el-button type="text" icon="el-icon-delete" @click="confirmDialog(deleteByIdsUser)"  :disabled="!selectData.length > 0">删除</el-button>
        <el-button type="text" icon="el-icon-search" @click="confirmDialog(resetStatusUser, 'start')" :disabled="!selectData.length > 0">启用</el-button>
        <el-button type="text" icon="el-icon-search" @click="confirmDialog(resetStatusUser, 'disable')"  :disabled="!selectData.length > 0">禁用</el-button>
        <el-button type="text" icon="el-icon-plus" @click="addUser">添加用户</el-button>
      </div>
    </operationPanel>
    <div class="list">
      <table-btn
        :columns="columns"
        :list="list"
        :options="tableOption"
        :operates="operates"
        @handleSelectionChange="handleSelectionChange"
      />
    </div>
    <panel title="100">
      <pagination
        :parameter="parameter"
        :totalNumber="totalNumber"
        @changeTableData="changeTableData"
      />
    </panel>
    <!-- 添加用户 和 编辑用户 -->
    <!-- 权限分配 -->
    <!-- 安全管理 -->
    <info-dialog
      :title="title"
      width="60%"
      :isShowDialog="isShowDialog"
      @closeDialog="closeDialog"
      :isShowBtn="false"
    >
      <component
        :is="active"
        :entity="entity"
        @updateUser="updateUser"
        @closeDialog="closeDialog"
      />
    </info-dialog>
  </div>
</template>
<script>
import operationPanel from "@components/layout/operationPanel";
import infoFrom from "@components/infoFrom/infoFrom";
import tableBtn from "@components/table/tableList-btn";
import Pagination from "@components/pagination/pagination";
import Panel from "@components/layout/panel";
import infoDialog from '@components/infoDialog/dialog'
import {
  queryObject,
  createParameter
} from "@components/function/queryParameter.js";
export default {
  components: {
    operationPanel,
    infoFrom,
    tableBtn,
    Pagination,
    Panel,
    infoDialog,
    baseInformation: () => import('./user/baseInformation'),
    permissionAssignment: () => import('./user/permissionAssignment'),
    securityManagement: () => import('./user/securityManagement')
  },
  data() {
    return {
      isAdd: false,
      active: '',
      isShowDialog: false, // 弹框
      title: '',
      selectData: [],
      tableOption: {
        mutiSelect: true,
        height: 'calc(100vh - 210px)',
        selectable (row) {
          return row.name === sessionStorage.getItem('user') ? false : true 
        }
      },
      roleList: [],
      entity: {
        name: '',
        loginId: '',
        password: '',
        confirmPassword: '',
        phone: '',
        resourceQueues: [], //资源队列
        email: '',
        roles: [],
        rolesId: [],
        accountExpiredTime: '', // 用户有效期
        pwdExpiredTime: '', // 密码有效期
        id: ''
      },
      // 搜索配置
      config: {
        ref: "ruleForm",
        size: "small",
        lableWidth: "80px",
        inline: true,
        rule: [
          {
            label: "用户名",
            type: "infoInput",
            model: "name",
            methods: val => {
              this.parameter.name = val
            },
            button: {
              slot: 'append',
              icon: 'el-icon-search',
              methods: () => {
                // 请求 table 数据
                this.queryTableData()
              }
            }
          },
          // 暂时隐藏， 下个版本支持
          // {
          //   label: "角色",
          //   type: "infoSelect",
          //   model: "role",
          //   key: ["label", "label"],
          //   methods: val => {
          //     this.parameter.roleId = val
          //     this.queryTableData()
          //   },
          //   options: () => { return this.roleList},
          // },
          {
            label: "状态",
            type: "infoSelect",
            model: "enabled",
            methods: val => {
              this.parameter.enabled = val
              this.queryTableData()
            },
            options: [{
                label: '全部',
                value: ''
              },{
                label: '未启用',
                value: 0
              }, {
                label: '已启用',
                value: 1
            }]
          }
        ]
      },
      list: [],
      // table 头部信息
      columns: [
        // 需要展示的列
        {
          prop: "loginId",
          label: "登录名",
        },
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "roles.name",
          label: "角色",
          formatter: (row, column) => {
            let roles = []
            for (let value of row.roles) {
              roles.push(value.name)
            }
            return roles.toString()
          },
        },
        {
          prop: "accountExpiredTime",
          label: "账号有效期",
        },
        {
          prop: "pwdExpiredTime",
          label: "密码有效期",
        },
        {
          prop: "enabled",
          label: "状态",
          formatter: (row, column) => {
            return  row.enabled === 0 ? '未启用' : '已启用'
          },
        }
      ],
      // table  按钮
      operates: {
        // 操作按钮组,可以配置各个选项来控制按钮的隐藏、是否可点击、
        width: 300,
        fixed: "right",
        list: [{
            label: "基本信息",
            type: "primary",
            // icon: "el-icon-view",
            method: (index, row) => {
              this.isShowDialog = true
              this.active = 'baseInformation'
              this.title = '编辑基本信息'
              // 编辑
              this.isAdd = false
              this.entity = {
                name: row.name,
                loginId: row.loginId,
                password: row.password,
                phone: row.phone,
                email: row.email,
                id: row.id,
                resourceQueues: row.resourceQueues,
                disable: true // 在点击基本信息的时候用户名不可以编辑
              }
            }
          },{
            label: "权限",
            type: "primary",
            // icon: "el-icon-view",
            method: (index, row) => {
              this.isShowDialog = true
              this.active = 'permissionAssignment'
              this.title = '编辑权限'
              let roles = []
              let rolesId = []
              for (let value of row.roles) {
                rolesId.push(value.name)
              }
              // 获取已选的 角色列表
              this.entity = {
                id: row.id,
                rolesId: rolesId
              }
              // 编辑
              this.isAdd = false
            }
        },{
            label: "有效期",
            type: "primary",
            // icon: "el-icon-view",
            method: (index, row) => {
              this.isShowDialog = true
              this.active = 'securityManagement'
              this.title = '编辑有效'
              this.entity = {
                accountExpiredTime: '',
                id: row.id,
                pwdExpiredTime: ''
              }
              // 编辑
              this.isAdd = false
            }
        }]
      },
      parameter: {
          limit: 8,
          offset:0,
          name: '',
          enabled: '' // 必须是 number 默认为空 查全部
      }, // 分页请求数据
      totalNumber: 0,
    };
  },
  async created() {
    this.serverApi({
      interface: 'roleList',
      success: (response) => {
        for (let value of response) {
          this.roleList.push({
            label: value.name,
            value: value.id
          })
        }
      }
    })
  },
  mounted() {
  },
  methods: {
    // 更改用户状态
    async resetStatusUser(type) {
      let resetStatusData = []
      // 循环 table 多选的 值
      for (let value of this.selectData) {
        //  通过 type 判断是启动 还是禁用
        let enabled = type === 'start' ? 1 : 0
        resetStatusData.push({
          id: value.id,
          enabled: enabled
        })
      }
       this.serverApi({
        params: resetStatusData,
        interface: 'resetStatusUser',
        tips: true,
        success: () => {
          // 重新获取数据
          this.queryTableData()
        }
      })
    },
    // 根据多选的信息删除 用户
    deleteByIdsUser () {
        let deleteByIdData = []
      // 循环 table 多选的 值
      for (let value of this.selectData) {
        // 过滤ID
        deleteByIdData.push(value.id)
      }
       this.serverApi({
        params: deleteByIdData,
        interface: 'deleteByIdsUser',
        tips: true,
        success: () => {
          // 重新获取数据
          this.queryTableData()
        }
      })
    },
    // 分页请求数据的回调
    changeTableData (data) {
        this.$set(this, 'parameter', data)
        this.queryTableData()
    },
    handleSelectionChange(val) {
      this.selectData = val 
    },
    // 请求 table 列表
    buildParameter () {
      // 只有在这个地方处理参数
      let parameter = createParameter().Limit(this.parameter.limit).Offset(this.parameter.offset).Build()
      // 名字搜索
      if (this.parameter.name) {
          parameter = createParameter('name', `%${this.parameter.name}%`, "LIKE").Build(parameter)
      }
      // 角色 搜索
      if (this.parameter.roleId) {
          parameter = createParameter('roleId', this.parameter.roleId, 'EQUAL').Build(parameter);
      }
      // 状态搜索
      if (this.parameter.enabled || this.parameter.enabled === 0) {
        parameter = createParameter('enabled', this.parameter.enabled, 'EQUAL').Build(parameter);
      }
      return parameter
    },
    // 表格请求
    async queryTableData () {
      this.$store.commit('updateParameter', {
          data: this.parameter
      })
       this.serverApi({
        params: this.buildParameter(),
        interface: 'listPageUser',
        success: (response) => {
          // 赋值 table 数据
          this.list = response.content
          this.totalNumber = response.totalElements
        }
      })
    },
    //  弹窗关闭
    closeDialog () {
      this.isShowDialog = false
    },
    async updateUser (data) {
      // 只有在权限页面才有data
      if (this.active === 'permissionAssignment') {
        // 获取选中的 角色
        let roles = []
        for (let value of this.entity.rolesId) {
          roles.push({
            id: data[value]
          })
        }
        // 获取已选的 角色列表
        this.entity.roles = roles
      }
      // 如果是添加不执行下边接口
      if (this.isAdd) {
        this.saveUser()
        return false
      }
      this.serverApi({
        params: this.entity,
        interface: 'updateUser',
        tips: true,
        success: () => {
          // 编辑成功需要 刷新 数据 和 关闭弹框
          this.queryTableData()
        }
      })
    },
    // 点击添加用户按钮
    addUser () {
      this.entity = {
        name: '',
        loginId: '',
        password: '',
        phone: '',
        email: '',
        confirmPassword: '',
        resourceQueues: []
      }
      this.active = 'baseInformation'
      this.title = '添加用户'
      this.isShowDialog = true
      this.isAdd = true
    },
    // 保存用户信息
    saveUser () {
      this.serverApi({
        params: this.entity,
        interface: 'saveUser',
        tips: true,
        success: () => {
         // 编辑成功需要 刷新 数据 和 关闭弹框
          this.queryTableData()
        }
      })
    },
    // 提示框
    confirmDialog (callback, type) {
      this.$confirm(`是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callback(type)
        }).catch(() => {    
          return false     
        });
    }
  }
};
</script>
<style lang="scss" scoped>
#roleManagement {
  .list {
    height: 100%;
    width: 100%;
  }
}
</style>
