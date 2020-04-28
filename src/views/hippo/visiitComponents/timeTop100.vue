<template>
    <div class="urlTop100" id="bm-hippo-visit-timeTop">
        <table-btn
                id="bm-hippo-visit-timeTop-btn"
                :columns="columns"
                :list="list"
        >
        </table-btn>
    </div>
</template>
<script>
    import TableBtn from '@components/table/tableList-btn.vue'

    export default {
        components: {
            TableBtn,
        },
        props: {
            timeList: {
                type: Array,
                default: []
            },
        },
        data() {
            return {
                list: [],
                columns: [  // 需要展示的列
                    {
                        prop: 'uri',
                        label: '资源地址',
                        align: 'left',
                    }, {
                        prop: 'max',
                        label: '请求耗时(毫秒)',
                        align: 'left',
                        width: ''
                    }, {
                        prop: '@timestamp',
                        label: '发起时间',
                        align: 'left',
                        width: ''
                    }
                ]
            }
        },
        methods: {},
        watch: {
            timeList: {
                handler: function (newval, oldVal) {
                    this.list = newval;
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
