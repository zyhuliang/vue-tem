<template>
  <el-button-group>
    <el-button
      v-for="(item, j) in config"
      :key="item.label"
      :type="index === j ? 'primary' : ''"
      size="mini"
      @click="change(item, j)"
    >
      {{ item.label }}
    </el-button>
  </el-button-group>
</template>
<script>
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      index: 0
    }
  },
  mounted () {
  },
  methods: {
    change (data, index) {
      this.index = index
      this.$emit('currentChange')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button{
  border: 1px solid #dcdfe6;
}
</style>
