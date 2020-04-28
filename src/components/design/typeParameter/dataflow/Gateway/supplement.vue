<!-- steps参数 dataFlow Gateway supplement -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-supplement-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'supplementSchema' | cn">
                                <el-tooltip  class="item" effect="dark" content="元数据名称；必填项" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :placeholder="'supplementSchema'| cn+'（必填）'" name="supplementSchema" :value="nodeData.supplementSchema" :disabled="true">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="supplementSchemaInq" name="supplementSchemaInq"></el-button>
                                </el-input>
                        </el-form-item>
                        <i class="sign" v-if="!nodeData.supplementSchema">{{'supplementSchema'| cn}}不能为空</i>
                </el-form>
                <!-- schema 查询 -->
                <div v-if="dialogSchemaVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>元数据查询</h3>
                                <span @click="dialogSchemaVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <el-form class="elForm" ref="form" label-width="80px" :label-position="labelPosition" id="bm-supplement-form">
                                        <schema-inquire @thisSelectSchemaVal="getSelectSchemaVal"></schema-inquire>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitSchema" name="diFooter-sure">确定</el-button>
                                <el-button @click="dialogSchemaVisible = false" name="diFooter-cancel">取消</el-button>
                        </div>
                </div>
        </div>
</template>

<script>

    import schemaInquire from '@schemaInq/schemaInquire.vue';

    export default {
        components: {
            schemaInquire
        },
        data() {
            return {
                nodeData:{},  //存放节点参数信息
                dialogSchemaVisible:false,
                labelPosition: 'left',
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
             * supplementSchema 绑定查询选择值
             * ------------------------------------------------------------------
             */
            supplementSchemaInq : function () {
                this.dialogSchemaVisible = true;
            },
            getSelectSchemaVal(data){
                this.schemaName = data.name;
                this.getSchemaId = data.id;
            },
            submitSchema : function () {
                this.nodeData.supplementSchema = this.schemaName;
                this.nodeData.supplementSchemaId = this.getSchemaId;
                this.nodeData.additionalDatasets = "";
                this.dialogSchemaVisible = false;
            },

        },
        mounted() {
            this.nodeData = this.nodeSetData;           
        }
    }

</script>

<style scoped>
    .sign{ 
            margin-left: 150px;
            color: red;
            padding:0px; 
            font-size:8px;
            font-style:normal;
        }
    .stepTable .el-form-item{
            margin-bottom: 0px !important;
            margin-top: 10px;
    }
</style>