<template>
  <el-input
    v-model="value"
    auto-complete="off"
    placeholder="请填写内容"
    @input="change"
  />
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
</style>
