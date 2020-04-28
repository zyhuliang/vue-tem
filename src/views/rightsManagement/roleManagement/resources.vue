<template>
  <div class="role">
    <info-card title="资源管理">
        <div class="contentBox">
          <el-form
            size="small"
            label-width="120px"
            :model="numberValidateForm"
            ref="numberValidateForm"
          >
            <el-form-item
              label="角色名称"
              prop="roleName"
              :rules="[{ required: true, message: '角色名不可以为空'}]"
            >
              <el-input disabled v-model="numberValidateForm.roleName" type="roleName"/>
            </el-form-item>
            <el-form-item label="选择权限">
              <div 
                class="block"
              >
                <el-scrollbar 
                  style="height: 410px; width: 320px"
                  v-for="item in resourceTree"
                  :key="item.id"
                >
                  <el-tree
                    :data="[item.root]"
                    :ref="item.resType"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                  >
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <span :title="node.label | nameFilter">{{ node.label | nameFilter }}</span>
                    </span>
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-form-item>
            <el-form-item label>
              <el-button
                size="small"
                type="primary"
                :plain="true"
                round
                @click="submitForm('numberValidateForm')"
              >确定</el-button>
              <el-button size="small" type="primary" :plain="true" round @click="closeDialog">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
    </info-card>
  </div>
</template>
<script>
import InfoCard from "@components/infoCard/infoCard";
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    InfoCard
  },
  data() {
    return {
      numberValidateForm: {
        roleName: ""
      },
      resourceTree: [],
      checked:[], // 树的多选
      defaultProps: {
        children: "children",
        label: "name"
      },
      resType: [], // 获取资源类型
    };
  },
  filters: {
    nameFilter: function (value) {
      if (value === "Datasets") {
          return "数据集";
      } else if (value === "Standards") {
          return "数据标准";
      } else if (value === "Datasources") {
          return "数据源";
      } else if (value === "Schemas") {
          return "元数据";
      } else if (value === "Flows") {
          return "流程";
      } else {
          return value;
      }
    }
  },
  created() {
    this.numberValidateForm.roleName = this.row.name
    this.getResourceTree()
  },
  methods: {
    // 查询角色列表
    roleInfoById () {

      this.serverApi({
        params: { id: this.row.id },
        interface: 'roleInfoById',
        success: (response) => {
           for (let item of response.rrrfGroups) {
              let permissions = []
              for (let values of item.rrrs) {
              // 获取全选  左边树的状态
              if (values.halfSelect === true) {
                permissions.push(values.resourceId)
              }
              }
            // 设置选中
            this.$refs[item.resType][0].setCheckedKeys(permissions);
          }
        }
      })
    },
    getResourceTree () {
      // 请求资源
      this.serverApi({
        interface: 'ByCodeResourceTree',
        success: (response) => {
          // 等 tree 返回之后再调用 选中的资源
          this.roleInfoById()
          this.resourceTree = response
          // 获取资源列表
          for (let item of this.resourceTree) {
            this.resType.push(item.resType)
          }
        }
      })
    },
    async updateRrrs () {
      // 请求资源
      this.serverApi({
        params: {
          id: this.row.id,
          "rrrfGroups": this.getCheckChange(),
        },
        interface: 'updateRrrs',
        tips: true,
        success: (data) => {
          this.closeDialog()
        },
        error: () => {
          this.closeDialog()
        }
      })
    },
    submitForm() {
      this.updateRrrs()
    },
    // 左边 tree 的 选中状态
    getCheckChange () {
      for (let item of this.resType) {
        // 选中的数据 全选  halfSelect = true
        let checkedNodes = []
        for (let value of this.$refs[item][0].getCheckedNodes()) {
          value.halfSelect = true
          checkedNodes.push(value)
        }
        // 半选数据 halfSelect = false
        let halfCheckedNodes = []
        for (let value of this.$refs[item][0].getHalfCheckedNodes()) {
          value.halfSelect = false
          halfCheckedNodes.push(value)
        }
        // 上边是原始数据 
        this.checked.push({
          [item]: checkedNodes.concat(halfCheckedNodes)
        });
      }
      // 生成 提交的数据 rrrfGroups
      return this.rrrfGroups()
    },
    rrrfGroups () {
      let rrrfGroups = []
      for (let item of this.checked) {
        let groups = []
        for (let values of Object.values(item)[0]) {
          groups.push({
            halfSelect: values.halfSelect,
            resourceId: values.id
          })
        }
        rrrfGroups.push({
          "resType": Object.keys(item)[0],
          "rrrs": groups
        })
      }
     return rrrfGroups
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
};
</script>
<style lang="scss" scoped>
.role {
  height: 100%;
  .contentBox {
    width: 100%;
    margin: 0 auto;
    ::v-deep .el-tree-node__content {
      height: 35px;
    }
  }
  .box{
    display: flex;

  }
  .custom-tree-node{
    display: block;
    width: 100%;
  }
  .check{
    font-size: 12px;
    border: 1px solid #3895ff;
    border-radius: 5px;
    margin-left: 15px;
    height: 18px;
    vertical-align: middle;
    margin-top: 5px;
    line-height: 19px;
    padding: 0 5px;
  }
  .block{
    display: flex;
    flex-wrap: wrap;
    .el-checkbox{
      margin-left: 15px;
    }
    ::v-deep .el-tree{
      margin-right: 0px;
      margin-bottom: 30px;
    }
  }
  .el-scrollbar{
    border: 1px #eee solid;
    padding: 10px 0;
    margin: 0 10px 10px 0;
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
