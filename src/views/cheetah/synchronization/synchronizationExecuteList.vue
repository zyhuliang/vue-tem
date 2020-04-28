<template>

    <section id='bm-ch-sys-execttelist-tmp'>
        <div class="clearBox">
            <el-row class="btnClass">
                <div class="btn-right">
                    <el-button type="info" id='bm-ch-col-sys-execttelist-stop-button' @click="stopExecuteJob"><i
                            class="icon iconfont icon-ir-stop"></i>&nbsp;终止
                    </el-button>
                    <el-button type="info" id='bm-ch-col-sys-execttelist-refresh-button' @click="refreshExecuteList"><i
                            class="icon iconfont icon-ir-refresh"></i>&nbsp;刷新
                    </el-button>
                    <el-button type="info" id='bm-ch-col-sys-execttelist-back-button' @click="goback"><i
                            class="icon iconfont icon-ir-home"></i>&nbsp;返回
                    </el-button>
                </div>
            </el-row>
            <!--内容显示列表页面-->

            <template>
                <div class="rf-swap">
                    <el-table id="bm-ch-syschronization-executelist-table" :data="tableData.content"
                              v-loading="loading"
                              tooltip-effect="dark"
                              @selection-change="handleSelectionChange"
                              height=" calc(100vh - 180px)"
                              style="width: 100%;"
                    >
                        <el-table-column
                                type="selection">
                        </el-table-column>

                        <el-table-column label="启动时间" prop="createTime" with="300" :formatter="dateFormat"
                                         align="center" sortable>
                        </el-table-column>
                        <el-table-column label="完成时间" prop="endTime" width="300" :formatter="dateFormat" align="center"
                                         sortable>
                        </el-table-column>
                        <el-table-column label="读入" prop="readIn" align="center" sortable>
                        </el-table-column>
                        <el-table-column label="写出" prop="writeOut" align="center" sortable>
                        </el-table-column>
                        <el-table-column label="错误写出" prop="errorOut" align="center" sortable>
                        </el-table-column>
                        <el-table-column label="状态" prop="status" width="200" align="center" sortable>
                            <template slot-scope="scope">
                                <div v-if="scope.row.status == 1">运行</div>
                                <div v-else-if="scope.row.status == 2">完成</div>
                                <div v-else-if="scope.row.status == -1">失败</div>
                                <div v-else-if="scope.row.status == -2">终止</div>
                                <div v-else>未知</div>
                            </template>
                        </el-table-column>

                        <el-table-column width="200" align="center">
                            <template slot-scope="scope">
                                <a @click="viewLog(scope.row)"
                                >
                                    查看日志
                                </a>
                            </template>
                        </el-table-column>

                    </el-table>
                    <el-pagination
                            name="bm-ch-1-el-pagination"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.totalElements">
                    </el-pagination>
                </div>
            </template>
        </div>
        <dialog-task-log ref="taskLog"></dialog-task-log>
    </section>
</template>

<script>

    import {getCollectorTaskList, stopTaskExecute, getSynchronizationTaskExecuteList} from '@api'
    import dialogTaskLog from '@components/collector/execute/log.vue'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';

    export default {
        components: {
            dialogTaskLog,
        },
        data() {
            return {
                multipleSelection: [],
                dateValue: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                value: '',
                checkList: [],
                filters: {
                    'filter': "", 'limit': 10, 'offset': 0, 'query': "", 'sorts': '-createTime'
                },
                taskId: "",
                collectorId: '',
                loading: false,
                tableData: {},
                loading: true

            }
        },
        methods: {
            //分页用到的函数
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.getExecuteList(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput)
                this.getExecuteList(this.parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //获取数据导入任务的执行列表
            getExecuteList: function (parameter) {
                var para
                if (!parameter) {
                    para = queryObject();
                } else para = parameter
                getSynchronizationTaskExecuteList(this.taskId, para).then((res) => {
                    this.loading = false
                    this.tableData = res
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            // 返回
            goback: function () {
                var len = this.$route.matched.length
                var path = this.$route.matched[len - 2].path
                //如果是采集器任务就要跳转到采集器任务列表的路径
                path = this.collectorId ? '/collector/' + this.collectorId + '/taskList/' + this.taskId : path
                this.$router.push(path)
            },
            //查看日志
            viewLog: function (row) {
                this.$refs.taskLog.viewLog(row)
            },
            //终止执行列表
            stopExecuteJob: function () {
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

                var that = this
                that.$confirm('真的要停止' + tbIds.length + '个执行?', '提示', {}).then(() => {
                    var cId = this.collectorId ? this.collectorId : 'WOVEN-SERVER'
                    stopTaskExecute(cId, tbIds).then((res) => {
                            that.getExecuteList();
                        }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    )
                }).catch(() => {

                });

            },
            //刷新执行列表
            refreshExecuteList: function () {
                this.getExecuteList(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput));
            },
        },
        mounted() {
            var that = this;
            that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
            that.taskId = that.$route.params.taskId
            //获取采集器的id
            that.collectorId = that.$route.query.collectorId
            that.getExecuteList(that.parameter);
        },
    }

</script>

<style scoped>
    .con-module {
        padding: 20px;
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

    .tpAddrl {
        color: #FFFFFF;
        margin-right: 0px;
        text-decoration: none;
    }

    .ers-pattern {
        float: left;
        width: 300px;
        height: 40px;
        line-height: 40px;
    }

    .ers-pattern h4 {
        margin: 0px;
        float: left;
    }

    .ers-pattern .el-select {
        float: left;
        margin-left: 10px;

    }

    .view-syn-content {
        position: absolute;
        background-color: #FFFFFF;
        top: 0px;
        padding-top: 70px;
        padding-right: 20px;
        box-sizing: border-box;
        height: 100%;
        z-index: 99;
        overflow-y: auto
    }

</style>

