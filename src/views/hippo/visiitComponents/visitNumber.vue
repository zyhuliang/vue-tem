<template id="bm-hippo-visit-visitnum">
    <ve-line :data="visitNumbnerData"></ve-line>
</template>
<script>
    export default {
        props: {
            visitNumbnerData: {
                type: Object,
                default: {}
            },
        },
        data() {
            return {}
        }
    }
</script>
<style lang="scss" scoped>

</style>
