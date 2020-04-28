<template>
  <div class="addRole">
    <info-card title="资源管理">
      <div class="contentBox">
        <el-button
          size="mini"
          @click="append('root', 'root')"
        >
          添加根节点
        </el-button>
        <el-tree
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span> {{ data.name }} </span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(data, 'add')">
                添加
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(data, 'type')">
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="deleteDialog(deleteByIdPerm, node, data)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </info-card>
    <!-- 安全管理 -->
    <info-dialog
      title="编辑角色"
      width="60%"
      :isShowDialog="isShowDialog"
      @closeDialog="closeDialog"
      :isShowBtn="false"
    >
     <info-from
      :config="config"
      :modelData="entity"
      ref="editRole"
    />
    </info-dialog>
  </div>
</template>
<script>
import InfoCard from "@components/infoCard/infoCard";
import infoDialog from '@components/infoDialog/dialog'
import infoFrom from '@components/infoFrom/infoFrom'
let id = 1000;
export default {
  components: {
    InfoCard,
    infoDialog,
    infoFrom
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      type:[
        {
          label: '模块',
          value: 1
        },{
          label: '菜单',
          value: 2
        },{
          label: '按钮',
          value: 3
        },{
          label: '文件',
          value: 4
        },{
          label: '资源',
          value: 5
        }
      ],
      interface: '',
      empty:{
        name: '',
        description: '',
        type: 1,
        url: '',
      },
      entity: {
        name: '',
        description: '',
        type: 1,
        url: '',
        code: '',
        route: '',
        icon: ''
      },
      currentData: {},
      isShowDialog: false,
      config: {
        ref: 'editRole',
        size: 'small',
        lableWidth: '120px',
        validate: {
          'name': [
            { required: true, message: '请输入名字', trigger: 'blur' }
          ],
          'type': [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          'url': [
            { required: true, message: '请输入URL', trigger: 'blur' }
          ],
          'route': [
            { required: true, message: '请输入路由', trigger: 'blur' }
          ]
        },
        rule: [
          { label: '编码',
            type: 'infoInput',
            model: 'code'
          },
          { label: '名字',
            type: 'infoInput',
            model: 'name'
          }, {
              label: "类型",
              type: "infoSelect",
              model: "type",
              options: () => { return this.type},
            }, { 
              label: 'URL',
              type: 'infoInput',
              model: 'url'
          }, { 
              label: '路由',
              type: 'infoInput',
              model: 'route'
          }, { 
              label: '图标',
              type: 'infoInput',
              model: 'icon'
          }, { 
              label: '描述',
              type: 'infoInput',
              model: 'description'
          }
        ],
        operation: [{
          label: '确定',
          type: 'primary',
            method: (vue, ref) => {
              if (this.globalRuleForm(vue, ref)) {
                  this.perm()
              }
          }
      }]
      },
      treeData: []
    };
  },
  created() {
    // 请求树的数据
    this.rootsTreePerm()
  },
  mounted() {
  },
  methods: {
    // 获取 权限 tree
    rootsTreePerm () {
      this.serverApi({
        interface: 'rootsTreePerm',
        success: (response) => {
          this.treeData = response
          // 删除 添加成功都会调用这个接口， 然后清空
          this.entity = JSON.parse(JSON.stringify(this.empty))
        }
      })
    },
    addPerm() {
      // 给tree 添加节点
      if (!this.currentData.children) {
        this.$set(this.currentData, 'children', []);
      }
      this.currentData.children.push(this.entity);
    },
    // 添加
    append(data, type) {
      this.entity = JSON.parse(JSON.stringify(this.empty))
      this.isShowDialog = true
      if (data === 'root') {
        this.currentData.id = undefined
        return false
      }
      this.interface = type
      this.currentData = data
    },
    // 编辑
    edit (data, type) {
      this.isShowDialog = true
      this.interface = type
      this.entity = data
      delete this.entity.children
    },
    // 请求成功，最后删除tree
     remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    // 关闭弹框
    closeDialog () {
      this.isShowDialog = false
    },
    // 保存 或者 编辑角色
    perm () {
      // 调用 editRole 的 方法触发 验证
      if (this.$refs.editRole.RuleForm()) {
        // 请求树的数据
        this.entity.parentId = this.currentData.id
        let type = this.interface === 'add' ? 'savePerm' : 'updatePerm'
        if (this.interface === 'type') {
          delete this.entity.parentId
        }
        this.serverApi({
          params: this.entity,
          interface: type,
          tips: true,
          success: (data) => {
            this.addPerm()
            this.rootsTreePerm()
          }
        })
        // 成功关闭
        this.closeDialog()
      }
    },
    deleteByIdPerm (node, data) {
      this.serverApi({
        params: data.id,
        interface: 'deleteByIdPerm',
        tips: true,
        success: () => {
          // 删除成功之后再删除树上的
          this.remove(node, data)
          this.rootsTreePerm()
        }
      })
    },
    // 提示框
    deleteDialog (callback, node, data) {
      this.$confirm(`是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          callback(node, data)
        }).catch(() => {    
          return false     
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.addRole {
  height: 100%;
  .contentBox {
    width: 50%;
    margin: 0 auto;
    ::v-deep .el-tree-node__content {
      height: 40px;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>
