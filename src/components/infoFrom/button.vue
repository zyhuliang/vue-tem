<template>
  <el-form-item
    :label="row.label"
    :prop="row.model"
  >
     <el-button
        v-for="(item, index) in row.operation"
        :key="index"
        :name ="row.model"
        v-if="item.show === undefined ? true : item.show()"
        :type="item.type || 'text'"
        :size="row.size"
        :icon="item.icon"
        :disabled="typeof item.disabled === 'function' ? item.disabled() : item.disabled"
        :plain="item.plain"
        round
        @click="item.method()"
    >
        {{ typeof item.label === 'function' ? item.label() : item.label }}
    </el-button>
  </el-form-item>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },

}
</script>

<style lang="scss" scoped>
  ::v-deep .el-select{
    .el-input {
        width: 130px;
    }
  }
</style>
