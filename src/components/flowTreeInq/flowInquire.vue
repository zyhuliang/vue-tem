<template>
    <div class="dt-content" id="ch-components-dataSourceInq-dataSourceInquire-temp" v-loading="loading">
        <!--引入查询组件-->
        <div class="dtTableUp">
            <search-date-data name="ch-components-dataSourceInq-dataSourceInquire-search-date-data" ref="refSearchDate"
                              @searchDate="searchListTable" :pagesize="pagesize"
                              :searchInput="searchInput"></search-date-data>
            <search-table-data name="ch-components-dataSourceInq-dataSourceInquire-search-table-data"
                               ref="refSearchTable" @searchKey="searchListTable" :pagesize="pagesize"
                               :startTime="startTime" :endTime="endTime"></search-table-data>
        </div>
        <!--左侧树结构-->
        <div class="dtTableLeft" id="ch-components-dataSourceInq-dataSourceInquire-tree">
            <data-tree ref="dataTree" @transferNavId="listTable"></data-tree>
        </div>
        <div class="dtTableRight">
            <el-table
                    id='bm-com-flow-inq-table'
                    :data="table.content"
                    tooltip-effect="dark"
                    modal-append-to-body
                    style="width: 100%;"
                    height="calc(100% - 60px)"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifiedTime"
                        label="修改时间"
                        width="180"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 16, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.totalElements">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    //引入查询组件
    import searchDateData from '../collectorSearch/searchDateData.vue'
    import searchTableData from '../collectorSearch/searchTableData.vue'

    //导入树组件
    import dataTree from './flowInqTree.vue'
    import daInCom from './flowTreeInq.js'
    //api接口
    import {designTableList} from '@api'
    import {createParameter} from '@function/queryParameter.js';

    export default {
        components: {
            dataTree,
            searchDateData,
            searchTableData,
        },
        data() {
            return {
                table: [],
                multipleSelection: [],
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                selectedNode: {},
                loading: false,
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.listTable(this.parameter, this.resType)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput)
                this.listTable(this.parameter, this.resType)
            },
            //选中某条数据
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;

                if (val.length === 1) {
                    this.$emit('thisSelectFlowVal', val[0]);
                } else if (val.length != 0) {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    this.$refs.multipleTable.toggleRowSelection(val[0]);
                    return false;
                }
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                this.currentPage = 1
                if (pagesize) this.pagesize = pagesize;
                this.startTime = startTime;
                this.endTime = endTime;
                if (searchInput != undefined) this.searchInput = searchInput;
                this.listTable(parameter)
            },
            //table list
            listTable: function listTable(parameter, node) {
                this.selectedNode = node ? node : this.selectedNode
                parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                parameter = this.selectedNode.id ? createParameter('parentId', this.selectedNode.id, 'EQUAL').Build(parameter) : parameter

                //发送的请求flow的query列表
                if (this.selectedNode.id) {
                    this.loading = true;
                    designTableList(parameter).then(data => {
                        this.loading = false;
                        this.table = data;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
        },
        beforeRouteLeave: function (to, from, next) {
            daInCom.$off();
            next();
        },
        mounted() {
            // 用$on事件来接收参数
            daInCom.$on('getNode', (data) => {
                //清除table和date的查询条件
                this.startTime = ''
                this.endTime = ''
                this.searchInput = ''
                this.currentPage = 1
                this.pagesize = 8
                this.selectedNode = data;
                if (!data.id) {
                    this.table = [];
                } else {
                    let parameter = ''//不传parameter这个参数
                    this.listTable(parameter, data);
                }
                if (this.$refs.refSearchDate)
                    this.$refs.refSearchDate.initParameter()
                if (this.$refs.refSearchTable)
                    this.$refs.refSearchTable.initParameter()
            })
        }
    }

</script>

<style lang="scss" scoped>

    .dt-content {
        float: left;
        width: 100%;
        height: 80%;

        .dtTableUp {
            float: left;
            width: 100%;
            margin: 0px 0px 10px 0px;
        }

        .dtTableLeft {
            float: left;
            width: 20%;
            height: calc(100% - 60px);
            border: 1px solid #eeeeee;
            background-color: #f2f3f9;
        }

        .dtTableRight {
            float: left;
            width: 79%;
            height: 100%;
            overflow: auto;
            background-color: #ffffff;
        }
    }
</style>