<template>
  <div class="role">
    <info-card title="目录管理">
      <el-scrollbar style="height: 400px">
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
              <el-input v-model="numberValidateForm.roleName" type="roleName"/>
            </el-form-item>
            <el-form-item label="选择权限">
              <div class="box">
                <el-tree
                  ref="tree"
                  :data="treeData"
                  default-expand-all
                  accordion
                  show-checkbox
                  node-key="id"
                  :props="defaultProps"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span>{{ node.label }}</span>
                  </span>
                </el-tree>
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
      </el-scrollbar>

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
      checked:[], // 树的多选
      treeData: [], // 树的数据
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {
    'row': {
      handler (newdata, olddata) {
        this.numberValidateForm.roleName = newdata.name
        this.$refs.tree.setCheckedKeys(newdata.permIds || []);
      },
      deep: true // 开启深度监听
    }
  },
  async created() {
    this.numberValidateForm.roleName = this.row.name
    // 请求左边 tree 的数据
    this.serverApi({
      interface: 'rootsTreePerm',
      success: (response) => {
        this.treeData = response
        if(this.numberValidateForm.roleName){
          this.roleInfoById()
        }
      }
    })
  },
  methods: {
    // 查询角色列表
    async roleInfoById () {

      this.serverApi({
        params: { id: this.row.id },
        interface: 'roleInfoById',
        success: (response) => {
          let permissions = []
            for (let item of response.permissions) {
              // 获取全选  左边树的状态
              if (item.halfSelect === true) {
                permissions.push(item.id)
              }
            }
            // 设置选中
            this.$refs.tree.setCheckedKeys(permissions);
          },
        error: () => {
          this.licenseActivate()
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveRole()
        } else {
          return false;
        }
      });
    },
    async saveRole() {
      // 获取选中的数据
      this.getCheckChange()
      // 请求树的数据
      if (this.row.id) {
        // 更新
        this.serverApi({
          params: {
            name: this.numberValidateForm.roleName,
            permissions: this.checked,
            id: this.row.id
          },
          interface: 'updateRole',
          tips: true,
          success: () =>{
            this.$emit('closeDialog', 'update')
          }
        })
      } else {
        // 保存
        this.serverApi({
          params: {
            name: this.numberValidateForm.roleName,
            permissions: this.checked
          },
          interface: 'saveRole',
          tips: true,
          success: () =>{
            this.$emit('closeDialog', 'update')
          }
        })
      }
    },
    // 左边 tree 的 选中状态
    getCheckChange () {
      // 选中的数据 全选  halfSelect = true
      let checkedNodes = []
      for (let item of this.$refs.tree.getCheckedNodes()) {
        item.halfSelect = true
        checkedNodes.push(item)
      }
      // 半选数据 halfSelect = false
      let halfCheckedNodes = []
      for (let item of this.$refs.tree.getHalfCheckedNodes()) {
        item.halfSelect = false
        halfCheckedNodes.push(item)
      }
      // 上边是原始数据 
      this.checked = checkedNodes.concat(halfCheckedNodes) ;
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
    width: 80%;
    margin: 0 auto;
    ::v-deep .el-tree-node__content {
      height: 35px;
    }
  }
  .box{
    display: flex;
    .el-tree{
      width: 50%;
    }
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
    .el-checkbox{
      margin-left: 15px;
    }
  }
}
</style>
