<template>
  <section
    id="operationPanel"
    class="operationPanel"
  >
    <div class="operationLeft">
      <slot name="left" />
    </div>
    <div class="operationRight">
      <slot name="right" />
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="scss">
  .operationPanel{
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 0
    }
    .operationLeft > div{
      display: flex;
      align-items: center;
    }
    .operationRight{
      margin-left: auto;
      margin-right: 20px;
        .operationListBtn{
          button {
            height: 50px;
            color: #333;
            padding: 0 20px;
            border-right: 1px solid #999;
            border-left: 1px solid #999;
            i{
              font-weight: 550;
              display: block;
              font-size: 20px;
              margin-bottom: 3px;
            }
            &:hover{
              background: #f0f0f0;
            }
          }
          .el-button.is-disabled {
              color: #999999;
              cursor: not-allowed;
              background-color: #f9f9f9;
          }
          a{
            margin-left: 10px;
          }
        }
    }
  }
</style>
