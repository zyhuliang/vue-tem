<template id="bm-hippo-visit-visitSuccess">
    <ve-histogram :data="visitSuccessData" :settings="chartSettings"></ve-histogram>
</template>

<script>
    export default {
        props: {
            visitSuccessData: {
                type: Object,
                default: {}
            },
        },
        data() {
            this.chartSettings = {
                stack: {'访问量': ['成功', '成功率', '失败', '失败率']},
                // yAxisType: ['percent'],
            }
            return {}
        }
    }
</script>