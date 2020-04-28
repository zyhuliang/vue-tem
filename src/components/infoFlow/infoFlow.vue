<template>
    <div id="infoFlow">
        <common 
            title="流程查询"
            :columns="columns"
            interface="queryFlow"
            :isShowTree="false"
            @handleCurrentChange="handleCurrentChange"
            ref="common"
        >
        </common>
    </div>
</template>
<script>
import common from '@components/infoResources/common/common'
import moment from "moment"//时间格式化

export default {
    components: {
        common
    },
    data () {
        return {
            columns: [ // 需要展示的列
                {
                    prop: 'name',
                    label: '名称',
                    align: 'left',
                }, {
                    prop: 'lastModifiedTime',
                    label: '修改时间',
                    formatter: (row, column) => {
                        return moment(row.lastModifiedTime).format("YYYY-MM-DD HH:mm:ss");
                    }
                }
            ],
        }
    },
    methods: {
        showDialog () {
            this.$refs.common.showDialog()
        },
         handleCurrentChange (data) {
            this.$emit('handleCurrentChange', data)
        }
    }
}
</script>
<style lang="scss" scoped>
#infoFlow{

}
</style>
