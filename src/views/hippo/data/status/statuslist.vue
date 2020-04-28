<template>
    <section class="con-module" id="bm-hippo-data-statuslist">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-hippo-data-statuslist-timepicker"
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="timestamp"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-hippo-data-statuslist-searchInput" placeholder="请输入数据源名称" v-model="searchInput"
                          @keyup.enter.native="searchKeyup"
                          class="input-with-search">
                    <el-button id="bm-hippo-data-statuslist-searchInput-btn" slot="append" @click="searchTable"
                               icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <div class="status-Type">
                    <h4>链接状态</h4>
                    <el-select id="bm-hippo-data-statuslist-statusType" v-model="statusType" placeholder="all"
                               @change="statusTypeSelectionChange">
                        <el-option
                                id="bm-hippo-data-statuslist-statusType-value"
                                v-for="item in statueType_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-right">
                <el-button id="bm-hippo-data-statuslist-del" type="info" @click="delTable"
                           :disabled="multipleSelection.length < 1"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
                <router-link :to="dataDrawUrl">
                    <el-button id="bm-hippo-data-statuslist-return" type="info"><i class="el-icon-back"></i>返回
                    </el-button>
                </router-link>
            </div>
        </el-row>
        <router-view></router-view>
        <el-table
                id="bm-hippo-data-statuslist-table"
                :data="table.content"
                tooltip-effect="dark"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                @sort-change="getOrder"
                style="width: 100%;margin-top: 50px" height="calc(100vh - 330px)">
            <el-table-column
                    type="selection"
                    :selectable="setSelection"
                    width="45">
            </el-table-column>
            <el-table-column
                    label="数据源"
                    sortable="custom"
                    prop="content.name">
                <template slot-scope="scope">
                    <router-link class="usAdd"
                                 :to="{ name: 'DBSource', params: {parentId:'hippo',id: scope.row.dataSourceId}}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dataSourceId"
                    sortable="custom"
                    label="数据源Id">
            </el-table-column>
            <el-table-column
                    prop="creator"
                    label="owner"
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
                    prop="status"
                    width="150"
                    sortable="custom"
                    label="连接状态">
                <template slot-scope="scope">
                    <span class="red-bg" v-show="scope.row.status == 'FAILED'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAILED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span class="green-bg" v-show="scope.row.status != 'FAILED'">SUCCEEDED</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                id="bm-hippo-data-statuslist-pagination"
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
    import {getDataStatusList, delDataStatusList} from '@api';
    import {queryObject, createParameter} from '@components/function/queryParameter.js';

    var parameter = queryObject();
    export default {
        data() {
            return {
                dataDrawUrl: "/hippo/data/status",
                statueType_options: [{
                    value: 'all',
                    label: 'all'
                }, {
                    value: 'FAILED',
                    label: 'FAILED'
                }, {
                    value: 'SUCCEEDED',
                    label: 'SUCCEEDED'
                }],
                statusType: 'all',
                table: [],
                dateValue: '',
                currentPage: 1,
                pagesize: 8,
                multipleSelection: [],
                searchInput: '',
                isActive: false,
                startTime: false,
                endTime: false,
                loading: true,
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
            statusTypeSelectionChange: function statusTypeSelectionChange(val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // table list
            listTable: function listTable(parameter) {
                getDataStatusList(parameter).then(data => {
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
                })
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
                if (this.statusType != 'all') {
                    parameter = createParameter('status', this.statusType, 'EQUAL').Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue != '' && this.dateValue.length != 0) {
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
                this.multipleSelection.forEach(function (i) {
                    var tdIds = [i.id];
                    delDataStatusList(tdIds).then(data => {
                        var parameter = that.buildParameters()
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
                    })
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
                if (column.column.label == '数据源') {
                    this.field = 'name'
                }
                this.currentPage = 1
                // var parameter = createParameter().Limit(this.pagesize).Sort(that.field,that.orderDirection).Build();
                var parameter = this.buildParameters();
                that.listTable(parameter, this.resType);
            },
        },
        mounted() {
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

        .el-table {
            margin-top: 20px;
            float: left;
        }

    }

    .red-bg {
        background-color: red;
        color: white;
        padding: 10px 5px
    }

    .green-bg {
        background-color: green;
        color: white;
        padding: 10px 5px
    }

    .status-Type {
        line-height: 45px;
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
