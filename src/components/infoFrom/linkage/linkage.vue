<template>
  <el-form-item
    :label="row.label"
    :prop="row.model"
  >
    <el-select
      v-model="value1"
      placeholder="请选择"
      @change="change"
    >
      <el-option
        v-for="item in row.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value2"
      placeholder="请选择"
      @change="change"
    >
      <el-option
        v-for="item in row.options.children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
      value1: '',
      value2: '',
      value3: '',
      key: []
    }
  },
  created () {
    this.value = this.globalDynamicValue(this.row.model, this.modelData)
  },
  methods: {
    change () {
      this.row.methods(this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }
</style>
