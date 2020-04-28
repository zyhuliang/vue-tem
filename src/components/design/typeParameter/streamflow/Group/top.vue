<!-- steps参数 dataFlow Group top -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-top-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'limitType'| cn">
                                <el-tooltip  class="item" effect="dark" content="limit 类型，默认值行数" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.limitType" placeholder="请选择" @change="limitTypeSelect">
                                        <el-option value="ROW_COUNT"></el-option>
                                        <el-option value="RATE"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'limit'| cn">
                                <el-tooltip  class="item" effect="dark" content="选取数据的行数或者比率，行数默认值为20，比率默认值为0.5,有效值为0-1" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.limit" name="limit" placeholder="limitVal（必填）" @input="limitVal"></el-input>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.limit==''">{{'limit'| cn}}不能为空</i>
                        <el-form-item label="groupBy">
                                <el-tooltip  class="item" effect="dark" content="用于对数据集进行分组的字段，默认值''" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" multiple filterable allow-create default-first-option :value="nodeData.groupBy" placeholder="请选择（多选）" @change="groupBySelect">
                                        <el-option v-for="(la,inputLa,index) in getSelFields[0].fields" :key="inputLa" :value="la.alias"></el-option>
                                </el-select>
                        </el-form-item>
                        <!-- <i class="sign" v-if="nodeData.groupBy.length==0">groupBy不能为空</i> -->
                        <el-form-item :label="'orderBy'| cn">
                                <el-tooltip  class="item" effect="dark" content="排序规则" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" multiple filterable allow-create default-first-option :value="nodeData.orderBy" placeholder="请选择（多选）" @change="orderBySelect">
                                        <el-option v-for="(lb,inputLb,index) in getSelFields[0].fields" :key="inputLb" :value="lb.alias+' asc'"></el-option>
                                        <el-option v-for="(lc,inputLc,index) in getSelFields[0].fields" :key="index" :value="lc.alias+' desc'"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.orderBy&&nodeData.orderBy.length==0">orderBy不能为空</i>
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
        props:["nodeSetData","getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * limitType 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            limitTypeSelect : function (val) {
                this.nodeData.limitType = val;
            },
            /**
             * limit 绑定获取值
             * ------------------------------------------------------------------
             */
            limitVal : function (val) {
                this.nodeData.limit = val;
            },
            /**
             * groupBy 下拉框 绑定获取值 （多选）
             * ------------------------------------------------------------------
             */
            groupBySelect:function (val) {
                this.nodeData.groupBy = val;
            },
            /**
             * orderBy 下拉框 绑定获取值 （多选）
             * ------------------------------------------------------------------
             */
            orderBySelect:function (val) {
                this.nodeData.orderBy = val;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
        }
    }

</script>

<style scoped>
        .stepTable .el-form-item{
                margin-bottom: 0px !important;
                margin-top: 10px;
        }
        .selectClass{
                width: 100%;
        }
        .sign{ 
                margin-left: 150px;
                color: red;
                padding:0px; 
                font-size:8px;
                font-style:normal;
        }
</style>