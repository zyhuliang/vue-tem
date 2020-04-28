<template>
  <section class="panel" id="panel">
    <slot />
  </section>
</template>
<script>
export default {
  data () {
    return {
      panelClass: 'panel'
    }
  }
}
</script>
<style lang="scss">
  .panel{
    position: absolute;
    z-index: 2000;
    bottom: 0;
    width: 100%;
    height: 60px;
    padding: 0 30px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    border-top: 1px solid #ccc;
    align-items: center;
    box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
  }
</style>
