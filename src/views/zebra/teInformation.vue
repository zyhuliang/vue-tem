<template>
    <section id="bm-qa-teInformation">
        <el-row class="btnClass">
            <div class="btn-left" id="bm-qa-teInformation-search">
                <el-input placeholder="请输入名称" v-model="searchInput"
                          name="bm-qa-teInformation-search-input"
                          @keyup.enter.native="searchTable" class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"
                               name="bm-qa-teInformation-search-btn"></el-button>
                </el-input>
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
                <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
            </div>
            <div class="btn-right" id="bm-qa-teInformation-btns">
                <el-button type="info" @click="delTable" :disabled="multipleSelection.length == 0"
                           name="bm-qa-teInformation-btns-delete"><i class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
                <!--<el-button type="info" @click="returnTemplate" name="bm-qa-teInformation-btns-back"><i class="icon iconfont icon-ir-left"></i>返回分析模板</el-button>-->
            </div>
        </el-row>

        <el-row class="rf-swap">
            <el-table
                    id="bm-qa-teInformation-table"
                    @sort-change="getOrder"
                    :data="table.content"
                    v-loading="loading"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    height="calc(100vh - 200px)">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="主键"
                        width="50"
                        v-if="show">
                </el-table-column>
                <el-table-column
                        prop="modelName"
                        label="模板"
                        sortable="custom"
                >

                    <template slot-scope="scope">
                        <span class="seeName" @click="handleEdit(scope.row.modelId, scope.$index, scope.row)">{{ scope.row.modelName }}</span>
                    </template>

                </el-table-column>
                <el-table-column
                        prop="name"
                        min-width="130"
                        label="执行任务名"
                        sortable="custom"
                >
                    <template slot-scope="scope">
                        <span class="seeName" @click="seeTaskCarry(scope.row.id, scope.$index, scope.row)">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="flowStatus"
                        label="任务状态"
                        sortable="custom"
                        width="100"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.flowStatus | cn }}</span>
                    </template>
                </el-table-column>
                <!--增加一列，周期执行情况-->
                <el-table-column
                        label="周期情况"
                        sortable="custom"
                        width="100"
                        prop="scheduleType"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.scheduleType=='ONCE' || scope.row.scheduleType=='once'">单次执行</span>
                        <span v-else-if="scope.row.scheduleType=='CRON' || scope.row.scheduleType=='cron'">周期执行</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="执行结果"
                        width="100"

                >
                    <template slot-scope="scope">
            <span class="seeName"
                  v-if="scope.row.flowStatus=='SUCCEEDED'"
                  @click="handleResult(scope.row.id, scope.$index, scope.row)"
            >结果</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="processDataId"
                        label="输入数据集"
                        min-width="130"
                        sortable="custom"
                >
                </el-table-column>
                <!--<el-table-column
                        prop="sliceTime"
                        label="数据时间片"
                        min-width="130"
                        sortable="custom"
                        >
                </el-table-column>-->
                <el-table-column
                        prop="executionId"
                        label="执行日志信息"
                        min-width="130"
                        sortable="custom"
                >
                    <template slot-scope="scope">
                        <span class="seeName" @click="taskDetail(scope.row.flowId,scope.row.executionId)">{{ scope.row.executionId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="qualityRank"
                        label="数据质量等级"
                        sortable="custom"
                        width="130"
                >
                </el-table-column>
                <el-table-column
                        prop="badRatio"
                        label="坏数据百分比(%)"
                        sortable="custom"
                        width="150"
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
        </el-row>

        <router-view></router-view>

        <!--数据预览 dialog-->
        <preview-data-set ref="dataset"></preview-data-set>
        <!--点击执行任务ID弹出日志查看弹窗-->

        <el-dialog title="日志查看" :visible.sync="showLog" id="bm-qa-teInformation-showLog">
            <div v-loading="loadingA">
                <div class="errCon" v-html="errCon"></div>
                <el-tabs v-model="activeName" type="card" @tab-click="getLogCon">
                    <!--<el-tab-pane label="application" name="application" v-html="appliLogCon"></el-tab-pane>
                    <el-tab-pane label="配置管理" name="dataflow_0" v-html="appliLogCon"></el-tab-pane>
                    <el-tab-pane label="角色管理" name="monitor" v-html="appliLogCon"></el-tab-pane>
                    <el-tab-pane label="定时任务补偿" name="workflow" v-html="appliLogCon"></el-tab-pane>-->
                    <el-tab-pane v-for="item in logs" :key="item" :label="item |cn"
                                 :name="item" v-html="appliLogCon">
                        <!--去掉了name属性后面的中文转换即可-->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {zdafgetDate, zdafdelTbaleDate, getExecuteTypeLog, getExecuteLogTypes} from '@api';
    import {createParameter} from '@components/function/queryParameter';
    import moment from "moment"//时间格式化
    //导入预览组件
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'
    import Bus from './bus.js'

    var parameter = {
        "fieldList": [],
        "sortObject": {
            "field": "lastModifiedTime",
            "orderDirection": "DESC"
        },
        "offset": 0,
        "limit": 8
    }
    export default {
        components: {
            previewDataSet
        },
        data() {
            return {
                modelName: this.$route.query.modelName,
                table: [],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime: false,
                searchInput: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                parameter: '',
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                loading: true,
                loadingA: true, //日志查看的加载效果
                showLog: false,
                activeName: '',
                appliLogCon: '',
                taskId: '',
                //日志类型数组
                logs: [],
                errCon: ''
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection;
                if (this.modelName) {
                    this.parameter.fieldList.push(
                        {
                            'fieldName': "modelName",
                            'fieldValue': this.modelName,
                            'comparatorOperator': "EQUAL"
                        }
                    );
                }
                this.listTable(this.parameter)

            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                /*var limit=this.pagesize;
                var offset = (currentPage-1)*this.pagesize;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
               this.parameter =createParameter('name',query,'LIKE').Offset(offset).Limit(limit).Build();*/
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection

                if (this.modelName) {
                    this.parameter.fieldList.push(
                        {
                            'fieldName': "modelName",
                            'fieldValue': this.modelName,
                            'comparatorOperator': "EQUAL"
                        }
                    );
                }

                this.listTable(this.parameter)

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
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
                //过滤的时候为了区分搜索全部任务，还是当前模板下的任务
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },


            handledateValue: function (val) {
                /*var startTime=this.$refs.startTime.innerText.replace("\"","").replace("\"","");
                var endTime=this.$refs.endTime.innerText.replace("\"","").replace("\"","");
                var dateTime=startTime.replace(".000","")+" TO "+endTime.replace(".000","");
                var parameter={filter:"lastModifiedTime=["+dateTime+"]",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};*/
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var parameter = this.buildParameters();
                if (this.modelName) {
                    parameter.fieldList.push(
                        {
                            'fieldName': "modelName",
                            'fieldValue': this.modelName,
                            'comparatorOperator': "EQUAL"
                        }
                    );
                }
                this.listTable(parameter);
            },
            //根据任务状态过滤执行结果
            resultFormatter: function (row, column) {
                let resultName = row.flowStatus;
                switch (resultName) {
                    case "FAILED":
                        return "";
                        break;
                    case  "SUCCEEDED":
                        return "结果";
                        break;
                }
            },
            //table list
            listTable: function listTable(parameter) {
                // GET /someUrl
                zdafgetDate(parameter).then(data => {
                        this.loading = false
                        console.log(data);
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
            //列表排序
            getOrder(column) {
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
                /*this.pagesize = 8*/
                this.currentPage = 1;
                var parameter = this.buildParameters();
                //that.parameter = createParameter().Limit(this.pagesize).Sort(this.field,this.orderDirection).Build();
                that.listTable(parameter);
            },
            //查询
            searchTable: function searchTable() {
                var parameter = this.buildParameters();
                if (this.modelName) {
                    parameter.fieldList.push(
                        {
                            'fieldName': "modelName",
                            'fieldValue': this.modelName,
                            'comparatorOperator': "EQUAL"
                        }
                    );
                }
                this.listTable(parameter);
            },
            //监听查询回车事件
            /*searchKeyup:function () {
                var parameter=this.buildParameters();
                this.searchTable(parameter);
            },*/
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
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个分析任务?', '提示', {}).then(() => {
                    zdafdelTbaleDate(tbIds).then(data => {
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

            handleEdit: function (id, index, row) {
                console.log(row.id);
                this.$router.push({name: "查看分析模板2", params: {row: row}, query: {id: id}});

            },

            seeTaskCarry(id, index, row) {
                //this.$router.push({ name: "查看任务执行信息"});
                this.$router.push({name: "查看任务执行信息", params: {row: row}, query: {id: id}});
            },
            taskDetail(flowId, taskId) {

                //由原来的页面跳转，改成弹窗
                console.log(taskId);
                this.showLog = true;
                this.taskId = taskId;
                //this.loading=true;
                this.getLogType();
                //默认选中tab的第一项，并加载第一项的内容
            },
            getLogType() {
                this.logs = [];
                this.loadingA = true;
                getExecuteLogTypes(this.taskId, 0, 1).then(res => {
                    console.log(res.logInfo)
                    for (var i in res.logInfo) {
                        this.logs.push(i);
                    }
                    console.log(this.logs);
                    this.activeName = this.logs[0];

                    this.logCon();
                    this.loadingA = false;
                }).catch(err => {
                    //如果是错误的话就打印出错误信息
                    //this.appliLogCon=err.response.data.err;
                    this.errCon = err.response.data.err;
                    console.log(err.response.data.err);
                    this.loadingA = false;
                })
            },
            logCon() {
                this.appliLogCon = '';
                this.loadingA = true;
                getExecuteTypeLog(this.taskId, this.activeName, 0, -1, true, "All").then((res) => {
                    console.log(res);
                    //先置空
                    this.appliLogCon = '';

                    for (var i = 0; i < res.list.length; i++) {
                        this.appliLogCon += moment(res.list[i].timestamp).format("YY/MM/DD HH:mm:ss") + ' ' + res.list[i].level + ' ' + res.list[i].message + '</br>';
                    }

                    this.loadingA = false;
                }).catch(err => {
                    console.log(err);
                })

            },
            getLogCon() {
                console.log(this.activeName);//打印出选中的tab值
                this.logCon();
                //console.log(this.activeName+'tab标签')
            },
            handleResult(id, index, row) {
                //this.$refs.dataset.dataPreview(row.outputDataId,row.tenantId);
                //this.$router.push({ name:"分析结果",params:{row:row}, query: {id: id}});
                this.$router.push({
                    name: "分析结果",
                    params: {row: row},
                    query: {id: row.outputDataId, tenantId: row.tenantId}
                });
            },
            //返回分析模板页面
            returnTemplate() {
                this.$router.push({path: '/qualityAnalysis/analysisTemplate'});
                //为了改变下拉菜单的值,用Bus总线向外触发事件
                Bus.$emit('backMenuSet', '分析模板')

            }
        },

        mounted() {
            if (this.modelName) {
                var parameter = {
                    "fieldList": [
                        {
                            "fieldName": "modelName",
                            "fieldValue": this.modelName,
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
            } else {
                var parameter = {
                    "fieldList": [],
                    "sortObject": {
                        "field": "lastModifiedTime",
                        "orderDirection": "DESC"
                    },
                    "offset": 0,
                    "limit": 8
                }
            }

            this.listTable(parameter);
            // console.log(this.modelName)
        }
    }

</script>

<style lang="scss" scoped>

    .el-tab-pane {
        /*background: red;*/
        height: calc(100vh - 320px);
        overflow: auto;
        color: #000;
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
        padding-left: 150px;
    }
</style>