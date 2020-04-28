<!-- steps参数 dataFlow Datamining LogisticRegressionTrain -->
<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px" id="fpgrowth">
            <!-- numClasses -->
            <el-form-item :label="'numClasses'| cn">
                <el-tooltip  class="item" effect="dark" content="numClasses">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.numClasses" name="numClasses" placeholder="numClasses（必填）" @input="numClassesVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.numClasses ==''">{{'numClasses'| cn}}不能为空</i>
            <!-- trainIteration -->
            <el-form-item :label="'trainIteration'| cn">
                <el-tooltip  class="item" effect="dark" content="trainIteration">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.trainIteration" name="trainIteration" placeholder="trainIteration（必填）" @input="trainIterationVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.trainIteration ==''">{{'trainIteration'| cn}}不能为空</i>
            <!-- regType -->
            <el-form-item :label="'regType'| cn">
                <el-tooltip  class="item" effect="dark" content="regType">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" :value="nodeData.regType " placeholder="regType（必填，多选）" @change="regTypeSelect">
                    <el-option value="L1">L1</el-option>
                    <el-option value="L2">L2</el-option>
                </el-select>
            </el-form-item>
            <i class="sign" v-if="nodeData.regType ==''">{{'regType'| cn}}不能为空</i>
            <!-- regParam -->
            <el-form-item :label="'regParam'| cn">
                <el-tooltip  class="item" effect="dark" content="regParam">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.regParam" name="regParam" placeholder="regParam（必填）" @input="regParamVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.regParam ==''">{{'regParam'| cn}}不能为空</i>
            <!-- modelPath -->
            <el-form-item :label="'modelPath'| cn">
                <el-tooltip  class="item" effect="dark" content="modelPath">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.modelPath" name="modelPath" placeholder="modelPath（必填）" @input="modelPathVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.modelPath ==''">{{'modelPath'| cn}}不能为空</i>
            <!-- trainPortion -->
            <el-form-item :label="'trainPortion'| cn">
                <el-tooltip  class="item" effect="dark" content="trainPortion">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.trainPortion" name="trainPortion" placeholder="trainPortion（必填）" @input="trainPortionVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.trainPortion ==''">{{'trainPortion'| cn}}不能为空</i>
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
            // numClasses 下拉框获取值
            numClassesVal:function (val) {
                this.nodeData.numClasses = val
            },
            // trainIteration 绑定获取值
            trainIterationVal:function (val) {
                this.nodeData.trainIteration = val
            },
            // regType 绑定获取值
            regTypeSelect:function (val) {
                this.nodeData.regType = val
            },
            // regParam 绑定获取值
            regParamVal:function (val) {
                this.nodeData.regParam = val
            },
            // modelPath 绑定获取值
            modelPathVal:function (val) {
                this.nodeData.modelPath = val
            },
            // trainPortion 绑定获取值
            trainPortionVal:function (val) {
                this.nodeData.trainPortion = val
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