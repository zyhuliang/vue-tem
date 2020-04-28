<!-- steps参数 dataFlow Process mapreduce -->
<template>
        <div>
                <el-form id="bm-nodeset-mapreduce-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'workingDiretory'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'workingDiretory'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.workingDiretory" placeholder="（必填）" @input="workingDiretoryVal" name="workingDiretoryVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'hadoop_cmd'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'hadoop_cmd'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.hadoop_cmd" placeholder="（必填）" @input="hadoop_cmdVal" name="cmdVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'jarFile'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'jarFile'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.jarFile" placeholder="（必填）" @input="jarFileVal" name="jarFileVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'logFile'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'logFile'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.logFile" placeholder="（必填）" @input="logFileVal" name="logFileVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'program'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'program'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.program" placeholder="（必填）" @input="programVal" name="programVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'arguments'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'arguments'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input class="nodeTextArea" :value="nodeData.arguments" placeholder="（必填）" type="textarea" @input="argumentsVal" name="argumentsVal"></el-input>
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
                nodeData:{}, //存放节点参数
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
             * hadoop_cmd 绑定获取值
             * ------------------------------------------------------------------
             */
            hadoop_cmdVal : function (val) {
                this.nodeData.hadoop_cmd = val;
            },
            /**
             * jarFile 绑定获取值
             * ------------------------------------------------------------------
             */
            jarFileVal : function (val) {
                this.nodeData.jarFile = val;
            },
            /**
             * logFile 绑定获取值
             * ------------------------------------------------------------------
             */
            logFileVal : function (val) {
                this.nodeData.logFile = val;
            },
            /**
             * program 绑定获取值
             * ------------------------------------------------------------------
             */
            programVal : function (val) {
                this.nodeData.program = val;
            },
            /**
             * arguments 绑定获取值
             * ------------------------------------------------------------------
             */
            argumentsVal : function (val) {
                this.nodeData.arguments = val;
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