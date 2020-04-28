<template>
  <!-- <iframe
    name="ifd"
    src="http://192.168.21.158:3000/d/LJ4HXrhZz/flink?refresh=1m&orgId=1"
    scrolling="auto"
    id="bm-hippo-nodeMonitor"
  ></iframe> -->

  <iframe
    name="ifd"
    :src="flinkframe + '/d/LJ4HXrhZz/flink?refresh=1m&orgId=1'"
    scrolling="auto"
    id="bm-hippo-nodeMonitor"
  ></iframe>
</template>
<script>
export default {
  data() {
    return {
      flinkframe: window.flinkframe
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
