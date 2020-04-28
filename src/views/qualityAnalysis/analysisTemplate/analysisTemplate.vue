<template>
    <div class="analysisTemplate">
        <!-- 操作区域 -->
        <operationPanel>
            <div
                slot="left"
            >
                <dropdown/>
                <info-from
                    :config="config"
                    :modelData="parameter"
                />
            </div>
            <div
                slot="right"
                class="operationListBtn"
            >
                <el-button
                    type="text"
                    icon="el-icon-plus"
                    @click="add"
                >
                    新建
                </el-button>
                <el-button
                    type="text"
                    icon="el-icon-thumb"
                >
                    运行
                </el-button>
                <el-button
                    type="text"
                    icon="el-icon-bangzhu"
                    @click="createFlow"
                >
                    周期
                </el-button>
                <router-link to="/role">
                <el-button
                    type="text"
                    icon="el-icon-delete"
                >
                    删除
                </el-button>
                </router-link>
            </div>
        </operationPanel>
        <div class="list">
            <table-btn
                :columns="columns"
                :list="list"
                :options="tableOption"
                @handleSelectionChange="handleSelectionChange"
            />
        </div>
        <panel title="100">
            <pagination
                :totalNumber="totalNumber"
                @changeTableData="changeTableData"
            />
        </panel>
    </div>    
</template>
<script>
import operationPanel from '@components/layout/operationPanel'
import infoFrom from '@components/infoFrom/infoFrom'
import tableBtn from '@components/table/tableList-btn'
import Pagination from '@components/pagination/pagination'
import Panel from '@components/layout/panel'
import Dropdown from '../common/common'
import { createParameter } from '@components/function/queryParameter';
import moment from "moment"//时间格式化

export default {
    components: {
        operationPanel,
        infoFrom,
        tableBtn,
        Pagination,
        Panel,
        Dropdown
    },
    data () {
        return {
            config: {}, // 表单配置
            tableOption: { // 列表配置
                mutiSelect: true,
                height: 'calc(100vh - 210px)'
            },
            parameter: {
                limit: 8,
                offset: 0,
                searchInput: '',
                startTime: '',
                endTime: ''
            }, // 分页请求数据
            totalNumber: 0, // 分页数据
            list: [], // table 数据
            columns: [ // 需要展示的列
                {
                    prop: 'name',
                    label: '分析模板',
                    align: 'left',
                    width: 250,
                    formatter: (row, column) => {
                        return `<span class="blueFont">${row.name}</span>`
                    },
                    method: (row, column) => {
                        this.edit(row, column)
                    }
                }, {
                    prop: '规则',
                    label: '规则',
                    formatter: (row, column) => {
                        return `<span class="blueFont">编辑规则</span>`
                    },
                    method: (row, column) => {
                        this.editorialRules(row, column)
                    }
                }, {
                    prop: '规则',
                    label: '相关任务',
                    formatter: (row, column) => {
                        return `<span class="blueFont">任务</span>`
                    },
                    method: (row, column) => {
                        this.task(row, column)
                    }
                }, {
                    prop: 'processDataId',
                    label: '数据集',
                }, {
                    prop: 'preProcessFlowName',
                    label: '预处理流程',
                }, {
                    prop: 'creator',
                    label: '创建人',
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
        // 请求 table 数据
        this.queryTableData()
    },
    methods: {
        edit (row, column) {
            this.$router.push({ name: "template", params: {id: row.id}});
        },
        // 编辑规则
        editorialRules (row, column) {

        },
        // 任务
        task () {

        },
        // 多选回调
        handleSelectionChange () {
        },
        // 分页请求数据的回调
        changeTableData (data) {
            this.parameter = data
            this.queryTableData()
        },
        // 请求 table 列表
        async queryTableData () {
            // 只有在这个地方处理参数
            let parameter = createParameter().Limit(this.parameter.limit).Offset(this.parameter.offset).Build()
            // 创建 搜索条件
            if (this.parameter.searchInput) {
                parameter = createParameter('name', `%${this.parameter.searchInput}%`, "LIKE").Build(parameter)
            }
            // 创建 日期条件
            if (this.parameter.endTime && this.parameter.endTime) {
                parameter = createParameter('lastModifiedTime', this.parameter.startTime, 'GREATER_THAN').
                And('lastModifiedTime', this.parameter.endTime, 'LESS_THAN').
                Build(parameter);
            }

            let  templateData = await this.$https.zmodQuery(parameter)
            // 赋值 table 数据
            this.list = templateData.content
            this.totalNumber = templateData.totalElements
        },
        add () {
            this.$router.push({ name: "template", params: {id: 'new'}});
        },
        createFlow () {
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .analysisTemplate{
        .list{
            height: 100%;
            width: 100%;
        }
        .el-dropdown{
            margin: 0 20px;
        }
    }
</style>
