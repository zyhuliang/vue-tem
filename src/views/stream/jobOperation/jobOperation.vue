<template >
    <section >
        <div class="synchronizationsBox">
            <el-row class="btnClass">
                <div class="btn-right">
                    <el-button type="info" @click="getList()"><i class="icon iconfont icon-ir-operation"></i>刷新</el-button>
                </div>
            </el-row>
            <!--内容显示列表页面-->
            <template>
                <div class="rf-swap dn-data">
                    <el-table :data="tableData.list"
                              tooltip-effect="dark"
                              v-loading="loading"
                              id="bm-stream-jobOpration-jobOpration-table"
                              height="calc(100vh - 175px)"
                              style="width: 100%" >
                        <el-table-column  label="名称" prop="name"  width="300">
                            <template slot-scope="scope">
                                <div class="editName" @click="nameDitial(scope.row)">{{scope.row.name}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="执行引擎" prop="executionEngine" >
                        </el-table-column>
                        <el-table-column label="状态" prop="status" align="center" width="80" >
                            <template slot-scope="scope">
                                <div  v-if="scope.row.status == 1" class="status-div-create">部署中</div >
                                <div  v-else-if="scope.row.status == 5" class="status-div-deploy">运行中</div >
                                <div  v-else-if="scope.row.status == 10" class="status-div-stop">已停止</div >
                                <div  v-else-if="scope.row.status == -1" class="status-div-error">已失败</div >
                            </template>
                        </el-table-column>
                        <el-table-column label="部署时间" prop="deployTime" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right">
                            <template slot-scope="scope" >
                                <el-button
                                        v-if="scope.row.status != 5 "
                                        size="mini"
                                        type="primary"
                                        @click="startProgress(scope.row)"
                                        :disabled="scope.row.status == 1"
                                >
                                    启动
                                </el-button>
                                <el-button
                                        v-if="scope.row.status == 5"
                                        type="primary"
                                        size="mini"
                                        @click="dialogStop(scope.row)"
                                        :disabled="scope.row.status == 1"
                                >
                                    停止
                                </el-button>

                                <el-button
                                        type="primary"
                                        size="mini"
                                        @click="monitor(scope.row)"
                                        :disabled="scope.row.status == 1 "
                                >
                                    监控
                                </el-button>
                                <el-button
                                        type="primary"
                                        size="mini"
                                        @click="snapshot(scope.row)"
                                        :disabled="scope.row.status !== 5 "
                                >
                                    快照
                                </el-button>
                                <el-button
                                        type="danger"
                                        size="mini"
                                        @click="deleteProgress(scope.row)"
                                        :disabled="scope.row.status == 1 || scope.row.status == 5"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.total">
                    </el-pagination>
                </div>
            </template>
            <router-view></router-view>
            <el-dialog
                    :visible.sync="dialogStopProgressVisible"
                    :close-on-click-modal="false"
                    width="50%"
                    :modal-append-to-body="false"
                    title="停止任务"
            >
                <el-form v-loading="loadingStop" id="bm-stream-jobOpration-jobOpration-form">
                    <el-form-item  >
                        真的要停止此条任务？
                    </el-form-item>
                </el-form>
                <div slot="footer" >
                    <el-button type="primary" @click="stop()">确定</el-button>
                    <el-button @click="dialogStopProgressVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import {getProgressList, deleteProgress, startProgress, stopProgress, getAllocate, getSnapshot} from '@api'
    export default {
        data() {
            return {
                tableData:{},
                currentPage:1,
                limit:8,
                start: 0,
                loading: false,
                loadingStop: false,
                dialogStopProgressVisible: false,
                deleteRow: '',
            }
        },
        methods: {
            // 点击name,跳转到监控
            nameDitial: function (row) {
                //根据appId获取其他参数放入缓存中
                var appId = row.appInfo.appId
                this.loading = true;
                getAllocate(appId).then((res)=> {
                    this.loading = false;
                    this.$set(row.appInfo,'state', res.state)
                    this.$set(row.appInfo,'cpuCore', res.cpuCore)
                    this.$set(row.appInfo,'memory', res.memory)
                    //将传过来的row保存到session
                    sessionStorage.setItem("streamProgressRow", JSON.stringify(row));
                    //跳转到新的监控信息显示页面
                    this.$router.push({name:'stream任务监控'})
                },error=>{
                    this.loading = false;
                    this.$message({
                        type: error,
                        message: err.response.message,
                    })
                })
            },

            // 删除
            deleteProgress: function (row) {
                //添加询问
                this.$confirm('真的要删除?', '提示', {
                }).then(() => {
                    deleteProgress(row.id).then(res =>{
                        //刷新列表
                        this.getList(this.start, this.limit);
                    },error =>{
                        var err = error.response.data.err
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {

                });

            },

            // 启动progress
            startProgress: function (row) {
                this.$confirm('确定要启动'+row.name, '提示', {
                }).then(() =>{
                    startProgress(row.id).then(res =>{
                        this.$message({
                            message: '启动任务已提交成功！',
                            type: 'success',
                            duration: 1500
                        });
                        //刷新列表
                        this.getList(this.start, this.limit);
                    },error =>{
                        var err = error.response.data.err
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {

                });
            },

            //停用之前的弹框
            dialogStop: function (row) {
                this.dialogStopProgressVisible = true
                //将要删除消的息放入全局变量中
                this.deleteRow = row ;
            },

            //停止progress
            stop: function () {
                this.loadingStop = true;
                stopProgress(this.deleteRow.id, this.deleteRow).then(res => {
                    this.loadingStop = false;
                    this.dialogStopProgressVisible = false
                    //刷新列表
                    this.getList(this.start, this.limit);
                }, error => {
                    var err = error.response.data.err
                    this.loadingStop = false;
                    this.dialogStopProgressVisible = false
                    if(error.response.status == 500) {
                        this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },

            // 监控
            monitor:function (row) {
                //根据appId获取其他参数放入缓存中
                var appId = row.appInfo.appId
                this.loading = true;
                getAllocate(appId).then((res)=> {
                    this.loading = false;
                    this.$set(row.appInfo,'state', res.state)
                    this.$set(row.appInfo,'cpuCore', res.cpuCore)
                    this.$set(row.appInfo,'memory', res.memory)
                    //将传过来的row保存到session
                    sessionStorage.setItem("streamProgressRow", JSON.stringify(row));
                    //跳转到新的监控信息显示页面
                    this.$router.push({name:'stream任务监控'})
                },error=>{
                    this.loading = false;
                    this.$message({
                        type: error,
                        message: err.response.message,
                    })
                })
            },
            // 快照
            snapshot: function (row) {
                //将id拿回来之后就发送请求，弹出快照成功
                var jobId = row.id
                getSnapshot(jobId).then(res=>{
                    this.$message({
                        type:"success",
                        message:"快照已完成！"
                    })
                },err=>{
                    this.$message({
                        type:"error",
                        message:"快照失败！"
                    })
                })
            },
            // 列表
            getList: function (start, limit) {
                this.loading = true;
                start = start? start: this.start;
                limit = limit? limit: this.limit;
                getProgressList(start, limit).then(res =>{
                    //更新数据
                    this.tableData = res;
                    this.loading = false;
                },error =>{
                    var err = error.response.data.err
                    this.loading = false;
                    this.$message({
                        message: err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            //当前页展示条数
            handleSizeChange: function (size) {
                this.limit = size;
                this.start = (this.currentPage-1) * this.limit;
                this.getList(this.start,this.limit)
            },

            //当前页数
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage
                this.start = (this.currentPage-1) * this.limit;
                this.getList(this.start,this.limit)
            }
        },
        mounted() {
            //获取列表数据
            this.getList(this.start, this.limit);
        },
        watch: {
        }
    };

</script>

<style lang="scss" scoped>
    .el-table{
        float: left;
    }
    .synchronizationsBox{
        .btn-right{
            float: right;
        }
    }
    .dn-data{
        position: relative;
        .el-table{
            .editName{
                color: #2182e4;
                cursor: pointer
            }
            .editName:hover{
                text-decoration: underline;
            }
        }
    }
</style>
