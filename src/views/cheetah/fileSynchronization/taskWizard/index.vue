<template>
    <!--向导的头部-->
    <div class="clearBx activePublic" id='bm-ch-filesys-index-tmp'>
        <el-steps :active="step-1" class="step" finish-status="success" align-center>
            <el-step title="数据来源" description=""></el-step>
            <el-step title="数据目的" description=""></el-step>
            <el-step title="任务设置" description=""></el-step>
            <el-step title="保存预览" description=""></el-step>
        </el-steps>
        <!--向导的内容区-->
        <transition name="fade" class="contentBorder">
            <router-view class="view"></router-view>
        </transition>
        <!--向导的底部按钮-->
        <!--<div class="but-group">-->
        <div align="center" class="cb-footer">
            <el-button @click.native.prevent="handlePreStep" :disabled=!preStep type="primary">上一步</el-button>
            <el-button @click.native.prevent="handleNextStep" :disabled=!nextStep type="primary">下一步</el-button>
            <el-button @click.native.prevent="handlePublish" :disabled=!publish>完成</el-button>
            <el-button @click.native.prevent="handleCancel" :disabled=!cancel>取消</el-button>
        </div>
    </div>
</template>

<script>
    import task from '@jsTask/taskStep.js';
    import {postSynchronizationTask, getTaskJson, editSynchronizationTask} from '@api';
    //taskEntity
    var entity = {
        id: "",
        name: "",
        dataSource: {
            id: "",
            name: "",
            url: "",
            dbType: "",
            tableExt: ""
        },
        dataStore: {},
        fieldMapping: [{sourceField: "", sourceType: "", targetField: "", targetType: "", encrypt: ""}],
        type: 'SyncDataTask',
        mappingTarget: [],
        mappingSource: [],
        parallelism: "1",
        trigger: "",
        cursorCol: "",
        errorNumber: "0",
        partitionKey: "",
        stopOnSchemaChanged: false,
        partitionPattern: "",
        collecterId: '',
        type: "SyncFileTask"
    }
    var defaultEntity = entity;
    export default {
        name: 'taskWizard',
        data: function () {
            return {
                isRouter: false,
                cancel: true,
                preStep: false,
                nextStep: false,
                publish: false,
                step: 1
            }
        },
        methods: {
//            上一步
            handlePreStep: function () {
                this.$router.go(-1);
                this.step--;
                this.goStep(this.step);
            },
//            下一步
            handleNextStep: function () {
                this.$router.push('/fileTaskWizard/step' + (this.step + 1));
            },
            //整理数据
            formatData: function () {
                if (localStorage.taskEntity) {
                    //获取全局的entity,并且变成json
                    var entity = JSON.parse(localStorage.taskEntity);
                }
                if (entity.dataSource.type == 'DB') entity.dataSource.type = 'JDBC'
                console.log(JSON.stringify(entity))
                //将不需要提交的数据去掉
                delete entity.mappingTarget
                delete entity.mappingSource
                delete entity.isCopy
                entity.type = "SyncFileTask"
                this.jobId = entity.jobId
                delete entity.jobId
                //判断是不是编辑任务，不是再区分采集器任务，调用采集器任务api接口
                var postTask = this.jobId ? editSynchronizationTask(this.jobId, entity) : postSynchronizationTask(entity)
                //调用提交接口
                var _this = this
                postTask.then(res => {
                    _this.$router.push('/fileSynchronization');
                    task.$emit('refreshFileSynchronizationList')
                    _this.$message({
                        message: '提交成功！',
                        type: 'success'
                    })
                }, err => {
                    if (err.response) {
                        if (err.response.data.err.indexOf("Duplicate")) {
                            _this.$message({
                                message: "任务名已存在",
                                type: 'error'
                            });
                        }
                    }
                }).catch(function (error) {
                    if (error.response) {
                        if (error.response.data.err.indexOf("Duplicate")) {
                            _this.$message({
                                message: "任务名已存在",
                                type: 'error'
                            });
                        }
                    }
                });
            },
//            完成
            handlePublish: function () {
                //提交前的数据整理
                this.formatData();
                console.log('提交');
            },
//            取消
            handleCancel: function () {
                this.$router.push('/fileSynchronization');
                console.log('取消');
            },
//            跳转时按钮的状态
            goStep: function (n) {
                switch (n) {
                    case 1 :
                        this.preStep = false;
                        this.nextStep = true;
                        this.publish = false;
                        this.cancel = true;
                        break;
                    case 2 :
                        this.preStep = true;
                        this.nextStep = true;
                        this.publish = false;
                        this.cancel = true;
                        break;
                    case 3 :
                        this.preStep = true;
                        this.nextStep = true;
                        this.publish = false;
                        this.cancel = true;
                        break;
                    case 4 :
                        this.preStep = true;
                        this.nextStep = false;
                        this.publish = true;
                        this.cancel = true;
                        break;
                }
            }
        },
        beforeCreate() {
            if (localStorage.taskEntity && !JSON.parse(localStorage.taskEntity).isCopy) {
                localStorage.taskEntity = JSON.stringify(defaultEntity);
            }
        },
        mounted() {
            var that = this;
            //获取collector的id
            var arr = window.location.href.split('/')
            entity.collecterId = arr[arr.length - 1]
            /* //初始化entity放入缓存
             localStorage.taskEntity = JSON.stringify(entity);*/
            //如果是复制，就要获取entity
            if (localStorage.taskEntity && JSON.parse(localStorage.taskEntity)['isCopy']) {
                var id = JSON.parse(localStorage.taskEntity).id
                this.jobId = JSON.parse(localStorage.taskEntity).jobId;
                getTaskJson(id).then(data => {
                    if (data) {
                        entity = data;
                        entity.isCopy = true
                        //添加数据源和数据集的数组字段
                        entity.mappingTarget = []
                        entity.mappingSource = []
                        //更改name，防止重名
                        if (this.jobId == undefined && entity.name !== '') {
                            entity.name = entity.name + '_copy' + new Date().toISOString()
                        } else if (this.jobId != undefined) {
                            entity.jobId = this.jobId
                        }
                        //将类型改变
                        entity.type = 'SyncFileTask'
                        localStorage.taskEntity = JSON.stringify(entity);
                        that.$router.push('/fileTaskWizard/step1');
                    }
                }, error => {
                    this.message({
                        message: "获取数据失败" + error,
                        type: 'error'
                    })
                })
            } else {
                //初始化entity放入缓存
                entity.isCopy = false
                localStorage.taskEntity = JSON.stringify(defaultEntity);
                that.$router.push('/fileTaskWizard/step1');
            }
            //校验name是否存在的方法
            task.$on('fileTaskNameNextStep', (step) => {
                that.goStep(1)
            })
            //在下一步时候如果验证没通过还在此页面
            task.$on('fileTaskNextStep', (step) => {
                that.step = step * 1
                that.goStep(that.step)
                that.$router.push('/fileTaskWizard/step' + (that.step));
            })
        },
        watch: {
            '$route': function (to, from) {
                this.step = window.location.hash.charAt(window.location.hash.indexOf('fileTaskWizard/step') + 19) * 1
                this.goStep(this.step);
            }
        }
    }

</script>
<style lang="scss" scoped>
    .clearBx {
        position: absolute;
        background-color: #fff;
        width: 100%;
        height: 100%;
        padding: 20px 10px 10px 10px;
        top: 0px;
        box-sizing: border-box;
        z-index: 100;
        .cb-header {
            top: 10px;
        }
        .activePublic .router-link {
            color: #fff;
        }
        .activePublic .contentBorder {
            border: 1px solid #eee;
            min-height: 540px;
            text-align: center;
            font-size: 16px;
            background-color: #B3C0D1;
            color: #333;
            line-height: 60px;
        }
        .activePublic .but-group .el-button {
            margin-right: 20px;
        }
        .cb-footer {
            margin: 10px 0 0 0;
        }

    }
</style>
