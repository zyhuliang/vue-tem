<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <el-row class="btnClass">
                <div class="btn-right">
                    <el-button type="info" @click="changeLogType()"><i class="icon iconfont icon-ir-operation"></i>刷新</el-button>
                </div>
                <div class="btn-left">
                    <el-select  v-model="logTag"  @change="changeLogType()">
<!--                        获取flink的job和task的id-->
<!--                        v-for="item in logTags"-->
                        <el-option
                                v-for="item in ['launcher']"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>

            </el-row>

            <div v-loading="loading" class="div-log" id="bm-stream-jobOpration-monitor-log-form">
                <pre v-if="hasLogs" >{{logs}}</pre>
<!--                <div v-if="hasLogs" v-model="logs"  v-for="(log) in logs " > <pre>{{log}}</pre> </div>-->
                <div v-if="!hasLogs"  class="log-content"> <div class="log-content-error">{{errorlogs}}</div></div>
            </div>
        </div>
    </section>
</template>
<script>
    import {logProgress, getTaskManager, getTaskManagerLog, getJobManagerLog } from '@api'
    export default {
        components: {},
        data() {
            return {
                logTags: ['launcher', 'jobmanager'],
                logTag: 'launcher',
                appId:'',
                jobProgressId:'',
                start: 0,
                limit: 100000,
                logs:[],
                loading: false,
                hasLogs: false,
                errorlogs: '暂无数据'
            }
        },
        methods: {
            //点击类型切换日志
            changeLogType(){
                var logType = this.logTag
                this.loading = true
                if(logType == 'jobmanager'){
                    getJobManagerLog(this.appId).then(res => {
                        //获取到log
                        this.loading = false;
                        if(res.length > 0 ){
                            this.hasLogs = true
                            this.logs = res
                        }else this.hasLogs = false
                    }, err => {
                        this.loading = false
                        this.$message({
                            type: "error",
                            message: "获取数据失败"
                        })
                    })
                }else if(logType.indexOf('taskmanager') > -1 ){
                    var taskId = logType.split('-')[1];
                    getTaskManagerLog(this.appId, taskId).then(res => {
                        //获取到log
                        this.loading = false;
                        if(res.length > 0 ){
                            this.hasLogs = true
                            this.logs = res
                        }else this.hasLogs = false
                    }, err => {
                        this.loading = false
                        this.$message({
                            type: "error",
                            message: "获取数据失败"
                        })
                    })
                }else if(logType == 'launcher'){
                    this.loading = true;
                    logProgress(this.jobProgressId, this.logTag, this.start, this.limit).then((res) => {
                        this.loading = false;
                        if(res.length > 0 ){
                            this.hasLogs = true
                            this.logs = res
                        }else this.hasLogs = false
                    },err =>{
                        this.loading = false;
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
        },
        created(){
            var row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
            this.jobProgressId = row.id
            /*this.appId = row.appInfo.appId
            this.logTags = ['launcher', 'jobmanager']
            this.loading = true
            getTaskManager(this.appId).then(res => {
                //获取到log
                res.taskmanagers.forEach(item=>{
                    this.logTags.push('taskmanager-' + item.id)
                })
                this.loading = false
            }, err => {
                this.loading = false
                this.$message({
                    type: "error",
                    message: "获取数据失败"
                })
            })*/
            this.changeLogType();
        }
    }

</script>

<style scoped lang="scss">
    .div-log {
        border: 1px solid #c2c9ca;
        height: calc(100vh - 167px);
        overflow-y: auto;
        margin: 10px;
        .log-content{
            .log-content-error {
                color:#cccccc;
                text-align: center;
                margin-top: calc((100vh - 400px) / 2);
            }
        }

    }

</style>
