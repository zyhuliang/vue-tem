<template>
<!--  close-on-click-modal="false"点击模态框之外部分不消失-->
  <el-dialog
    :title="title"
    v-if="isShowDialog"
    :visible.sync="isShowDialog"
    :width="width"
    :close-on-click-modal="isCloseOnClickModal"
    :modal="isShowBg"
    :close-on-press-escape="ESCclose"
    :before-close="handleClose"
  >
    <slot />
    <span
      v-if="isShowBtn && dialogOperates.length === 0"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确 定
      </el-button>
    </span>
    <span
      v-if="dialogOperates.length !== 0"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        v-for="(item, index) in dialogOperates"
        :key="index"
        :type="item.type || 'text'"
        :size="item.size || 'small'"
        :icon="item.icon"
        :disabled="typeof item.disabled === 'function' ? item.disabled() : item.disabled"
        :plain="item.plain"
        round
        @click="item.method()"
      >
        {{ typeof item.label === 'function' ? item.label() : item.label }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '50%'
    },
    isShowBtn: {
      type: Boolean,
      default: true
    },
    isShowBg: {
      type: Boolean,
      default: true
    },
    ESCclose: {
      type: Boolean,
      default: true
    },
    isShowDialog: {
      type: Boolean,
      default: false
    },
    isCloseOnClickModal: {
      type: Boolean,
      default: false
    },
    dialogOperates: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog')
    },
    close () {
      this.$emit('closeDialog')
    },
    confirm () {
      this.$emit('confirmDialog')
    }
  }

}
</script>
<style lang="scss" scoped>
  .position{
    ::v-deep .el-dialog{
      position: absolute;
      right: 0;
      bottom: 0;
      margin: 0;
      height: 80%;
      box-shadow: 0px 10px 20px #666;
    }
  }
  .dialog{
    ::v-deep .el-dialog__header{
        height: 50px;
        line-height: 50px;
        background: #464a57;
        padding: 0 0 0 20px;
        .el-dialog__title{
          color: #fff;
        }
        .el-dialog__headerbtn{
          top: 17px;
          .el-dialog__close{
            color: #fff;
          }
        }
      }
      ::v-deep .el-dialog__footer{
        border: 1px solid #ddd;
        padding: 0 20px;
        .el-button--primary{
          color: #fff;
          background-color: #0275d8;
          border-color: #0275d8;
          &:hover{
            background-color: #015aa7;
            border-color: #015aa7;
          }
        }
      }
  }
</style>
