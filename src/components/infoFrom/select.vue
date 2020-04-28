<template>
  <el-form-item
    v-if="row.show === undefined ? true : row.show()"
    :label="row.label"
    :prop="row.model"
  >
    <el-select
      v-model="modelData[row.model]"
      :filterable="row.filterable"
      allow-create
      default-first-option
      placeholder="请选择"
      @change="changes"
      :multiple="row.multiple || false"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item[row.key] && item[row.key[0]] || item.label"
        :value="item[row.key] && item[row.key[1]] || item.value"
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
      options: typeof this.row.options === 'function' ? this.row.options() : this.row.options,
    }
  },
  methods: {
    changes () {
      this.row.methods(this.modelData[this.row.model])
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }
</style>
