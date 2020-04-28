<template>
  <section
    v-show="showOverlay"
    class="overlay"
  >
    <div class="overlay-main">
      <h3>
        <i
          class="el-icon-close"
          @click="closeOverlay"
        />
      </h3>
      <slot />
    </div>
  </section>
</template>
<script>
export default {
  components: {
  },
  props: {
    showOverlay: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('onCloseOverlay')
    }
  }
}
</script>
<style lang="scss">
  .overlay{
    display: flex;
    align-items:center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,32,97,0.5);
    z-index: 2001;
    .overlay-main{
      background: #fff;
      padding: 0 30px 30px 30px;
      border-radius: 10px;
      h3{
        text-align: right;
           > .el-icon-close{
          font-size: 20px;
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
</style>
