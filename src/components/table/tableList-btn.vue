<template>
  <div class="tableListBtn">
    <el-table
     ref="multipleTable"
      v-loading="options.loading"
      id="bm-com-table-tableList-btn-table"
      :data="list"
      :stripe="options.stripe"
      style="width: 100%"
      :highlight-current-row="options.chooseOne"
      :max-height="options.height"
      :height="options.height"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        :selectable="options.selectable"
        style="width: 55px;"
      />
      <template v-for="(column) in columns">
        <template v-if="!column.show">
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :align="column.align"
            :width="column.width"
          >
            <template slot-scope="scope">
              <template v-if="column.formatter">
                <span
                  @click="column.method ? column.method(scope.row, column) : ''"
                  v-html="column.formatter ? column.formatter(scope.row, column) : ''"
                />
              </template>
              <template v-else>
                <span>{{ scope.row[column.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
      </template>

      <!--region 按钮操作组-->
      <el-table-column
        v-if="operates"
        label="操作"
        :width="operates.width"
        :fixed="operates.fixed"
      >
        <template slot-scope="scope">
          <div class="operate-group">
            <span
              v-for="btn in operates.list"
              :key="btn.label"
              class="operateBtn"
            >
              <!-- 根据状态显示icon  开始-->
              <el-button
                :type="btn.type"
                size="mini"
                :icon="btn.icon"
                :disabled="btn.disabled"
                :plain="btn.plain"
                :round="btn.round"
                @click="btn.method(scope.$index,scope.row)"
              >
                {{ btn.label }}
              </el-button>
              <!-- 根据状态显示icon 结束 -->
            </span>
          </div>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'TableBtn',
  props: {
    list: {
      type: Array,
      default: () => [] // prop:表头绑定的地段，label：表头名称，align：每列数据展示形式（left, center, right），width:列宽
    }, // 数据列表
    columns: {
      type: Array,
      default: () => [] // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    },
    operates: {
      type: Object,
      default: () => {} // width:按钮列宽，fixed：是否固定（left,right）,按钮集合 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    },
    options: {
      type: Object,
      default: function () {
        return {
          stripe: false, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          mutiSelect: false, // 是否支持列表项选中功能
          height: '1000',
          tableOption: false
        }
      }
    } // table 表格的控制参数
  },
  data () {
    return {
    }
  },
  methods: {
    // 多行选中
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 单行选中
    handleCurrentChange (val, index) {
      this.$emit('handleCurrentChange', val)
    },
    resetSelection(){
      this.$refs.multipleTable.clearSelection();
    }

  }
}
</script>
<style lang="scss" scoped>
.tableListBtn{
  padding: 20px;
  .operateBtn{
    margin-right: 15px;
  }
  .el-table{
    height: 100%;
  }
  ::v-deep .el-table th > .cell {
    // header
    color: #333;
    font-size: 15px;
    font-weight: 600;
    }
        // body
  ::v-deep .el-table__body-wrapper{
    .cell{
      color: #333;
      font-weight: 600;
    }
  }
  ::v-deep .el-table__fixed-right{
    height: 100%!important;
  }
}
</style>
