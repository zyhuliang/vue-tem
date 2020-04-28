<template>
    <div id="infoDataset">
        <common 
            title="数据集查询"
            :columns="columns"
            :operates="operates"
            :currentData="currentData"
            @handleCurrentChange="handleCurrentChange"
            interface="queryDataset"
            ref="common"
        >
            <info-tree
                :data-tree="dataTree"
                interface-method="queryResource"
            />
        </common>
        <!-- 预览数据集 -->
        <previewDataset ref="previewDataset"/>
    </div>
</template>
<script>
import infoTree from '@components/infoTree/tree'
import common from '@components/infoResources/common/common'
import previewDataset from '@components/infoResources/previewDataset'
import moment from "moment"//时间格式化

export default {
    components: {
        common,
        infoTree,
        previewDataset
    },
    provide () {
        return {
            current: (data) => {
                this.currentData = data
            }
        }
    },
    data () {
        return {
            currentData: {}, // 选中的tree 节点数据
            dataTree: [], // tree 数据
            columns: [ // 需要展示的列
                {
                    prop: 'name',
                    label: '名称',
                    width: '300'
                }, {
                    prop: 'storage',
                    label: '类型'
                },{
                    prop: 'tenant.name',
                    label: '租户',
                    formatter: (row, column) => {
                        return row.tenant.name;
                    }
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: (row, column) => {
                        return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
                    }
                },{
                    prop: 'lastModifiedTime',
                    label: '修改时间',
                    formatter: (row, column) => {
                        return moment(row.lastModifiedTime).format("YYYY-MM-DD HH:mm:ss")
                    }
                },{
                    prop: 'expiredPeriod',
                    label: '过期时间',
                    formatter: (row, column) => {
                        let expiredPeriod = row.expiredPeriod
                        if (expiredPeriod === 0 || expiredPeriod> 200000000000) {
                            return '永不过期'
                        }
                        return moment(row.createTime + (expiredPeriod * 1000)).format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            ],
            operates: { // 操作按钮组,可以配置各个选项来控制按钮的隐藏、是否可点击、
                width: 100,
                fixed: 'right',
                list: [{
                    label: '预览',
                    type: 'text',
                    method: (index, row) => {
                        this.$refs.previewDataset.previewinit(row)
                    }
                }]
            }
        }
    },
    async created () {
        // 默认加载 tree 加载完之后 去下标为 0 的数据 给子组件 也会发送请求
        var parameter = '?allUser=true&excludes=$Workflow%3B$Dataflow%3B$Streamflow&includes=dataset_dir&strict=true'
        this.serverApi({
        params: parameter,
        interface: 'queryRoots',
        success: (data) => {
            this.dataTree = data
            this.currentData = this.dataTree[0]
        }
      })
        
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
#infoDataset{
    
}
</style>
