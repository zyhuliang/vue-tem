<!-- steps参数 dataFlow Process hawq -->
<template>
        <div>
                <el-form id="bm-nodeset-hawq-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'workingDiretory'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'workingDiretory'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.workingDiretory" placeholder="（必填）" @input="workingDiretoryVal" name="workingDiretory"></el-input>
                        </el-form-item>
                        <el-form-item :label="'hawq_cmd'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'hawq_cmd'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.hawq_cmd" placeholder="（必填）" @input="hawq_cmdVal" name="cmdVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'host'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'host'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.host" placeholder="（必填）" @input="hostVal" name="hostVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'port'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'port'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.port" placeholder="（必填）" @input="portVal" name="portVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'user'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'user'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.user" placeholder="（必填）" @input="userVal" name="userVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'database'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'database'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.database" placeholder="（必填）" @input="databaseVal" name="databaseVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'logFile'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'logFile'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.logFile" placeholder="（必填）" @input="logFileVal" name="logFileVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'sql'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'sql'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input class="nodeTextArea" :value="nodeData.sql" placeholder="（必填）" type="textarea" @input="sqlVal" name="sqlVal"></el-input>
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
             * hawq_cmd 绑定获取值
             * ------------------------------------------------------------------
             */
            hawq_cmdVal : function (val) {
                this.nodeData.hawq_cmd = val;
            },
            /**
             * host 绑定获取值
             * ------------------------------------------------------------------
             */
            hostVal : function (val) {
                this.nodeData.host = val;
            },
            /**
             * port 绑定获取值
             * ------------------------------------------------------------------
             */
            portVal : function (val) {
                this.nodeData.port = val;
            },
            /**
             * user 绑定获取值
             * ------------------------------------------------------------------
             */
            userVal : function (val) {
                this.nodeData.user = val;
            },
            /**
             * database 绑定获取值
             * ------------------------------------------------------------------
             */
            databaseVal : function (val) {
                this.nodeData.database = val;
            },
            /**
             * logFile 绑定获取值
             * ------------------------------------------------------------------
             */
            logFileVal : function (val) {
                this.nodeData.logFile = val;
            },
            /**
             * sql 绑定获取值
             * ------------------------------------------------------------------
             */
            sqlVal : function (val) {
                this.nodeData.sql = val;
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