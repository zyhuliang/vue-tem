<template>
  <iframe name="ifd" :src="iframe+data" scrolling="auto"></iframe>
</template>
<script>
export default {
  props: {
    data: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      iframe: window.iframe
    };
  },
  method: {},
  mounted() {}
};
</script>
<style scoped>
iframe {
  width: 100%;
  /* min-height: 750px; */
  height: 100vh;
  overflow-y: auto;
}
</style>