<template>
  <el-select
    v-model="value"
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
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    model: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      value: ''
    }
  },
  created () {
    this.value = this.model
  },
  methods: {
    change () {
      this.$emit('update', this.index, this.row.key, this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    margin: 0 15px;
  }
</style>
