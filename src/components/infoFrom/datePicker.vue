<template>
  <el-form-item
    v-if="row.show === undefined ? true : row.show()" 
    :label="row.label"
    :prop="row.prop"
  >
    <el-date-picker
      v-if="row.dateType === 'date'"
      v-model="value"
      type="date"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp"
      @change="changeDate"
      placeholder="选择日期">
    </el-date-picker>
    <el-date-picker
      v-else
      v-model="value"
      type='daterange'
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy 年 MM 月 dd 日"
      :value-format="row.valueFormat"
      @change="changeDaterange"
    />
  </el-form-item>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    modelData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // 必须是一个数组 一个 字符串
      value: '',
    }
  },
  watch: {
      'modelData': {//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
            //  this.buildValue()
         },
         deep:true //true 深度监听
     }
  },
  created () {
  },
  methods: {
    
    buildValue () {
      let value = []
      for (let item of this.row.model.split(', ')) {
        value.push(this.globalDynamicValue(item, this.modelData) || '')
      }
      if (value.length === 1) {
        this.value = value[0]
        return
      }
      this.value =value
    },
    changeDaterange () {
      // 如果清空值的话返回的是null ， 所以要做容错处理
      if (this.value === null) {
        this.row.methods(['', ''])
        return false
      }
      this.row.methods(this.value)
    },
    changeDate () {
      // 如果清空值的话返回的是null ， 所以要做容错处理
      if (this.value === null) {
        this.row.methods('')
        return false
      }
      this.row.methods(this.value)
    },

  }
}
</script>
<style lang="scss" scoped>
  .el-range-editor.el-input__inner{
    margin: 0;
  }
  .el-range-editor--small .el-input__inner{
    width: 100%;
  }
</style>
