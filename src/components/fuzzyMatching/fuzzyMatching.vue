<template>
  <el-input
    v-model="keyword"
    placeholder="请输入内容"
    size="mini"
    @input="fuzzyMatching(keyword, 'alternativeTotalData')"
  >
    <i
      slot="prefix"
      class="el-input__icon el-icon-search"
    />
  </el-input>
</template>
<script>
export default {
  props: {
    totalData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    fuzzyMatching () {
      let result = []
      // 防止连续输入 执行，如果 半秒之后不输入在执行
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 定义匹配正则
        let reg = new RegExp(this.keyword, 'gim')
        for (let index in this.totalData) {
          let str = this.totalData[index].name
          // 如果包含 true
          if (str.match(reg)) {
            // 赋值给 总数据
            result.push(this.totalData[index])
          }
          this.timer = null
        }
        this.$emit('getfuzzyMatching', result, this.keyword)
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
