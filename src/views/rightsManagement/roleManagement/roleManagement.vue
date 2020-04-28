<template>
  <div id="roleManagement">
    <operationPanel>
      <info-from slot="left" :config="config" :modelData="parameter"/>
      <div slot="right" class="operationListBtn">
        <el-button type="text" icon="el-icon-delete" @click="confirmDialog(deleteByIdsRole)" :disabled="!selectData.length > 0">删除</el-button>
        <el-button type="text" icon="el-icon-search" @click="confirmDialog(resetStatusRole, 'start')" :disabled="!selectData.length > 0">启用</el-button>
        <el-button type="text" icon="el-icon-search" @click="confirmDialog(resetStatusRole, 'disable' )" :disabled="!selectData.length > 0">禁用</el-button>
        <el-button type="text" icon="el-icon-plus" @click="addRole">添加角色</el-button>
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
    <panel title="">
      <pagination
              :parameter="parameter"
              :totalNumber="totalNumber"
              @changeTableData="changeTableData"
      />
    </panel>
    <!-- 编辑 新建角色 -->
    <info-dialog
      :title="title"
      width="98%"
      :isShowDialog="isShowDialog"
      @closeDialog="closeDialog"
      :isShowBtn="false"
    >
      <component
        :is="componentName"
        :row=row
        @closeDialog="closeDialog">
      </component>
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
import { listPageRole, deleteByIdRole } from "@server/Authorization/index.js";
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
    role: () => import('./role'),
    resources: () => import('./resources'),
  },
  data() {
    return {
      componentName: '',
      title: '',
      row: {},  // 编辑所选中的行
      isShowDialog: false, // 弹框
      // 多选数据
      selectData: [],
      tableOption: {
        mutiSelect: true,
        height: 'calc(100vh - 210px)'
      },
      config: {
        ref: "ruleForm",
        size: "small",
        lableWidth: "80px",
        inline: true,
        rule: [
          {
            label: "角色名称",
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
          {
            label: "状态",
            type: "infoSelect",
            model: "enabled",
            methods: val => {
              this.parameter.enabled = val
              // 请求 table 数据
              this.queryTableData()
            },
            options:  [{
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
      parameter: {
        limit: 8,
        offset:0,
        name: '',
        enabled: '' // 必须是 number 默认为空 查全部
      }, // 分页请求数据
      columns: [
        // 需要展示的列
        {
          prop: "name",
          label: "角色名称",
        },{
          prop: "enabled",
          label: "状态",
          formatter: (row, column) => {
            return  row.enabled === 0 ? '未启用' : '已启用'
          },
        }
      ],
      list: [],
      operates: {
        // 操作按钮组,可以配置各个选项来控制按钮的隐藏、是否可点击、
        width: 300,
        fixed: "right",
        list: [
          {
            label: "编辑目录",
            type: "primary",
            // icon: "el-icon-view",
            method: (index, row) => {
              this.title = '编辑目录'
              this.componentName = "role"
              this.isShowDialog = true
              this.row = row
            }
          },
          {
            label: "编辑资源",
            type: "primary",
            method: (index, row) => {
              this.title = '编辑资源'
              this.componentName = "resources"
              this.isShowDialog = true
              this.row = row
            }
          }
        ]
      },
      totalNumber: 0,
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 修改角色的状态， 1、启动   2、未启动
    resetStatusRole(type) {
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
        interface: 'resetStatusRole',
        tips: true,
        success: (data) => {
          // 重新获取数据
          this.queryTableData()
        }
      })
    },
    // 根据多选的信息删除 角色
    deleteByIdsRole() {
      let deleteByIdData = []
      // 循环 table 多选的 值
      for (let value of this.selectData) {
        // 过滤ID
        deleteByIdData.push(value.id)
      }

      this.serverApi({
        params: deleteByIdData,
        interface: 'deleteByIdsRole',
        tips: true,
        success: (data) => {
          // 重新获取数据
          this.queryTableData()
        }
      })
    },
    addRole () {
      this.isShowDialog = true
      this.title = '添加角色'
      this.componentName = "role"
      this.row = {}
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
      // 状态搜索
      if (this.parameter.enabled || this.parameter.enabled === 0) {
        parameter = createParameter('enabled', this.parameter.enabled, 'EQUAL').Build(parameter);
      }
      return parameter
    },
    // 表格请求
    queryTableData () {
      this.$store.commit('updateParameter', {
          data: this.parameter
      })

      this.serverApi({
        params: this.buildParameter(),
        interface: 'listPageRole',
        success: (response) => {
          this.list = response.content
          this.totalNumber = response.totalElements
        }
      })
    },
    // 分页请求数据的回调
    changeTableData (data) {
        this.$set(this, 'parameter', data)
        this.queryTableData()
    },
    //  弹窗关闭
    closeDialog (val) {
      this.isShowDialog = false
      if (val === 'update') {
        // 重新获取数据
        this.queryTableData()
      }
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
