<!-- steps参数 dataFlow Process hive -->
<template>
        <div>
                <el-form id="bm-nodeset-hive-form" ref="hiveForm" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'workingDiretory'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'workingDiretory'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.workingDiretory" placeholder="（必填）" @input="workingDiretoryVal" name="workingDiretoryVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'hive_cmd'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'hive_cmd'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.hive_cmd" placeholder="（必填）" @input="hive_cmdVal" name="cmdVal"></el-input>
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
                nodeData:{},  //节点参数信息
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
             * hive_cmd 绑定获取值
             * ------------------------------------------------------------------
             */
            hive_cmdVal : function (val) {
                this.nodeData.hive_cmd = val;
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