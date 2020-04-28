<template>
    <section class="con-module" id="bm-hippo-execute">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-hippo-execute-timepicker"
                        v-model="dateValue"
                        type="daterange"
                        value-format="timestamp"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-hippo-execute-searchInput" placeholder="请输入名称" v-model="searchInput"
                          @keyup.enter.native="searchKeyup" class="input-with-search">
                    <el-button id="bm-hippo-execute-searchInput-btn" slot="append" @click="searchTable"
                               icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <div class="flowtype">
                    <h4>流程类型</h4>
                    <el-select id="bm-hippo-execute-flowType" v-model="flowType" placeholder="all"
                               @change="flowTypeValue">
                        <el-option
                                id="bm-hippo-execute-flowType-value"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value| cn"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-right">
                <el-button id="bm-hippo-execute-stop" type="info" @click="stop"
                           :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-start"></i>&nbsp;停止
                </el-button>
                <el-button id="bm-hippo-execute-rerun" type="info" @click="reStart"
                           :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-operation"></i>&nbsp;重启
                </el-button>
                <el-button id="bm-hippo-execute-del" type="info" @click="del" :disabled="multipleSelection.length == 0">
                    <i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除
                </el-button>
            </div>
        </el-row>
        <el-table
                id="bm-hippo-execute-table"
                :data="table.content"
                v-loading="loading"
                tooltip-effect="dark"
                height=" calc(100vh - 220px)"
                style="width: 100%  max-height: calc(100vh - 400px); overflow-y: auto;"
                @selection-change="handleSelectionChange"
                @sort-change="getOrder">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="name"
                    sortable="custom"
                    label="名称">
                <template slot-scope="scope">
                    <router-link class="usAdd" :to="{ path:'/design/executingDetail/'+scope.row.flowId + '/info'}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="流程"
                    sortable="custom"
                    prop="flowName">
                <template slot-scope="scope">
                    <router-link class="usAdd"
                                 :to="{ path:'/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}">
                        {{scope.row.flowName}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="调度"
                    sortable="custom"
                    prop="flowSchedulerName">
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
                    :formatter="dateFormat"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="lastModifiedTime"
                    label="修改时间"
                    width="200"
                    sortable="custom"
                    :formatter="dateFormat"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop=""
                    label="进度"
                    width="80"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag class="processedClass" :formatter="pTypeFilter(scope.row)" :type="scope.row.status.type">
                        {{scope.row.status.processed}}/{{scope.row.status.estimateTotal}}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                id="bm-hippo-execute-pagination"
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
    import {executeList, stopExecute, delExecute, rerunExecute} from '@api';
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    var parameter = queryObject();
    export default {
        data() {
            return {
                table: [],
                multipleSelection: [],
                dialogFormVisible: false,
                dateValue: '',
                startTime: false,
                endTime: false,
                searchInput: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
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
                flowType: "all",
                loading: true,
                orderDirection: 'DESC',
                field: 'lastModifiedTime',
                parameter: ""
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getList(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getList(this.parameter)
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
                this.getList(parameter);
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
            //flow类型选择
            flowTypeValue: function (val) {
                var parameter = this.buildParameters();
                this.getList(parameter);
            },
            //查询
            searchTable: function () {
                this.currentPage = 1;
                this.pagesize = 8;
                var parameter = this.buildParameters();
                this.getList(parameter);
            },
            searchKeyup: function () {
                this.currentPage = 1;
                this.pagesize = 8;
                var parameter = this.buildParameters();
                this.getList(parameter);
            },
            // 获取列表
            getList: function (parameter) {
                var parameter = this.buildParameters()
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
                })
            },
            // 停止按钮
            stop: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tdIds = []
                this.multipleSelection.forEach(function (i) {
                    tdIds.push(i.id);
                });
                stopExecute(tdIds).then(data => {
                    that.getList(parameter);
                    that.$message({
                        message: '恭喜你，停止已成功！',
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
                })
            },
            // 重启
            reStart: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tdIds = [];
                this.multipleSelection.forEach(function (i) {
                    tdIds.push(i.id);
                });
                rerunExecute(tdIds).then(data => {
                        that.getList(parameter);
                        that.$message({
                            message: '恭喜你，重启已成功！',
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
            },
            // 删除
            del: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                this.multipleSelection.forEach(function (i) {
                    var tdIds = [i.id];
                    delExecute(tdIds).then(data => {
                            var parameter = that.buildParameters()
                            that.getList(parameter);
                            that.$message({
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
                });
            },
            buildParameters: function () {
                var limit = this.pagesize;
                var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue.length == 0) {

                    } else {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                if (this.flowType != "all") {
                    parameter = createParameter('flowType', this.flowType, 'EQUAL').Build(parameter);
                }
                parameter.sortObject.field = this.field
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter
            },
            //列表排序
            getOrder: function (column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.field = column.prop
                if (column.prop === null) {
                    this.field = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                that.getList();
            },
        },
        mounted() {

            if (JSON.parse(localStorage.getItem("parameter"))) {
                this.parameter = JSON.parse(localStorage.getItem("parameter"));
                this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                this.pagesize = this.parameter.limit;

            } else {
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
            this.getList(this.parameter);
        },
        watch: {
            parameter() {
                localStorage.setItem("parameter", JSON.stringify(this.parameter));
            }
        }
    };

</script>

<style lang="scss" scoped>
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
        margin-top: 15px;
    }

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

    .detail-btn {
        padding: 0px;
    }

    .detail {
        margin-right: 10px;
    }
</style>