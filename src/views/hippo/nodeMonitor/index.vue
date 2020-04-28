<template>
    <iframe name="ifd" src="/ambari/" scrolling="auto" id="bm-hippo-nodeMonitor"></iframe>
    <!--<iframe name="ifd" src="http://192.168.1.189:8515/ambari/#/main/dashboard/metrics"  scrolling="no"></iframe>-->
</template>
<script>
    export default {
        data() {
            return {}
        },
        method: {},
        mounted() {

        }
    }
</script>
<style scoped>
    iframe {
        width: 100%;
        min-height: 750px;
        overflow-y: auto;
    }
</style>