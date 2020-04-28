<!-- steps参数 dataFlow Datamining LogisticRegressionPredict -->
<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px" id="fpgrowth">
            <!-- modelPath -->
            <el-form-item :label="'modelPath'| cn">
                <el-tooltip  class="item" effect="dark" content="modelPath">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.modelPath" name="modelPath" placeholder="modelPath（必填）" @input="modelPathVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.modelPath ==''">{{'modelPath'| cn}}不能为空</i>
            <!-- featureColumns -->
            <el-form-item :label="'featureColumns '| cn">
                <el-tooltip class="item" effect="dark" content="featureColumns ">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" multiple filterable allow-create  default-first-option :value="nodeData.featureColumns " placeholder="featureColumns（必填，多选）" @change="featureColumnsSelect">
                    <i v-if="getSelFields.length!=0">
                        <el-option v-for="(lb,inputLb,index) in getSelFields[0].fields" :key="inputLb" :value="lb.alias"></el-option>
                    </i>
                </el-select>
            </el-form-item>
            <i class="sign" v-if="nodeData.featureColumns ==''">{{'featureColumns'| cn}}不能为空</i>
            <!-- labelColumn -->
            <el-form-item :label="'labelColumn'| cn">
                <el-tooltip  class="item" effect="dark" content="labelColumn">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.labelColumn" name="labelColumn" placeholder="labelColumn（必填）" @input="labelColumnVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.labelColumn ==''">{{'labelColumn'| cn}}不能为空</i>
        </el-form>
    </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},
            }
        },
        props:["nodeSetData","getSelFields"],
        watch: {
            nodeSetData: {
                handler: function(newValue, oldValue) {
                    this.nodeData = newValue;
                },
                deep: true,
                immediate: true,
            }
        },
        filters:{

        },
        methods: {
            // modelPath 绑定获取值
            modelPathVal:function (val) {
                this.nodeData.modelPath = val
            },
            // featureColumns 下拉框 绑定获取值
            featureColumnsSelect:function (val) {
                this.nodeData.featureColumns = val;
            },
            // frequencyColumn 绑定获取值
            labelColumnVal:function (val) {
                this.nodeData.labelColumn = val
            },
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