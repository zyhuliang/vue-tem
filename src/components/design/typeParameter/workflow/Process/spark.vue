<!-- steps参数 dataFlow Process spark -->
<template>
        <div>
                <el-form id="bm-nodeset-spark-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'workingDiretory'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'workingDiretory'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.workingDiretory" placeholder="（必填）" @input="workingDiretoryVal" name="workingDiretoryVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'logFile'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'logFile'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.logFile" placeholder="（必填）" @input="logFileVal" name="logFileVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'sparkHome'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'sparkHome'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.sparkHome" placeholder="（必填）" @input="sparkHomeVal" name="sparkHomeVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'master'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'master'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.master" placeholder="（必填）" @input="masterVal" name="masterVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'deploymode'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'deploymode'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.deploymode" placeholder="（必填）" @input="deploymodeVal" name="deploymodeVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'applicationJar'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'applicationJar'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.applicationJar" placeholder="（必填）" @input="applicationJarVal" name="applicationJarVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'applicationClass'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'applicationClass'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.applicationClass" placeholder="（必填）" @input="applicationClassVal" name="applicationClassVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'applicationArgs'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'applicationArgs'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.applicationArgs" placeholder="（必填）" @input="applicationArgsVal" name="applicationArgsVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'queue'| cn">
                                <el-tooltip  class="item" effect="dark" content="队列名称" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.queue" placeholder="（必填）" @input="queueVal" name="queueVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'driverMemory'| cn">
                                <el-tooltip  class="item" effect="dark" content="driver内存" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.driverMemory" placeholder="（必填）" @input="driverMemoryVal" name="driverMemoryVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'executorMemory'| cn">
                                <el-tooltip  class="item" effect="dark" content="executor内存" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.executorMemory" placeholder="（必填）" @input="executorMemoryVal" name="executorMemoryVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'numExecutors'| cn">
                                <el-tooltip  class="item" effect="dark" content="executor个数" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.numExecutors" placeholder="（必填）" @input="numExecutorsVal" name="numExecutorsVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'executorCores'| cn">
                                <el-tooltip  class="item" effect="dark" content="每个executor核心数" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.executorCores" placeholder="（必填）" @input="executorCoresVal" name="executorCoresVal"></el-input>
                        </el-form-item>
                </el-form>
        </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},  //存放节点参数
            }
        },
        props:["nodeSetData"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * workingDiretory 绑定获取值
             * ------------------------------------------------------------------
             */
            workingDiretoryVal : function (val) {
                this.nodeData.workingDiretory = val;
            },
            /**
             * logFile 绑定获取值
             * ------------------------------------------------------------------
             */
            logFileVal : function (val) {
                this.nodeData.logFile = val;
            },
            /**
             * sparkHome 绑定获取值
             * ------------------------------------------------------------------
             */
            sparkHomeVal : function (val) {
                this.nodeData.sparkHome = val;
            },
            /**
             * master 绑定获取值
             * ------------------------------------------------------------------
             */
            masterVal : function (val) {
                this.nodeData.master = val;
            },
            /**
             * deploymode 绑定获取值
             * ------------------------------------------------------------------
             */
            deploymodeVal : function (val) {
                this.nodeData.deploymode = val;
            },
            /**
             * application-jar 绑定获取值
             * ------------------------------------------------------------------
             */
            applicationJarVal : function (val) {
                this.nodeData.applicationJar = val;
            },
            /**
             * application-class 绑定获取值
             * ------------------------------------------------------------------
             */
            applicationClassVal : function (val) {
                this.nodeData.applicationClass = val;
            },
            /**
             * application-args 绑定获取值
             * ------------------------------------------------------------------
             */
            applicationArgsVal : function (val) {
                this.nodeData.applicationArgs = val;
            },
            queueVal : function (val) {
                this.nodeData.queue = val;
            },
            driverMemoryVal:function(val) {
                this.nodeData.driverMemory = val;
            },
            executorMemoryVal:function (val) {
               this.nodeData.executorMemory = val;
            },
            numExecutorsVal:function (val) {
                this.nodeData.numExecutors = val;
            },
            executorCoresVal:function (val) {
                this.nodeData.executorCores = val;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;

            console.log(this.nodeData);
        }
    }

</script>

<style scoped>

</style>