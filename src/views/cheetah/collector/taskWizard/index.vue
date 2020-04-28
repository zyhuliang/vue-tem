<template>
    <!--向导的头部-->
    <div id='bm-ch-col-index-tmp' class="clearBx activePublic" v-loading="loading">
        <el-steps :active="step-1" class="step" finish-status="success" align-center>
            <el-step title="数据来源" description=""></el-step>
            <el-step title="数据目的" description=""></el-step>
            <el-step title="字段映射" description=""></el-step>
            <el-step title="任务设置" description=""></el-step>
            <el-step title="预览保存" description=""></el-step>
        </el-steps>
        <!--向导的内容区-->
        <transition name="fade" class="contentBorder">
            <router-view></router-view>
        </transition>
        <!--向导的底部按钮-->
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
    import {postSynchronizationTask, postCollectorTask, getTaskJson, editSynchronizationTask} from '@api';
    //taskEntity
    var defaultEntity = {
        id: "",
        name: "",
        dataSource: {
            id: "",// 来源数据的id
            name: "",// 来源数据的名称
            url: "",// 来源数据的路径
            dbType: "",// 来源数据的类型
            tableExt: "",// 来源数据的扩展表
            fetchSize: 0,// 来源数据的缓存大小
            queryTimeout: 0,// 来源数据的超时时间
        },
        schemaId: '',//元数据的id
        dataStore: {checksumColumn: ''},// 数据集结构
        fieldMapping: [{sourceField: "", sourceType: "", targetField: "", targetType: "", encrypt: ""}],//字段映射
        type: 'SyncDataTask',// 导入任务的类型
        mappingTarget: [],// 映射的目标字段
        mappingSource: [],// 映射的来源字段
        parallelism: "1",// 并行度
        trigger: "",// 执行周期
        cursorCol: "",// 增量字段
        errorNumber: "0", // 错误记录上限
        partitionKey: "", // 分区键
        stopOnSchemaChanged: false,// Schema发生改变后，此任务应该停止
        partitionPattern: "",// 分区键格式
        opts: '-Xss256k -Xms1G -Xmx1G -Xmn512M',// 执行参数
        collecterId: '', // 采集器的id
        bufferSize: 5000, //缓冲区大小
        flushPaddingTime: 30000,//延时刷出时间
        countCheckField: 0,//判断字段映射的字段是否添加校验
        hasCheckSum: 0,//是否存在校验和
    }
    var entity = defaultEntity

    export default {
        name: 'taskWizard',
        data: function () {
            return {
                loading: false,
                isRouter: false,
                cancel: true,
                preStep: false,
                nextStep: false,
                publish: false,
                step: 1
            }
        },
        methods: {
            //上一步
            handlePreStep: function () {
                if (this.step > 1) {
                    this.$router.go(-1);
                    this.step--;
                    this.goStep(this.step);
                }
            },
            //下一步
            handleNextStep: function () {
                this.$router.push('/taskWizard/step' + (this.step + 1) + '/' + entity.collecterId + '/' + entity.resourceId);
            },
            //整理数据
            formatData: function () {
                if (localStorage.taskEntity) {
                    //获取全局的entity,并且变成json
                    var entity = JSON.parse(localStorage.taskEntity);
                }
                if (entity.dataSource.type == 'DB') entity.dataSource.type = 'JDBC'
                //将不需要提交的数据去掉
                delete entity.mappingTarget
                delete entity.mappingSource
                delete entity.isCopy
                this.jobId = entity.jobId
                delete entity.jobId
                delete entity.hasCheckSum
                delete entity.countCheckField
                //判断是不是编辑任务，不是再区分采集器任务，调用采集器任务api接口
                var postTask = this.jobId ? editSynchronizationTask(this.jobId, entity) : entity.collecterId != 'WOVEN-SERVER' ? postCollectorTask(entity.collecterId, entity) : postSynchronizationTask(entity);
                //调用提交接口，并刷新页面
                this.loading = true;
                postTask.then(res => {
                    this.loading = false;
                    if (entity.collecterId == 'WOVEN-SERVER') {
                        this.$router.push('/synchronization');
                        task.$emit('refreshSynchronizationList')
                    } else {
                        this.$router.push('/collector/' + entity.collecterId + '/taskList' + '/' + entity.resourceId);
                        task.$emit('refreshCollectorList')
                    }
                    this.$message({
                        message: '提交成功！',
                        type: 'success'
                    })
                }, function (err) {
                    this.loading = false;
                    var error = error.indexOf("Duplicate") > -1 ? '此名称已被占用！' : err.response.data.err
                    this.$message({
                        message: error,
                        type: 'error'
                    })
                })
            },
            //完成
            handlePublish: function () {
                //提交前的数据整理
                this.formatData();
            },
            //取消
            handleCancel: function () {
                if (entity.collecterId == 'WOVEN-SERVER')
                    this.$router.push('/synchronization');
                else this.$router.push('/collector/' + entity.collecterId + '/taskList' + '/' + entity.resourceId);
            },
            //跳转时按钮的状态
            goStep: function (n) {
                //向导下面的按钮是否可以点击，2，3，4状态一致
                switch (n) {
                    case 1 :
                        this.preStep = false;
                        this.nextStep = true;
                        this.publish = false;
                        this.cancel = true;
                        break;
                    case 2 :
                    case 3 :
                    case 4 :
                        this.preStep = true;
                        this.nextStep = true;
                        this.publish = false;
                        this.cancel = true;
                        break;
                    case 5 :
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
            //获取collector的id
            var para = window.location.href.split('/')
            entity.collecterId = para[para.length - 2]
            entity.resourceId = para[para.length - 1]
            //如果是复制，就要获取entity
            if (localStorage.taskEntity && JSON.parse(localStorage.taskEntity)['isCopy']) {
                var id = JSON.parse(localStorage.taskEntity).id
                this.jobId = JSON.parse(localStorage.taskEntity).jobId;
                this.loading = true;
                getTaskJson(id).then(data => {
                    this.loading = false;
                    if (data) {
                        entity = data;
                        //获取collector的id
                        var para = window.location.href.split('/')
                        entity.collecterId = para[para.length - 2]
                        entity.resourceId = para[para.length - 1]
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
                        entity.type = 'SyncDataTask'
                        //兼容以前的版本，添加opts字段
                        entity.opts = entity.opts ? entity.opts : '-Xss256k -Xms1G -Xmx1G -Xmn512M'
                        //兼容以前的版本，添加缓冲区大小字段
                        entity.bufferSize = entity.bufferSize ? entity.bufferSize : 5000
                        //兼容以前的版本，添加延时刷出时间字段
                        entity.flushPaddingTime = entity.flushPaddingTime ? entity.flushPaddingTime : 30000
                        localStorage.taskEntity = JSON.stringify(entity);
                        //如果是采集器就跳转到采集器的向导
                        this.$router.push('/taskWizard/step1/' + entity.collecterId + '/' + entity.resourceId);
                    }
                }, err => {
                    this.loading = false;
                    this.message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    })
                })
            } else {
                //新建的采集任务，初始化entity
                entity = defaultEntity;
                //获取collector的id
                var para = window.location.href.split('/')
                entity.collecterId = para[para.length - 2]
                entity.resourceId = para[para.length - 1]
                //初始化entity放入缓存
                entity.isCopy = false
                localStorage.taskEntity = JSON.stringify(entity);
                this.$router.push('/taskWizard/step1/' + entity.collecterId + '/' + entity.resourceId);
            }
            //校验name是否存在的方法
            task.$on('taskNameNextStep', (step) => {
                this.goStep(1)
            })
            //在下一步时候如果验证没通过还在此页面
            task.$on('taskNextStep', (step) => {
                this.step = step * 1
                this.goStep(this.step)
                this.$router.push('/taskWizard/step' + (this.step) + '/' + entity.collecterId + '/' + entity.resourceId);
            })
        },
        watch: {
            '$route': function (to, from) {
                this.step = window.location.hash.charAt(window.location.hash.indexOf('taskWizard/step') + 15) * 1
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
