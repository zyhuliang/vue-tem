<template>
    <section id="bm-qa-analysisRules">
        <el-row class="btnClass">
            <div class="btn-left" id="bm-qa-analysisRules-search">
                <el-input placeholder="请输入名称" v-model="searchInput" @keyup.enter.native="searchKeyup"
                          class="input-with-search" name="bm-qa-analysisRules-input">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"
                               name="bm-qa-analysisRules-btn"></el-button>
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
            </div>
            <div class="btn-right" id="bm-qa-analysisRules-btns">
                <router-link class="tpAddrl" :to="{ path: '/qualityAnalysis/analysisRules/add'}">
                    <el-button type="info"><i class="icon iconfont icon-ir-add"></i>新建</el-button>
                </router-link>
                <el-button type="info" @click="delTable" name="btnInfo" :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
            </div>
        </el-row>
        <el-row class="tac rf-swap">
            <el-col class="el-rowLeft">
                <rule-tree></rule-tree>
            </el-col>
            <el-col class="el-rowRight">
                <el-table
                        id="bm-qa-analysisRules-table"
                        @sort-change="getOrder"
                        v-loading="loading"
                        :data="table.content"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        height="calc(100vh - 200px)">
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
                            <span class="seeName" @click="handleEdit(scope.row.id, scope.$index, scope.row)">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="buildType"
                            label="类型"
                            sortable="custom"
                            width="80"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.buildType|cn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="customType"
                            label="自定义类型"
                            sortable="custom"
                            width="150"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.customType|cn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="customValue"
                            label="自定义数据/表达式"
                            sortable="custom"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="creator"
                            label="创建人"
                            sortable="custom"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="lastModifiedTime"
                            label="修改时间"
                            sortable="custom"
                            width="180"
                            :formatter="dateFormat"
                    >
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
            </el-col>
        </el-row>
        <router-view></router-view>
    </section>
</template>
<script>
    import ruleNav from "@components/analysisRulesTree/ruleNav.js";
    import ruleTree from "@components/analysisRulesTree/ruleTree";
    import {argetDate, ardelTbaleDate} from '@api';
    import {queryObject, createParameter} from "@components/function/queryParameter";
    import Bus from './bus.js'
    var parameter = queryObject();
    export default {
        components: {
            ruleNav,
            ruleTree
        },
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
                prop: 'lastModifiedTime',
                orderDirection: 'DESC',
                parameter: '',
                loading: true,
                dataNav: {
                    name: ''
                },
                flag: false,
                colData: ''   //渲染点击列标签时的数据
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                if (this.flag == true) {
                    this.parameter.fieldList.push({
                        'fieldName': this.dataNav.parameter.name,
                        'fieldValue': this.dataNav.parameter.value,
                        'comparatorOperator': 'EQUAL'
                    });
                }
                if (this.colData == '列') {
                    this.parameter.fieldList.push({
                        'fieldName': 'fieldValueType',
                        'fieldValue': 'Other',
                        'comparatorOperator': 'NOT_EQUAL'
                    });
                }
                this.listTable(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                if (this.flag == true) {
                    this.parameter.fieldList.push({
                        'fieldName': this.dataNav.parameter.name,
                        'fieldValue': this.dataNav.parameter.value,
                        'comparatorOperator': 'EQUAL'
                    });
                }
                if (this.colData == '列') {
                    this.parameter.fieldList.push({
                        'fieldName': 'fieldValueType',
                        'fieldValue': 'Other',
                        'comparatorOperator': 'NOT_EQUAL'
                    });
                }
                console.log(this.flag);
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
                this.loading = true;
                argetDate(parameter).then(data => {
                    this.loading = false
                    this.table = data;
                }, err => {
                    if (err.response.status == 500) {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //列表排序
            getOrder: function (column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                that.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                var parameter = this.buildParameters();
                if (this.flag == true) {
                    parameter.fieldList.push(
                        {
                            'fieldName': this.dataNav.parameter.name,
                            'fieldValue': this.dataNav.parameter.value,
                            'comparatorOperator': 'EQUAL'
                        }
                    );
                }
                if (this.colData == '列') {
                    parameter.fieldList.push({
                          'fieldName': 'fieldValueType',
                          'fieldValue': 'Other',
                          'comparatorOperator': 'NOT_EQUAL'
                      });
                }
                that.listTable(parameter);
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
                    if (this.dateValue != '' && this.dateValue.length != 0) {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            //查询
            searchTable: function searchTable() {
                this.currentPage = 1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.currentPage = 1;
                var parameter = this.buildParameters();
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
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个分析规则?', '提示', {}).then(() => {
                    ardelTbaleDate(tbIds).then(data => {
                            tableRefresh.listTable(parameter);
                            tableRefresh.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });
                        }, err => {
                            var _this = this;
                            if (err.response.status == 500) {
                                _this.$message({
                                    message: err.response.data.err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    ).catch(() => {
                        tableRefresh.$message({
                            message: 'Builtin 规则不允许删除！',
                            type: 'error'
                        });
                    });
                })
            },
            //查看分析规则
            handleEdit: function (id, index, row) {
                this.$router.push({name: "查看规则模板", params: {addForm: row}});
            }
        },
        watch: {
            "$route": function () {
                this.listTable(parameter)
            }
        },
        mounted() {
            var that = this;
            that.listTable(parameter);
            //注意$on()中this的指向
            ruleNav.$on('childMethod', function (dataNav) {
                that.dataNav = dataNav;
                that.pagesize = 8;
                that.currentPage = 1;
                if (dataNav.name !== '数据类型' && dataNav.name !== '列' && dataNav.name !== '其他') {
                    that.flag = true;
                    var parameter = createParameter(dataNav.parameter.name, dataNav.parameter.value, "EQUAL").Build();
                    that.listTable(parameter)
                }
                if (dataNav.name == '其他') {
                    var parameter = {
                        "fieldList": [
                            {
                                "fieldName": "fieldValueType",
                                "fieldValue": "Other",
                                "comparatorOperator": "EQUAL"
                            }
                        ],
                        "sortObject": {
                            "field": "lastModifiedTime",
                            "orderDirection": "DESC"
                        },
                        "offset": 0,
                        "limit": 8
                    }
                    that.listTable(parameter);
                }
                //点击数据类型
                if (dataNav.name == '数据类型') {
                    that.flag = false;
                    var parameter = queryObject();
                    that.listTable(parameter);
                }
                if (dataNav.name == '列') {
                    that.flag = false;
                    that.colData = '列';
                    var parameter = {
                        "fieldList": [
                            {
                                "fieldName": "fieldValueType",
                                "fieldValue": "Other",
                                "comparatorOperator": "NOT_EQUAL"
                            }
                        ],
                        "sortObject": {
                            "field": "lastModifiedTime",
                            "orderDirection": "DESC"
                        },
                        "offset": 0,
                        "limit": 8
                    }
                    that.listTable(parameter);
                }
            })
            Bus.$on('checkVal', (data) => {
                this.flag = false;
                this.currentPage = 1;
                that.listTable(parameter);
            })
        },
        beforeDestroy() {
            Bus.$off('checkVal')
        },
        watch: {
            "$route": function () {
                //路由发生改变时，保留原有搜索状态
                var parameter = this.buildParameters();
                if (this.flag == true) {
                    parameter.fieldList.push(
                        {
                            'fieldName': this.dataNav.parameter.name,
                            'fieldValue': this.dataNav.parameter.value,
                            'comparatorOperator': 'EQUAL'
                        }
                    );
                }
                if (this.colData == '列') {
                    parameter.fieldList.push(
                        {
                            'fieldName': 'fieldValueType',
                            'fieldValue': 'Other',
                            'comparatorOperator': 'NOT_EQUAL'
                        }
                    );
                }
                this.listTable(parameter)
            }
        },
    };
</script>

<style scoped>
    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .tpAddrl {
        color: #FFFFFF;
        margin-right: 10px;
        text-decoration: none;
    }

    .seeName {
        margin-left: 5px;
        color: #2182e4;
        cursor: pointer
    }

    .seeName:hover {
        text-decoration: underline;
    }

    .btn-left {
        padding-left: 125px;
    }

    .tac {
        height: calc(100vh - 120px);
    }

    .el-rowLeft {
        width: calc(15% - 0px);
    }

    .el-rowRight {
        width: calc(85% - 10px);
        margin: 0px 0px 0px 10px;
    }
</style>
