<template>
    <section class="con-module" id="bm-hippo-monitor-killed">
        <el-row class="btnClass">
            <div class="btnLeft">
                <el-input id="bm-hippo-monitor-killed-searchInput" placeholder="请输入名称" v-model="searchInput"
                          @keyup.enter.native="searchKeyup" class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        value-format="timestamp"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <div class="flowtype">
                    <h4>流程类型</h4>
                    <el-select id="bm-hippo-monitor-killed-flowType" v-model="flowType" placeholder="all"
                               @change="flowTypeValue">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value| cn"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="btn-right">
                <el-button id="bm-hippo-monitor-killed-del" type="info" @click="del"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
                <el-button id="bm-hippo-monitor-killed-refresh" type="info" @click="refresh"><i
                        class="icon iconfont icon-ir-operation"></i>刷新
                </el-button>
            </div>
        </el-row>
        <el-table
                id="bm-hippo-monitor-killed-table"
                :data="table.content"
                tooltip-effect="dark"
                height="calc(100vh - 220px)"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                @sort-change="getOrder"
                v-loading="loading">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    sortable="custom"
            >
                <template slot-scope="scope">
                    <router-link class="detail" target="_blank"
                                 :to="{  path:'/design/executingDetail/' + scope.row.flowId + '/exection/'+ scope.row.jobId +'/info',query:{type:scope.row.flowType}}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="流程"
                    prop="flowName"
                    sortable="custom"
                    align="center">
                <template slot-scope="scope">
                    <router-link class="usAdd" target="_blank"
                                 :to="{ path:'/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}">
                        {{scope.row.flowName}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="调度"
                    prop="flowSchedulerName"
                    sortable="custom"
                    align="center">
                <template slot-scope="scope">
                    <router-link class="usAdd" :to="{ path:'/hippo/schedule/detail/'+scope.row.flowSchedulerId}">
                        {{scope.row.flowSchedulerName}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="160"
                    sortable="custom"
                    align="center"
                    :formatter="dateFormat"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="lastModifiedTime"
                    label="最后修改时间"
                    width="160"
                    :formatter="dateFormat">
            </el-table-column>
            <el-table-column
                    prop="cost"
                    label="耗时(秒)"
                    width="100"
                    sortable="custom"
                    align="center"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.cost | changeToSecond}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop=""
                    label="进度"
                    width="65"
                    align="center"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag class="processedClass" :formatter="pTypeFilter(scope.row)" :type="scope.row.status.type">
                        {{scope.row.status.processed}}/{{scope.row.status.estimateTotal}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                id="bm-hippo-monitor-killed-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 16, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
        </el-pagination>
    </section>
</template>
<script>
    import {executeList, delExecute} from '@api'
    import {createParameter} from '@components/function/queryParameter.js';

    export default {
        data() {
            return {
                table: [],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime: false,
                searchInput: '',
                currentPage: 1,
                pagesize: 8,
                dateValue: '',
                startTime: false,
                endTime: false,
                searchInput: '',
                prop: 'lastModifiedTime',
                orderDirection: 'DESC',
                loading: true,
                flowType: "all",
                options: [{
                    value: 'all',
                    label: '全部类型'
                }, {
                    value: 'dataflow',
                    label: '批处理'
                }, {
                    value: 'workflow',
                    label: '工作流'
                }, {
                    value: 'streamflow',
                    label: '流处理'
                }],
            }
        },
        methods: {
            //flow类型选择
            flowTypeValue: function (val) {
                var parameter = this.buildParameters()
                this.getTableList(parameter);
            },
            //查询
            searchTable: function () {
                var parameter = this.buildParameters();
                this.getTableList(parameter);
            },
            //键盘回车事件
            searchKeyup: function () {
                this.searchTable();
            },
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var parameter = this.buildParameters();
                this.getTableList(parameter);
            },
            // table列表查询
            getTableList: function () {
                this.loading = true
                var parameter = this.buildParameters();
                executeList(parameter).then(data => {
                        this.loading = false
                        this.table = data
                    }, err => {
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    }
                )
                this.$parent.getStatusCount()
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                var parameter = this.buildParameters();
                this.getTableList(parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.getTableList(parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var parameter = this.buildParameters();
                this.getTableList(parameter);
            },
            //过滤列表进度
            pTypeFilter: function (row) {
                if (row.status.type == "SUCCEEDED") {
                    return row.status.type = "success";
                } else if (row.status.type == "KILLED") {
                    return row.status.type = "warning";
                } else if (row.status.type == "FAILED") {
                    return row.status.type = "danger";
                }
            },
            //删除
            del: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个执行计划?', '提示', {}).then(() => {
                    delExecute(tbIds).then(data => {
                            tableRefresh.getTableList();
                            tableRefresh.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });
                        }, err => {
                            var _this = this;
                            if (err.response.status == 500) {
                                _this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    )
                }).catch(() => {

                });
            },
            // 刷新
            refresh: function () {
                this.getTableList();
            },
            buildParameters: function () {
                var limit = this.pagesize;
                var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var field = this.prop;
                var orderDirection = this.orderDirection;
                var parameter = createParameter('statusType', 'KILLED', 'EQUAL').Limit(limit).Offset(offset).Sort(field, orderDirection).Build();
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(parameter);
                }
                if (this.flowType != "all") {
                    parameter = createParameter('flowType', this.flowType, 'EQUAL').Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue.length == 0) {

                    } else {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                return parameter;
            },
            //列表排序
            getOrder: function (column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                this.getTableList()
            }
        },
        mounted() {
            this.getTableList();
            //每隔2000ms执行一次进度条查询请求
            this.processTrigger = setInterval(this.getTableList, 30000);
        },
        beforeDestroy() {
            //切换页面时停止定时更新任务
            clearInterval(this.processTrigger);
        },
    }
</script>
<style scoped>
    .el-table td, .el-table th {
        padding-right: 10px;
    }

    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .el-table {
        float: left;
        margin-top: 10px;
    }

    .detail-btn {
        padding: 0px;
    }

    .detail {
        margin-right: 10px;
    }
</style>
<style lang="scss" scoped>
    .flowtype {
        float: left;
        width: 260px;
        height: 34px;
        line-height: 34px;
        margin-top: 5px;
        h4 {
            margin: 0px;
            float: left;
        }
        .el-select {
            float: left;
            width: 180px;
            margin-left: 10px;
        }
    }
</style>