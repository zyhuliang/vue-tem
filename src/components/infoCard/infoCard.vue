<template>
  <div class="infoCard">
    <h4>
      <span>{{ title }}</span>  <i
        v-if="showClose"
        class="el-icon-arrow-right close"
        @click="close"
      />
    </h4>
    <div class="block">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '查看'
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('globalCloseInfoCard')
    }
  }
}
</script>
<style lang="scss" scoped>
  .infoCard{
    height: 100%;
    background: #fff;
    overflow: hidden;
    >h4{
      line-height: 60px;
      height: 60px;
      padding: 0 0 0 20px;
      border-bottom: 1px solid #ebeef5;
      position: relative;
      .close{
        position: absolute;
        right: 20px;
        top: 18px;
      }
    }
    > .block{
      height: calc(100% - 60px);
      padding: 10px;
    }
  }
</style>
