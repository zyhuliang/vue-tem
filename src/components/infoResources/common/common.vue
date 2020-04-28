<template>
    <div id="infoFlow">
        <info-dialog
            :title="title"
            width="80%"
            :isShowDialog="isShowDialog"
            @closeDialog="closeDialog"
            @confirmDialog="confirmDialog"
        >
            <info-from
                :config="config"
                :modelData="parameter"
            />
             <el-container>
                <el-aside
                    width="220px"
                    v-if="isShowTree"
                >
                    <el-scrollbar style="height: 386px">
                        <slot />
                    </el-scrollbar>
                </el-aside>
                <el-main>
                     <table-btn
                    :columns="columns"
                    :list="list"
                    :operates="operates"
                    :options="tableOption"
                    @handleCurrentChange="handleCurrentChange"
                />
                    <pagination
                        :totalNumber="totalNumber"
                        @changeTableData="changeTableData"
                    />
                </el-main>
            </el-container>
        </info-dialog>
    </div>
</template>
<script>
import tableBtn from '@components/table/tableList-btn'
import Pagination from '@components/pagination/pagination'
import infoDialog from '@components/infoDialog/dialog'
import Panel from '@components/layout/panel'
import infoFrom from '@components/infoFrom/infoFrom'
import { createParameter } from '@components/function/queryParameter';

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        columns: {
            type: Array,
            default: () => []
        },
        interface: {
            type: String,
            default: ''
        },
        operates: {
            type: Object,
            default: () => {}
        },
        currentData: {
            type: Object,
            default: () => {}
        },
        isShowTree: {
            type: Boolean,
            default: true
        }
    },
    components: {
        infoDialog,
        tableBtn,
        Pagination,
        infoFrom,
        Panel
    },
    data () {
        return {
            config: {},
            currentRow: null,
            parameter: {
                limit: 8,
                offset: 0,
                searchInput: '',
                startTime: '',
                endTime: '',
                id: '',
                owner: ''
            }, // 分页请求数据
            isShowDialog: false,
            tableOption: { // 列表配置
                height: '389px',
                chooseOne: true,
                loading: false
            },
            totalNumber: 0, // 分页数据
            list: [], // table 数据
        }
    },
    watch: {
        'currentData': {
            handler: function (newData, oldData) { // 可以获取新值与老值两个参数
                if (newData.id !== oldData.id) {
                    this.parameter.id = newData.id
                    this.parameter.owner = newData.owner
                    // 请求 table 数据
                    this.queryTableData()
                }
            },
            deep: true // 开启深度监听
        }
    },
    created () {
        this.config = {
            ref: 'ruleForm',
            size: 'small',
            lableWidth: '80px',
            inline: true,
            rule: [{
                label: '',
                type: 'infoInput',
                model: 'searchInput',
                methods: (val) => {
                    this.parameter.searchInput = val
                },
                button: {
                    show: true,
                    slot: 'append',
                    icon: 'el-icon-search',
                    methods: () => {
                        // 请求 table 数据
                        this.queryTableData()
                      
                    }
                }
            },{ 
                type: 'infoDatePicker',
                label: '',
                model: 'date',
                methods: (val) => {
                    this.parameter.startTime = val[0]
                    this.parameter.endTime = val[1]
                    // 请求 table 数据
                    this.queryTableData()
                }
            }]
        }
        // 有树的时候默认不执行
        if (!this.isShowTree) {
            this.queryTableData()
        }
    },
    methods: {
        // 请求列表数据
        async queryTableData () {
            this.tableOption.loading = true
            // 只有在这个地方处理参数
            let parameter = createParameter().Limit(this.parameter.limit).Offset(this.parameter.offset).Build()
            // 创建 搜索条件
            if (this.parameter.searchInput) {
                parameter = createParameter('name', `%${this.parameter.searchInput}%`, "LIKE").Build(parameter)
            }
            // 有树 tree 的时候执行
            if (this.isShowTree) {
                //将owner的equal换成like
                parameter = createParameter('parentId', this.parameter.id, 'EQUAL').Build(parameter)
            }
            let  templateData = await this.$https[this.interface](parameter)
            // 赋值 table 数据
            this.list = templateData.content
            this.totalNumber = templateData.totalElements
            this.tableOption.loading = false
        },
        // 取消
        closeDialog () {
            this.isShowDialog = false
            this.currentRow = null
        },
        // 确定
        confirmDialog () {
            if (!this.currentRow) {
                this.$message.error('请选择一条数据！');
                return false
            }
            this.$emit('handleCurrentChange', this.currentRow)
            this.isShowDialog = false
        },
         // 分页请求数据的回调
        changeTableData (data) {
            this.parameter.offset = data.offset
            this.parameter.limit = data.limit
            this.queryTableData()
        },
        // 单选
        handleCurrentChange (data) {
            this.currentRow = data
        },
        showDialog () {
            this.isShowDialog = true
        }
    }
}
</script>
<style lang="scss" scoped>
#infoFlow{
    .el-aside{
        margin-right: 24px;
    }
    .el-main {
        z-index: 1021;
        color: #333;
        padding: 0;
    }
}
</style>
