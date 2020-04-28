<template>
  <el-pagination
    :page-sizes="[8 , 16 , 50, 100]"
    :page-size="8"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalNumber"
    :current-page.sync="currentPage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    totalNumber: {
      type: Number,
      default: 0
    },
    parameter: {
      type: Object,
      default: () => {  
          return {
            limit: 8,
            offset: 0
          }
      }
    }
  },
  data () {
    return {
      currentPage: 1,
    }
  },
  computed: {
    saveCurrentData () {
      return this.$store.state.saveCurrentData.saveCurrentData
    },
  },
  watch: {
    totalNumber:{
      handler:function(newValue){
        if (this.saveCurrentData !== 'default') {
          this.currentPage = (this.parameter.offset + 1) / this.parameter.limit
        }
      }
    }
  },
  created () {
    this.$store.commit('updateParameter', {
      data: this.parameter
    })
    // 放在请求之前修改 parameter 的 值
    if (this.saveCurrentData !== 'default') {
      this.$emit('changeTableData', this.saveCurrentData)
    } else {
      this.$emit('changeTableData', this.parameter)
    }
  },
  methods: {
    handleSizeChange (val) {
      this.parameter.limit = val
      this.$emit('changeTableData', this.parameter)
    },
    handleCurrentChange (val) {
      this.parameter.offset = this.parameter.limit * (val - 1)
      this.$emit('changeTableData', this.parameter)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-pagination {
    float: none;
    padding: 0;
    ::v-deep .el-pagination__total{
      margin-right: 60px;
      margin-left: auto;
    }
  }
</style>
