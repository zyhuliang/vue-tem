<template>
    <section class="con-module" id="bm-hippo-alarm-rule">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-hippo-alarm-rule-time"
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="timestamp"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-hippo-alarm-rule-serach" placeholder="请输入名称" v-model="searchInput"
                          @keyup.enter.native="searchKeyup"
                          class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <div class="alarm-statusType">
                    <h4>告警类型</h4>
                    <el-select id="bm-hippo-alarm-rule-alarmType" v-model="alarmType" placeholder="all"
                               @change="alarmTypeSelectionChange">
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
                <el-button type="info" id="bm-hippo-alarm-rule-create-btn" @click="ingoreTable"><i
                        class="icon iconfont icon-ir-add"></i>创建
                </el-button>
                <el-button type="info" id="bm-hippo-alarm-rule-del-btn" @click="delTable"
                           :disabled="multipleSelection.length < 1"><i
                        class="icon iconfont icon-ir-directory-delete"></i> 删除
                </el-button>
            </div>
        </el-row>
        <router-view></router-view>
        <el-table
                id="bm-hippo-alarm-rule-table"
                :data="table.content"
                v-loading="loading"
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
                    prop="content.name">
                <template slot-scope="scope">
                    <router-link :to="{path:'/hippo/alarm/rule/'+scope.row.id,  params: {id: scope.row.id}}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="id"
                    sortable="custom"
                    label="ID">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述"
                    sortable="custom"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="creator"
                    width="120"
                    label="创建人"
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
                    prop="lastModifiedTime"
                    label="修改时间"
                    sortable="custom"
                    :formatter="dateFormat"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="principal"
                    label="负责人"
                    sortable="custom"
                    width="80"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="通知邮箱"
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
        </el-table>
        <el-pagination
                id="bm-hippo-alarm-rule-pagination"
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
    import {getAlarmRuleList, delAlarmRuleList} from '@api';
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    import resIn from './alarmNav.js'

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
                loading: true,
                orderDirection: 'DESC',
                field: 'lastModifiedTime'
            }
        },
        methods: {
            //查看resourceMan
            handleEdit: function (id, index, row) {
                this.$router.push({path: '/hippo/alarm/rule/' + row.id, params: {id: row.id}});
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
            // table list
            listTable: function listTable(parameter) {
                getAlarmRuleList(parameter).then(data => {
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
                /*if(this.statusType != 'all'){
                    parameter = createParameter('status',this.statusType,'EQUAL').Build(parameter);
                }*/
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
                this.multipleSelection.forEach(function (i) {
                    var tdIds = [i.id];
                    delAlarmRuleList(tdIds).then(data => {
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
                        }
                    )
                });
            },
            //表格操作：忽略
            ingoreTable: function ingoreTable() {
                this.$router.push({path: '/hippo/alarm/rule/add'});
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
                if (column.column.label == '名称') {
                    this.field = 'name'
                }
                this.currentPage = 1
                var parameter = createParameter().Limit(this.pagesize).Sort(that.field, that.orderDirection).Build();
                that.listTable(parameter);
            },
        },
        mounted() {
            //  刷新列表
            resIn.$on('refreshList', () => {
                parameter = createParameter().Build();
                this.listTable(parameter);
            });
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
