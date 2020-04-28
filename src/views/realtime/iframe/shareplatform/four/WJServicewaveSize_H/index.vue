<template>
  <viframe :data="src"></viframe>
</template>
<script>
import viframe from "../../../tmp/index";
export default {
  components: { viframe },
  data() {
    return {
      src:
        "/automaticWeb/autoIndex.action?url=auto/chartConfig/WJServicewaveSize_H.action"
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