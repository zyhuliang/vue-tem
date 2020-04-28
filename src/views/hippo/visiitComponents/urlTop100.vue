<template>
    <div class="urlTop100" id="bm-hippo-visit-urlop">
        <table-btn
                id="bm-hippo-visit-urlop-table"
                :columns="columns"
                :list="list"
        >
        </table-btn>
    </div>
</template>
<script>
    import TableBtn from '@components/table/tableList-btn.vue'

    export default {
        props: {
            URLlist: {
                type: Array,
                default: []
            },
        },
        components: {
            TableBtn,
        },
        data() {
            return {
                list: [],
                columns: [  // 需要展示的列
                    {
                        prop: 'uri',
                        label: '请求资源',
                        align: 'left',
                        width: ''
                    }, {
                        prop: 'count',
                        label: '访问量',
                        align: 'left',
                        width: ''
                    }
                ]
            }
        },
        methods: {},
        watch: {
            URLlist: {
                handler: function (newval, oldVal) {
                    this.list = newval;
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss">

</style>
