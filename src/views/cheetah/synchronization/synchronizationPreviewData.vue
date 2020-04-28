<template>
    <section class="con-module" id='bm-ch-sys-previewData-tmp'>
        <el-row>
            <el-button id='bm-ch-sys-stopExecuteList-button' type="danger" @click="stopExecuteList"><i
                    class="icon iconfont icon-ir-stop"></i>&nbsp;终止
            </el-button>
            <el-button id='bm-ch-sys-refreshExecuteList-button' type="success" @click="refreshExecuteList"><i
                    class="icon iconfont icon-ir-refresh"></i>&nbsp;刷新
            </el-button>

            <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-input placeholder="请输入内容" class="input-with-search">
                <el-button slot="append" icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
        </el-row>
        <!--内容显示列表页面-->

        <template>
            <el-table id="bm-ch-syschronization-previewData-table"
                      :data="executeList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                      v-loading="loading"
                      tooltip-effect="dark"
                      style="width: 100%" max-height="700">
                <el-table-column
                        type="selection">
                </el-table-column>

                <el-table-column label="启动时间" prop="createTime" width="200" sortable>
                </el-table-column>
                <el-table-column label="完成时间" prop="endTime" width="200" sortable>
                </el-table-column>
                <el-table-column label="读入" prop="readIn" width="180" sortable>
                </el-table-column>
                <el-table-column label="写出" prop="writeOut" width="100" sortable>
                </el-table-column>
                <el-table-column label="错误写出" prop="errorOut" width="50" sortable>
                </el-table-column>
                <el-table-column label="状态" prop="status" width="50" sortable>
                </el-table-column>
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <router-link
                                type="text"
                                size="small"
                                @click="viewLog(scope.row)"
                                :to="{ path: '/synchronization/executeList',params:{id:scope.row.id}}"
                        >
                            查看日志
                        </router-link>
                    </template>
                </el-table-column>

            </el-table>
            <el-pagination
                    name="bm-ch-3-el-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 16, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="executeList.length">
            </el-pagination>
        </template>
        <router-view class="viewContent"></router-view>
    </section>
</template>

<script>

    import {getCollectorTaskList, getSynchronizationTaskExecuteList} from '@api'

    export default {
        data() {
            return {

                dateValue: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                value: '',
                checkList: [],
                filters: {
                    'filter': "", 'limit': 10, 'offset': 0, 'query': "", 'sorts': '-lastModifiedTime'
                },
                taskId: "",
                loading: false,
                executeList: [],
                loading: true

            }
        },
        methods: {
            //分页用到的函数
            handleSizeChange: function (size) {
                this.pagesize = size;
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
            },
            //终止执行列表
            stopExecuteList: function () {

            },

            //刷新执行列表
            refreshExecuteList: function () {

            },
            //获取数据导入任务的执行列表
            getExecuteList: function () {
                let para = {
                    'filter': "", 'limit': 10, 'offset': 0, 'query': "", 'sorts': '-lastModifiedTime'
                };
                getSynchronizationTaskExecuteList(this.taskId, para).then((res) => {
                    this.loading = false
                    this.executeList = res.content
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

        },
        mounted() {
            this.taskId = this.$route.params.id,
                this.getExecuteList();
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
        margin-top: 15px;
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
</style>

