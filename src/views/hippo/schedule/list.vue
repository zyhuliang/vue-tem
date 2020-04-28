<template>
    <section class="con-module" id="bm-hippo-schedule-list">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-hippo-schedule-list-timepicker"
                        v-model="dateValue"
                        type="daterange"
                        value-format="timestamp"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-hippo-schedule-list-input-searchTable" placeholder="请输入名称" v-model="searchInput"
                          @keyup.enter.native="searchKeyup" class="input-with-search">
                    <el-button id="bm-hippo-schedule-list-input-searchTable-btn" slot="append" @click="searchTable"
                               icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <div class="flowtype">
                    <h4>流程类型</h4>
                    <el-select id="bm-hippo-schedule-list-flowtype" v-model="flowType" placeholder="all"
                               @change="flowTypeValue">
                        <el-option
                                id="bm-hippo-schedule-list-flowtype-value"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-right">
                <el-button id="bm-hippo-schedule-list-create" type="info" @click="newTemplate"><i
                        class="icon iconfont icon-ir-add"></i>&nbsp;创建
                </el-button>
                <el-button id="bm-hippo-schedule-list-run" type="info" @click="runRow"
                           :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-start"></i>&nbsp;启用
                </el-button>
                <el-button id="bm-hippo-schedule-list-stop" type="info" @click="stopRow"
                           :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-operation"></i>&nbsp;停止
                </el-button>
                <el-button id="bm-hippo-schedule-list-del" type="info" @click="delTable"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除
                </el-button>
            </div>
        </el-row>
        <el-row>
        </el-row>
        <el-table
                id="bm-hippo-schedule-list-table"
                v-loading="loading"
                :data="table.content"
                tooltip-effect="dark"
                height=" calc(100vh - 220px)"
                style="width: 100%;"
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
                    <router-link class="detail" :to="{ path:'/hippo/schedule/detail/'+scope.row.id}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="启停状态"
                    sortable="custom"
                    width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled == 0">未启用</span>
                    <span v-else>正常</span>
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
                    prop="createTime"
                    label="创建时间"
                    sortable="custom"
                    width="200"
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
                    prop="creator"
                    label="创建人"
                    width="100"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="lastModifier"
                    label="修改人"
                    width="100"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="totalExecuted"
                    label="执行次数"
                    width="100"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="周期情况"
                    width="100"
                    sortable="custom"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.schedulerId == 'once'">一次性</span>
                    <span v-else>周期</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                id="bm-hippo-schedule-list-stop-page"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 16, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.totalElements">
        </el-pagination>
        <router-view></router-view>
    </section>
</template>
<script>
    import {scheduleList, enablePlan, disablePlan, delePlan} from '@api';
    import {createParameter} from '@components/function/queryParameter.js';
  
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
                // var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                // var parameter = this.buildParameters();
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                // var parameter = this.buildParameters()
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
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
                this.listTable(parameter);
            },
            //table list
            listTable: function listTable(parameter) {
                // GET /someUrl
                var parameter = this.buildParameters()
                scheduleList(parameter).then(data => {
                        this.loading = false
                        this.table = data;
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
            //flow类型选择
            flowTypeValue: function (val) {
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //查询
            searchTable: function () {
                this.currentPage = 1;
                this.pagesize = 8;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.currentPage = 1;
                this.pagesize = 8;
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //表格操作：删除
            delTable: function delTable() {
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
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个计划?', '提示', {}).then(() => {
                    delePlan(tbIds).then(data => {
                            var parameter = this.buildParameters()
                            tableRefresh.listTable(parameter);
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
            //表格操作：启用
            runRow: function runRow() {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }

                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });

                this.$confirm('真的要启用' + tbIds.length + '个计划?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    // 运行计划
                    enablePlan(tbIds).then(data => {
                            this.listTable(this.buildParameters());
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
            //表格操作：停止
            stopRow: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }

                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });

                this.$confirm('真的要停止' + tbIds.length + '个计划?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    // 运行计划
                    disablePlan(tbIds).then(data => {
                            this.listTable(this.buildParameters());
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
            //新建计划
            newTemplate: function () {
                this.$router.push({name: "创建计划"});
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
                if (column.column.label == '启停状态') {
                    this.field = 'enabled'
                }
                if (column.column.label == '周期情况') {
                    this.field = 'schedulerId'
                }
                this.currentPage = 1
                that.listTable();
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
            this.listTable(this.parameter);
        },
        watch: {
            '$route'(to, from) {
                if (to.path == "/hippo/schedule") {
                    var parameter = this.buildParameters()
                    this.listTable(parameter);
                }
            },
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

    .el-table {
        float: left;
        margin-top: 15px;
    }

    .detail-btn {
        padding: 0px;
    }

    .detail {
        margin-right: 10px;
    }
</style>