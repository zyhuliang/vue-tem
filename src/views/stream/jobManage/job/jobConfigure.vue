<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <div class="form-center">
                <el-form :model="entity" ref="entity" class="job-configure-form" label-position="right">
                    <div class="other-field">
                        <el-form-item prop="name" label="名称" :label-width="formLabelWidth" required>
                            <el-input v-model="entity.name" required  class="el-input-form">

                            </el-input>
                        </el-form-item>
                        <el-form-item prop="desc" label="描述" :label-width="formLabelWidth" >
                            <el-input v-model="entity.note" required  class="el-input-form">
                            </el-input>
                        </el-form-item>
                    </div>

                    <!--是否可以操作-->
                    <fieldset class="checkpoint-fieldset" align="center">
                        <legend class="checkpoint-legend">检查点</legend>

                        <el-form-item label="开启" class="form-item-style">
                            <el-tooltip effect="dark" content="limit 类型，默认值行数" placement="top-start">
                                <el-switch
                                        v-model="entity.jobDesc.settings['streaming.flink.checkpoint.enabled']"
                                        class="switch-style">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="间隔时间(毫秒)" v-if="entity.jobDesc.settings['streaming.flink.checkpoint.enabled']" :label-width="formLabelWidth">
                            <el-input v-model="entity.jobDesc.settings['streaming.flink.checkpoint.interval.ms']" required  class="el-input-form">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="模式" v-if="entity.jobDesc.settings['streaming.flink.checkpoint.enabled']" :label-width="formLabelWidth">
                            <el-select v-model="entity.jobDesc.settings['streaming.flink.checkpoint.mode']" placeholder="请选择" class="el-input-form">
                                <el-option
                                        v-for="item in checkpointModeArray"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </fieldset>

                    <!--是否可以操作-->
                    <fieldset class="checkpoint-fieldset" align="center">
                        <legend class="checkpoint-legend">失败重试</legend>
                        <el-form-item label="开启" class="form-item-style">
                            <el-tooltip effect="dark" content="limit 类型，默认值行数" placement="top-start">
                                <el-switch
                                        v-model="entity.jobDesc.settings['streaming.flink.restartAttempts.enabled']"
                                        class="switch-style">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="间隔时间(秒)" v-if="entity.jobDesc.settings['streaming.flink.restartAttempts.enabled']" :label-width="formLabelWidth">
                            <el-input v-model="entity.jobDesc.settings['streaming.flink.restartAttempts.delayInterval.sec'] " required  class="el-input-form">
                            </el-input>
                        </el-form-item>

                        <el-form-item label=" 重试次数" v-if="entity.jobDesc.settings['streaming.flink.restartAttempts.enabled']" :label-width="formLabelWidth">
                            <el-input v-model="entity.jobDesc.settings['streaming.flink.restartAttempts.num']" required  class="el-input-form">
                            </el-input>
                        </el-form-item>
                    </fieldset>

                    <!--是否可以操作-->
                    <fieldset class="checkpoint-fieldset" align="center">
                        <legend class="checkpoint-legend">状态存储</legend>

                        <el-form-item label="开启" class="form-item-style">
                            <el-tooltip effect="dark" content="limit 类型，默认值行数" placement="top-start">
                                <el-switch
                                        v-model="entity.jobDesc.settings['streaming.flink.state.backend.enabled']"
                                        class="switch-style">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="模式" v-if="entity.jobDesc.settings['streaming.flink.state.backend.enabled']" :label-width="formLabelWidth">
                            <el-select v-model="entity.jobDesc.settings['streaming.flink.state.backend.mode']" placeholder="请选择" class="el-input-form">
                                <el-option
                                        v-for="item in statusMemoryModeArray"
                                        :key="item.value"
                                        :label="item.lable"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </fieldset>

                    <!--是否允许延迟-->
                    <fieldset class="checkpoint-fieldset" align="center">
                        <legend class="checkpoint-legend">允许延迟</legend>

                        <el-form-item label="开启" class="form-item-style">
                            <el-tooltip effect="dark" content="limit 类型，默认值行数" placement="top-start">
                                <el-switch
                                        v-model="entity.jobDesc.settings['streaming.flink.maxOutOfOrderness.enabled']"
                                        class="switch-style">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="最大延时(秒)" v-if="entity.jobDesc.settings['streaming.flink.maxOutOfOrderness.enabled']" :label-width="formLabelWidth">
                            <el-input v-model="entity.jobDesc.settings['streaming.flink.maxOutOfOrderness.ms'] " required  class="el-input-form">
                            </el-input>
                        </el-form-item>
                    </fieldset>

                    <!--是否可以延迟-->
                    <fieldset class="checkpoint-fieldset" align="center">
                        <legend class="checkpoint-legend">延迟追踪</legend>

                        <el-form-item label="开启" class="form-item-style">
                            <el-tooltip effect="dark" content="limit 类型，默认值行数" placement="top-start">
                                <el-switch
                                        v-model="entity.jobDesc.settings['streaming.flink.latency.tracking.enabled']"
                                        class="switch-style">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="延迟时间(秒)" v-if="entity.jobDesc.settings['streaming.flink.latency.tracking.enabled']" :label-width="formLabelWidth">
                            <el-input v-model="entity.jobDesc.settings['streaming.flink.latency.tracking.interval.ms'] " required  class="el-input-form">
                            </el-input>
                        </el-form-item>
                    </fieldset>
                </el-form>
                <!--保存取消按钮-->
            </div>
            <div class="buttonJob">
                <el-button type="primary" @click="save()" >保存</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>

        </div>
    </section>
</template>
<script>
    import {getJobList, getJob, deleteJob, postJob, stopJob, deployJob} from '@api'
    export default {
        components: {},
        data() {
            return {
                formLabelWidth: '100px',
                entity: {
                    name: '',
                    type: '',
                    desc: '',
                    jobDesc: {
                        settings: {
                            'streaming.flink.checkpoint.enabled': true,
                            'streaming.flink.checkpoint.interval.ms': '5000',
                            'streaming.flink.checkpoint.mode': "",
                            'streaming.flink.restartAttempts.enabled': true,
                            'streaming.flink.restartAttempts.delayInterval.sec': '30',
                            'streaming.flink.restartAttempts.num': "1",
                            'streaming.flink.state.backend.enabled': true,
                            'streaming.flink.state.backend.mode': 'memory',
                        }
                    }
                },
                checkpointModeArray:['AT_LEAST_ONCE','EXACTLY_ONCE'],
                statusMemoryModeArray:[{lable: "内存", value:"memory"} ,{lable: "RocksDB", value:"rocksdb"} ,{lable: "文件系统", value:"fs"} ],
            }
        },
        methods: {
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        //querySql如果不是数组就要转换成数组
                        var sqlIsArray = Array.prototype.isPrototypeOf(this.entity.jobDesc.querySql)
                        if(!sqlIsArray && this.entity.jobDesc.tableProfiles){
                            var arrSql = this.entity.jobDesc.querySql.split(';')
                            var index = arrSql.indexOf('')
                            if(index>-1){
                                arrSql = arrSql.splice(index,1)
                            }
                            this.entity.jobDesc.querySql = arrSql
                        }
                        // 调接口提交job
                        postJob(this.entity).then(res => {
                            this.$router.push({path: '/jobManage'})
                        }, error => {
                            var err = error.response.data.err
                            if(err.indexOf('duplicate') >-1){
                                err = '此名称已存在!'
                            }
                            if(error.response.status == 500) {
                                this.$message({
                                    message: err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            cancel: function () {
                // 路由跳转到列表页
                this.$router.push({path: '/jobManage'})
            },
        },
        beforeDestroy () {
            //在切换之前将此次修改同步到session中
            sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
        },

        mounted() {
            this.entity =JSON.parse(sessionStorage.getItem('streamJobEntity'));
        },
        watch:{
        }
        
    }

</script>

<style scoped lang="scss">
    .qa-content{
        text-align: center;
        width: 100%;
        .form-center{
            text-align: center;
            width: 100%;
            .job-configure-form{
                margin-left: calc((100vw - 540px)/2);
                height: calc(100vh - 152px);
                position: absolute;
                margin-top: 10px;
                padding: 20px 0 10px 0;
                overflow-y: auto;
                .other-field{
                    width: 280px;
                    min-width: 540px;
                    margin-right: calc((100vw - 580px)/2);
                    padding: 10px 20px 10px 20px;
                }
                .el-input-form{
                    width: 280px;
                }
                .form-item-style {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .switch-style{
                    width: inherit;
                    float: left;
                }
                .executingDetail{
                    padding: 10px;
                }
                .checkpoint-fieldset{
                    .checkpoint-legend{
                        font-size: 14px;
                        color: #606266;
                        font-style: italic;
                        padding: 10px;
                    }
                    border: 1px solid #d8dce0;
                    width: 280px;
                    min-width: 540px;
                    margin-right: calc((100vw - 580px)/2);
                    padding: 10px 20px 10px 20px;
                }
            }
        }
        .buttonJob{
            position: absolute;
            bottom: 2%;
            padding-top: 10px;
            text-align: center;
            width: 100%;
        }
    }

</style>