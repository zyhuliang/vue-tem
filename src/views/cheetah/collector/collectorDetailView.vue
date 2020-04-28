<template>
    <section class="con-module" id='bm-ch-col-detailView-tmp'>
        <el-row class="btnClass"></el-row>
        <el-row class="rf-swap">
            <el-col :span="12">
                <el-form id="bm-collector-view-form" :model="viewForm" :label-position="labelPosition" status-icon
                         ref="viewForm" label-width="100px" class=" demo-ruleForm">
                    <el-form-item label="主键" prop="id">
                        <el-input type="text" v-model="viewForm.id" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>

                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="viewForm.name" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="ip">
                        <el-input type="text" v-model="viewForm.ip" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>

                    <el-form-item label="运行状态" prop="viewStatus">
                        <el-input type="text" v-model="viewForm.status" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="内存" prop="memory">
                        <el-input type="text" v-model="viewForm.memory" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="处理器" prop="cpu">
                        <el-input type="text" v-model="viewForm.cpu" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="磁盘" prop="disk">
                        <el-input type="text" v-model="viewForm.disk" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="工具包版本" prop="jdk">
                        <el-input type="text" v-model="viewForm.jdk" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startedTime">
                        <el-input type="text" v-model="viewForm.startedTime" :readonly=true auto-complete="off"
                                  disabled></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <div style="margin-left: 30px;">
                    <el-container class="containerLog">
                        <el-header class="headerLog">日志信息--
                            <el-button type="text" @click=refreshLog()>刷新日志</el-button>
                        </el-header>
                        <el-main>
                            <div v-model="log" style="padding-top:5px;padding-bottom:2px" v-for="loga in log ">
                                {{loga}}
                            </div>
                        </el-main>
                    </el-container>
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {createCollector, getCollectorDetialView, getCollectorDetialLog, updataCollector} from '@api'

    export default {
        data() {
            return {
                log: [],
                platforms: ['linux', 'windows'],
                selecteds: ['1.0'],
                labelPosition: 'top',
                collectorId: "",
                viewForm: {
                    id: "",
                    name: '',
                    ip: '',
                    viewStatus: 'linux',
                    memory: '',
                    cpu: '',
                    disk: '1.0',
                    jsk: '1.0',
                    startedTime: '1.0',
                },
            };
        },
        methods: {
            //获取采集器详情信息放入表单展示
            getCollectorDetail: function () {
                getCollectorDetialView(this.collectorId).then((res) => {
                    this.viewForm = res;
                }, error => {
                    if (error.response.status == 500) {
                        _this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            refreshLog: function () {
                //刷新日志
                getCollectorDetialLog(this.collectorId).then((res) => {
                    this.log = res;
                }, error => {
                    if (error.response.status == 500) {
                        _this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
        },
        mounted() {
            this.collectorId = this.$route.params.id
            this.getCollectorDetail(this.collectorId);
            this.refreshLog();
        },
    }
</script>

<style scoped>
    .containerLog {
        border: 1px solid #eee;
        height: 800px;
    }

    .containerLog .headerLog {
        text-align: center;
        font-size: 16px;
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .demo-ruleForm {
        width: 100%;
    }
</style>