<template>
    <section class="con-module" id="bm-hippo-alarm">
        <el-row class="btnClass">
            <div class="btn-left" id="bm-hippo-alarm-btn-left">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="timestamp"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input placeholder="请输入名称" v-model="searchInput" @keyup.enter.native="searchKeyup"
                          class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <div class="alarm-statusType">
                    <h4>处理状态</h4>
                    <el-select v-model="statusType" placeholder="all" @change="statusTypeSelectionChange">
                        <el-option
                                v-for="item in statueType_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="alarm-statusType">
                    <h4>告警类型</h4>
                    <el-select v-model="alarmType" placeholder="all" @change="alarmTypeSelectionChange">
                        <el-option
                                v-for="item in alarmType_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-right">
                <el-button id="bm-hippo-alarm-ignore" type="info" @click="ingoreTable"
                           :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-integration"></i>忽略
                </el-button>
                <el-button id="bm-hippo-alarm-del" type="info" @click="delTable"
                           :disabled="multipleSelection.length < 1"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
            </div>
        </el-row>
        <router-view></router-view>
        <el-table
                id="bm-hippo-alarm-table"
                :data="table.content"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                @sort-change="getOrder"
                style="width: 100%;margin-top: 50px" max-height="700">
            <el-table-column
                    type="selection"
                    :selectable="setSelection"
                    width="45">
            </el-table-column>
            <el-table-column
                    label="名称"
                    sortable="custom"
                    prop="name">
                <template slot-scope="scope">
                    <span style="color: #3e98fe">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="id"
                    sortable="custom"
                    label="主键">
            </el-table-column>
            <el-table-column
                    prop="alarmRule.name"
                    label="触发规则"
                    width="120"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="conditions"
                    label="触发条件"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    sortable="custom"
                    :formatter="dateFormat"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="alarmRule.principal"
                    label="负责人"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="告警等级"
                    sortable="custom"
                    width="100px">
                <template slot-scope="scope">
                    <span class="warning-bg" v-show="scope.row.type == 'warning'">警&nbsp;&nbsp;告</span>
                    <span class="serious-bg" v-show="scope.row.type == 'serious'">严&nbsp;&nbsp;重</span>
                    <span class="deadly-bg" v-show="scope.row.type == 'deadly'">致&nbsp;&nbsp;命</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="处理状态"
                    sortable="custom"
                    width="100px">
                <template slot-scope="scope">
                    <span style="color: red" v-show="scope.row.status == 'unsolved'">unsolved</span>
                    <span style="color: green" v-show="scope.row.status == 'solved'">solved</span>
                    <span style="color: #AABF0A" v-show="scope.row.status == 'ignore'">ignore</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                id="bm-hippo-alarm-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 16, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.totalElements">
        </el-pagination>
    </section>
</template>
<script>
    import {getAlarmList, delAlarmList, ingoreAlarmList} from '@api';

    import {queryObject, createParameter} from '@components/function/queryParameter.js';

    var parameter = queryObject();
    export default {
        data() {
            return {
                alarmType_options: [{
                    value: 'all',
                    label: '所有'
                }, {
                    value: 'warning',
                    label: '警告'
                }, {
                    value: 'serious',
                    label: '严重'
                }, {
                    value: 'deadly',
                    label: '致命'
                }],
                statueType_options: [{
                    value: 'unsolved',
                    label: '未处理'
                }, {
                    value: 'solved',
                    label: '已处理'
                }, {
                    value: 'ignore',
                    label: '已忽略'
                }, {
                    value: 'all',
                    label: '所有'
                }],
                statusType: 'unsolved',
                alarmType: 'all',
                table: [],
                dateValue: '',
                currentPage: 1,
                pagesize: 8,
                multipleSelection: [],
                searchInput: '',
                isActive: false,
                startTime: false,
                endTime: false,
                orderDirection: 'DESC',
                field: 'lastModifiedTime'
            }
        },
        methods: {
            //查看resourceMan
            handleEdit: function (id, index, row) {

                this.$router.push({name: 'DBSource', params: {parentId: 'hippo', id: row.dataSourceId}});

            },
            handledateValue: function (val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            alarmTypeSelectionChange: function alarmTypeSelectionChange(val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            statusTypeSelectionChange: function statusTypeSelectionChange(val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            // table list
            listTable: function listTable(parameter) {
                var parameter = this.buildParameters()
                getAlarmList(parameter).then(data => {
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
            //查询
            searchTable: function searchTable() {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.searchTable();
            },
            buildParameters: function () {
                var limit = this.pagesize;
                var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(parameter);
                }
                if (this.alarmType != 'all') {
                    parameter = createParameter('type', this.alarmType, 'EQUAL').Build(parameter);
                }
                if (this.statusType != 'all') {
                    parameter = createParameter('status', this.statusType, 'EQUAL').Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue.length == 0) {

                    } else {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                parameter.sortObject.field = this.field
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            setSelection(row, index) {
                if (row.owner === 'root') {
                    return false
                } else {
                    return true
                }
            },
            //表格操作：删除
            delTable: function delTable() {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }

                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要删除' + tbIds.length + '条警告?', '提示', {}).then(() => {
                    delAlarmList(tbIds).then(data => {
                            var parameter = that.buildParameters();
                            that.listTable(parameter);
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
                }).catch(() => {

                });
            },
            //表格操作：忽略
            ingoreTable: function ingoreTable() {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要忽略' + tbIds.length + '条告警?', '提示', {}).then(() => {
                    ingoreAlarmList(tbIds).then(data => {
                            var parameter = that.buildParameters();
                            that.listTable(parameter);
                            that.$message({
                                message: '恭喜你，忽略已成功！',
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
                if (column.column.label == '触发规则' || column.column.label == '负责人') {
                    this.field = 'alarmRule'
                }
                this.currentPage = 1
                that.listTable();
            },
        },
        mounted() {
            parameter = createParameter('status', this.statusType, 'EQUAL').Build();
            this.listTable(parameter)
        },
    };

</script>

<style lang="scss" scoped>
    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .con-module .canvas {
        width: 100%;
        height: 500px;
        margin: 50px auto;
        background-color: white;
        border: 1px solid #dcdfe6;
    }

    .user-container {
        margin: 20px;

        .detail-btn {
            padding: 0px;
        }

        .el-row {

            .el-button i {
                font-size: 13px;
            }

        }
        .el-table {
            margin-top: 20px;
            float: left;
        }

    }

    .alarm-statusType {
        float: left;
        width: 260px;
        height: 34px;
        line-height: 34px;
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

    .warning-bg {
        background-color: #29AAE3;
        color: white;
        padding: 10px 5px
    }

    .serious-bg {
        background-color: #FFE42A;
        color: white;
        padding: 10px 5px
    }

    .deadly-bg {
        background-color: #C1232B;
        color: white;
        padding: 10px 5px
    }

</style>
