<template>
    <div class="loginfoClass" v-loading="loading" id="bm-rh-design-detail-logInfo">
        <!--查找按钮-->
        <div class="log-search" id="bm-rh-design-logInfo-logSearch">
            <!--<el-input v-model="input" placeholder="请输入检索词" class="log-input" name="logInput">-->
            <!--<el-button slot="append" icon="el-icon-search" @click="search()" name="searchBtn"></el-button>-->
            <!--</el-input>-->
            <!-- <el-button @click="searchPre()" name="searchPre">
              上一条
              <i class="el-icon-arrow-up el-icon--right"></i>
            </el-button>
            <el-button @click="searchNext()" name="searchNext">
              下一条
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>-->
            <el-button @click="download()" type="primary" size="mini" name="download">下载</el-button>
            <el-button @click="showAll()" type="primary" size="mini" name="showAll">查看全部</el-button>
            <div class="loginSort">
                    <el-radio-group v-model="loginsort" @change="(value) => loginsortVal(value)">
                        <el-radio :label="false">正序</el-radio>
                        <el-radio :label="true">反序</el-radio>
                    </el-radio-group>
                </div>
        </div>
        <div class="content-div" id="bm-rh-design-logInfo-content">
            <el-tabs type="card" @tab-click="getTabData" v-model="showType"> <!-- getAllLog('',showType) -->
                <el-tab-pane v-for="typeitem in logTypes" :key="typeitem.name" :label="typeitem.name | cn" :name="typeitem.name">
					<span slot="label" class="tabsClass">
						<i class="el-icon-error" style="color: #cc4135 " v-if="typeitem.type=='ERROR'"></i>
						<i style="color: #5daf34" class="el-icon-success" v-else></i>
						{{typeitem.name| cn}}
					</span>
                </el-tab-pane>

                <!-- <div class="logContent" ref="logContent">
                  <div v-for="(log,index) in showLog" :key="index">
                    <div v-html="log"></div>
                  </div>
                </div>-->

                <el-table :data="tableData" height="calc(99vh - 350px)" ref="filterTable"
                          @filter-change="filterChange" style="width: 100%; overflow-y: auto" :row-class-name="tableRowClassName">
                    <el-table-column prop="level" label="级别" width="90" :filters="filterLevel" :column-key=" 'aStatus' "></el-table-column>
                    <el-table-column prop="name" label="时间" width="150">
                        <template slot-scope="scope">{{moment(scope.row.timestamp ).format("YYYY-MM-DD HH:mm:ss")}}</template>
                    </el-table-column>
                    <el-table-column prop="address" label="内容">
                        <template slot-scope="scope">
                            <span class="text-long" slot="reference">{{scope.row.message}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row.message)" type="text" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
                <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                               :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalLogArr">
                </el-pagination>
            </el-tabs>
        </div>

        <el-dialog title="日志详情" :visible.sync="dialogVisible" width="80%" :before-close="handleClose" :fullscreen="true">
            <!-- <span>{{stack_trace?stack_trace:""}}</span> -->
            <div class="loginMessage">
                <el-input auto-complete="off" type="textarea" placeholder="请输入节点Json" v-model="logMessage">
                </el-input>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getExecuteLogTypes,
        getExecuteTypeLog,
        listExecutingHistory
    } from "@api";
    import moment from "moment"//时间格式化
    import logVueTimeline from "@static/jsLibrary/logTimeLine/log-vue-timeline.vue";
    import {createParameter} from "@function/queryParameter.js";

    export default {
        components: {
            logVueTimeline
        },
        data() {
            return {
                dialogVisible: false,
                moment: moment,
                executionId: "",
                flowId: "",
                logTypes: [],
                showType: "",
                showLog: [],
                loading: false,
                indexField: 0,
                maxLength: 0,
                input: "",
                logs: [],
                para: "",
                logContext: [],
                checked: true,
                listData: [],
                tableLength: '',
                tableData: [
                    // {
                    //   timestamp: "",
                    //   level: "",
                    //   message: "",
                    //   stack_trace: ""
                    // }
                ],

                logMessage: "",
                totalLogArr: 0,
                errorLogArr: 0,
                warningLogArr: 0,
                infoLogArr: 0,
                currentPage: 1,
                pagesize: 8,
                totalElements: 0,
                loginsort: true,
                stack_trace: null,
                varTableData: [], //存储所有的datatable数据
                filterLevel: [{
                    text: 'INFO',
                    value: 'INFO'
                }, {
                    text: 'ERROR',
                    value: 'ERROR'
                }, {
                    text: 'WARN',
                    value: 'WARN'
                }, {
                    text: 'DEBUG',
                    value: 'DEBUG'
                }], //所有等级类型
                selFilterLevel:"ALL",
            };
        },
        methods: {
            //筛选条件的过滤方法
            filterChange(filters) {
                //每次筛选，当前页面置为1
                this.currentPage = 1
                //多个筛选条件的同时过滤
                if (filters.aStatus.length > 0) {
                    this.selFilterLevel = filters.aStatus.join(",")
                    this.getAllLog();
                } else {
                    //重置时候获取全部数据
                    this.selFilterLevel = "ALL"
                    this.getAllLog();
                }
            },
            unescape(val) {
                return unescape(val);
            },
            handleClick(val) {
                this.dialogVisible = true;
                this.logMessage = val;
            },
            handleClose(done) {
                done();
                //   this.$confirm("确认关闭？")
                //     .then(_ => {
                //       done();
                //     })
                //     .catch(_ => {});
            },
            tableRowClassName({
                                  row,
                                  rowIndex
                              }) {
                //ERROR、WARN、INFO、DEBUG
                if (row.level == "INFO") {
                    return "success-row";
                }
                if (row.level == "WARN") {
                    return "warning-row";
                }
                if (row.level == "DEBUG") {
                    return "debug-row";
                }
                if (row.level == "ERROR") {
                    return "error-row";
                }
                return "";
            },
            //更改每页显示的条数大小
            handleSizeChange: function(size) {
                this.pagesize = size;
                this.getAllLog();
            },
            //更改当前页面所在页数
            handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                this.getAllLog();
            },
            //获取日志列表
            getLogList: function(pagesize, currentPage) {
                var limit = pagesize ? pagesize : this.pagesize;
                var offset = currentPage ?
                    (currentPage - 1) * limit :
                    (this.currentPage - 1) * limit;
                //                this.executionId = '41b05a64-c38c-4499-bd0f-5f9cb2840400'
                getExecuteLogTypes(this.executionId, offset, 1).then(
                    resType => {
                        //返回日志总数目，放入分页组件中
                        this.totalElements = resType.totalSize;
                        var tmpTypes = resType.logInfo;
                        this.logTypes = [];
                        if (tmpTypes != null) {
                            var keys = Object.keys(tmpTypes);
                            for (var i = 0; i < keys.length; i++) {
                                this.logTypes.push({
                                    name: keys[i],
                                    type: tmpTypes[keys[i]]
                                });
                            }
                            //console.log(JSON.stringify(this.logTypes));
                            this.showType = this.logTypes[0].name;
                            //根据第一种类型的日志渲染页面
                            this.getAllLog(this.executionId, this.logTypes[0].name);
                        }
                    },
                    error => {
                        // this.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    }
                );
            },
            //查找
            search: function() {
                var that = this;
                var field = that.input;
                var tmpData = that.logs;
                that.showLog = [];
                that.maxLength = 0;
                this.indexField = 0;
                var k = 0;
                for (var j = 0; j < tmpData.length; j++) {
                    //选择你要的内容并添加高亮
                    if (tmpData[j].indexOf(field) > -1) {
                        tmpData[j] = tmpData[j].replace(
                            field,
                            "<span style='background: #f8ff54; color:rgba(0,0,0,0.93);' id=" +
                            k +
                            ">" +
                            field +
                            "</span>"
                        );
                        k++;
                    }
                }
                that.maxLength = k;
                if (that.maxLength == 0 && that.input != "") {
                    that.$confirm("无法找到文本" + that.input, "提示", {
                        type: "error"
                    });
                }
                that.showLog = tmpData;
            },
            //查找上一个
            searchPre: function() {
                if (this.maxLength === 0 && this.input != "") {
                    this.search();
                }
                let indexField = document.getElementById(this.indexField);
                if (indexField) {
                    //                    console.log(-(indexField.offsetTop -100 ) + 'px')
                    //                    this.$refs.logContent.style['marginTop'] = -(indexField.offsetTop ) + 'px'
                    indexField.scrollIntoView();
                }
                if (this.indexField == 0) {
                    this.indexField = this.maxLength - 1;
                } else {
                    this.indexField--;
                }
            },
            //查找下一个
            searchNext: function() {
                if (this.maxLength === 0 && this.input != "") {
                    this.search();
                }
                let indexField = document.getElementById(this.indexField + "");
                if (indexField) {
                    indexField.scrollIntoView();
                }
                if (this.indexField == this.maxLength - 1) {
                    this.indexField = 0;
                } else {
                    this.indexField++;
                }
            },
            //获取某个tab的完整的日志信息
            getAllLog: function(executionId, showType) {
                // if (showType == "application") {
                //   this.listData = this.application.list;
                // } else {
                //   this.listData = this.workflow.list;
                // }
                // return;
                var that = this;
                var loginsort = this.loginsort;
                var level = that.selFilterLevel;
                that.loading = true;
                executionId = executionId ? executionId : that.executionId;
                showType = showType ? showType : that.showType;
                //获取logtype详细日志列表了，是一个json数组应该，里面每个对象是结构化好的日志信息，按生成时间进行了升序排序
                getExecuteTypeLog(executionId, showType, (that.currentPage-1)*that.pagesize, that.pagesize, loginsort, level).then(
                    res => {
                        that.varTableData = JSON.parse(JSON.stringify(res.list)) //存储datatable的所有数据
                        that.tableData = res.list;
                        that.totalLogArr = res.totalCount;
                        that.errorLogArr = res.errorCount;
                        that.warningLogArr = res.warnCount;
                        that.infoLogArr = res.infoCount;
                        that.showLog = that.formattedData(res.list, showType);
                        that.logs = that.showLog;
                        that.logContext[showType] = that.showLog;
                        that.loading = false;
                        this.$refs.filterTable.clearFilter(); //切换日志类型清楚筛选条件
                    },
                    err => {
                        that.loading = false;
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: "error",
                                duration: 1500
                            });
                        }
                    }
                );
            },
            //根据返回来的日志信息提取出时间轴用的格式
            formattedData: function(res, showType, type) {
                var that = this;
                var tmpData = [];
                var tmpDataDownload = "";
                for (var j = 0; j < res.length; j++) {
                    if (
                        res[j]["loggerName"].indexOf("SparkJobLauncher") > -1 ||
                        res[j]["loggerName"].indexOf("SparkYarnClusterJobLauncher") > -1 ||
                        res[j]["loggerName"].indexOf("SparkYarnClientJobLauncher") > -1
                    ) {
                        if (type === "download") {
                            tmpDataDownload += res[j]["message"];
                        } else {
                            tmpData[j] = res[j]["message"];
                        }
                    } else {
                        var time = moment(res[j]["timestamp"]).format("YY/MM/DD HH:mm:ss");
                        if (type === "download") {
                            tmpDataDownload +=
                                time +
                                "  " +
                                res[j]["priority"] +
                                "  " +
                                res[j]["message"] +
                                (res[j]["stack_trace"] ? res[j]["stack_trace"] : " ") +
                                "\n";
                        } else {
                            tmpData[j] =
                                time +
                                "  " +
                                res[j]["priority"] +
                                "  " +
                                res[j]["message"] +
                                (res[j]["stack_trace"] ? res[j]["stack_trace"] : " ") +
                                "\n";
                        }
                    }
                }
                if (type === "download") {
                    return tmpDataDownload;
                } else {
                    return tmpData;
                }
            },
            //下在日志
            download: function() {
                var that = this;
                var time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss,ms");
                //调用所有的类行的数据请求
                for (var i = 0; i < that.logTypes.length; i++) {
                    // if (!that.logContext[that.logTypes[i].name]) {
                    //
                    // } else {
                    //     var content = that.logContext[that.logTypes[i].name];
                    //     var blob = new Blob([content], {
                    //         type: "text/plain;charset=utf-8"
                    //     });
                    //     saveAs(blob, that.logTypes[i].name + "-" + time + ".txt"); //saveAs(blob,filename)
                    // }
                    that.logContext[that.logTypes[i].name] = (function(executionId, logTypes) {
                        getExecuteTypeLog(executionId, logTypes, -1, -1, that.loginsort,"All").then(
                            res => {
                                that.logContext[logTypes] = that.formattedData(
                                    res.list,
                                    logTypes,
                                    "download"
                                );
                                var content = that.logContext[logTypes];
                                var blob = new Blob([content], {
                                    type: "text/plain;charset=utf-8"
                                });
                                saveAs(blob, logTypes + "-" + time + ".txt"); //saveAs(blob,filename)
                            },
                            err => {
                                var _this = this;
                                if (err.response.status == 500) {
                                    _this.$message({
                                        message: err.response.message,
                                        type: "error",
                                        duration: 1500
                                    });
                                }
                            }
                        );
                    })(that.executionId, that.logTypes[i].name);
                }
            },
            showAll: function() {
                var that = this;
                var myWindow = window.open("", "_blank");
                getExecuteTypeLog(that.executionId, that.showType, -1, -1, that.loginsort, "ALL").then(
                    res => {
                        that.showLog = that.formattedData(res.list, that.showType);
                        that.loading = false;
                        for (var i = 0; i < that.showLog.length; i++) {
                            myWindow.document.write(" <pre>" + that.showLog[i] + " </pre>");
                        }
                    },
                    err => {
                        that.loading = false;
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: "error",
                                duration: 1500
                            });
                        }
                    }
                );
            },
            loginsortVal: function(val) {
                this.getAllLog();
            },
            getTabData : function (val) {
                this.currentPage = 1;
                this.selFilterLevel = "ALL"
                this.getAllLog(this.executionId,val.name);
            }
        },
        mounted() {
            //   this.listData = this.workflow.list;
            // return;
            var that = this;
            that.flowId = this.$route.params.id;
            if (this.$route.params.id && this.$route.params.jobId) {
                // 从监控跳过来
                var para = createParameter("flowId", that.flowId, "EQUAL")
                    .And("jobId", this.$route.params.jobId, "EQUAL")
                    .Offset(0)
                    .Limit(8)
                    .Build();
            } else {
                //根据flowId获取最近的一次executionId
                var para = createParameter("flowId", that.flowId, "EQUAL")
                    .Offset(0)
                    .Limit(8)
                    .Build();
            }
            //根据flowId获取最近的一次executionId
            listExecutingHistory(para).then(
                res => {
                    //获取下载日志所需参数executions.id executions,externalId
                    if (
                        res.content &&
                        res.content[0] &&
                        res.content[0].id &&
                        res.content[0].externalId
                    ) {
                        that.para = res.content[0].id + "," + res.content[0].externalId;
                        that.executionId = res.content[0].id;
                    }
                    //获得日志类型列表，返回，application，monitor，workflow之类的一个数组
                    if (that.executionId) {
                        this.getLogList();
                    }
                },
                error => {
                    // this.$confirm(error.response.data.err,"错误", {
                    //     type: "error"
                    // })
                }
            );
        }
    };
</script>

<style lang="scss" scoped>
    .tabsClass {
        float: left;
        width: 120px;
        text-align: center;
    }

    .logContent {
        position: relative;
        max-height: calc(100vh - 379px);
        overflow-y: auto;
    }

    .log-search {
        margin-top: -8px;
        padding-bottom: 8px;
    }

    .log-input {
        width: 250px;
    }
</style>
<style lang="scss">
    .loginfoClass {
        width: 100%;
        padding-top: 0px;

    //   height: calc(100vh - 313px);
    .content-div {
        width: 100%;
    // height: calc(100vh - 303px);
    // overflow: auto;
    // position: relative;
        padding: 0 0 5px 0;
    }

    .el-tabs__content {
        height: auto !important;

        position: relative;
    }
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .clearfix:after {
        display: block;
        clear: both;
        content: "";
    }

    .logs {
        /*height: 900px;*/
    }

    .logs-info {
        height: 16px;
        padding-left: 10px;
        padding-top: 10px;
        top: 50px;
        background-color: #fff;
        width: 100%;
        white-space: nowrap;
        margin-bottom: 10px;
    }

    .logs-info h4 {
        margin: 0px;
        margin-bottom: 10px;
    }

    .logs-info span {
        margin-right: 10px;
    }

    .logs-headerbar {
        padding: 10px 0px 0px 0px;
        background-color: #525252;
        height: 38px;
        width: 100%;
    }

    .stat-name {
        color: #fff;
        margin-left: 10px;
        margin-right: 4px;
    }

    .stat-count {
        font-weight: 900;
        font-size: 12px;
        border-radius: 10px;
        color: #000;
        font-size: 12px;
        display: inline-block;
    }

    .stat-count-number {
        padding-left: 5px;
        padding-right: 5px;
    }

    .total-num {
        background-color: #fff;
    }

    .total-yellow {
        background-color: yellow;
    }

    .total-red {
        background-color: red;
    }

    .total-green {
        background-color: #50dd51;
    }

    .mt20 {
        margin-top: 8px;
    }

    .logs-btn {
        background: rgba(82, 82, 82, 1);
        border: 1px solid #ccc;
        color: #fff;
    }

    .logs-check {
        margin-top: 8px;
        font-size: 12px;
        color: #fff;
    }

    .searchInput {
        width: 120px;
    }

    .searchInput input {
        width: 100%;
        height: 28px;
        position: inherit;
        color: #ffffff;
        background-color: #525252;
        border-radius: 4px;
        height: 30px;
        text-align: center;
    }

    .mr10 {
        margin-right: 8px;
    }

    .log-tooltip-width {
        width: calc(100% - 20px);
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .el-table .error-row {
        background: rgb(238, 204, 204);
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .text-long {
        overflow: hidden;
        /*自动隐藏文字*/
        text-overflow: ellipsis;
        /*文字隐藏后添加省略号*/
        white-space: nowrap;
        /*强制不换行*/
        width: 10em;
        /*不允许出现半汉字截断*/
        color: #333;
    }

    .loginSort {
        float: right;
        width: 150px;
        margin-top: 15px;
        margin-right: 0px;
    }

    .loginMessage textarea {
        height: calc(80vh - 120px);
    }
</style>
