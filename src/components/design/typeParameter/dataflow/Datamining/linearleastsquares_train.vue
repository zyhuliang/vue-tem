<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px" id="bm-Datamining-train">
            <el-form-item :label="'stepSize'| cn">
                <el-tooltip  class="item" effect="dark" content="stepSize">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.stepSize" name="stepSize" placeholder="stepSize（必填）" @input="setVal($event,'stepSize')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.stepSize ==''">{{'stepSize'| cn}}不能为空</i>
            <el-form-item :label="'trainIteration'| cn">
                <el-tooltip  class="item" effect="dark" content="trainIteration">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.trainIteration" name="trainIteration" placeholder="trainIteration（必填）" @input="setVal($event,'trainIteration')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.trainIteration ==''">{{'trainIteration'| cn}}不能为空</i>
            <el-form-item :label="'miniBatchFraction'| cn">
                <el-tooltip  class="item" effect="dark" content="miniBatchFraction">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.miniBatchFraction" name="miniBatchFraction" placeholder="miniBatchFraction（必填）" @input="setVal($event,'miniBatchFraction')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.miniBatchFraction ==''">{{'miniBatchFraction'| cn}}不能为空</i>
            <el-form-item :label="'modelPath'| cn">
                <el-tooltip  class="item" effect="dark" content="modelPath">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.modelPath" name="modelPath" placeholder="modelPath（必填）" @input="setVal($event,'modelPath')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.modelPath ==''">{{'modelPath'| cn}}不能为空</i>
            <el-form-item :label="'trainPortion'| cn">
                <el-tooltip  class="item" effect="dark" content="trainPortion">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.trainPortion" name="trainPortion" placeholder="trainPortion（必填）" @input="setVal($event,'trainPortion')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.trainPortion ==''">{{'trainPortion'| cn}}不能为空</i>
            <el-form-item :label="'featureColumns '| cn">
                <el-tooltip class="item" effect="dark" content="featureColumns ">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" multiple filterable allow-create  default-first-option :value="nodeData.featureColumns " placeholder="（必填，多选）" @change="featureColumnsSelect">
                    <i v-if="getSelFields.length!=0">
                        <el-option v-for="(lb,inputLb,index) in getSelFields[0].fields" :key="inputLb" :value="lb.alias"></el-option>
                    </i>
                </el-select>
            </el-form-item>
            <i class="sign" v-if="nodeData.featureColumns==''">{{'featureColumns'| cn}}  不能为空</i>
            <el-form-item :label="'labelColumn'| cn">
                <el-tooltip  class="item" effect="dark" content="labelColumn">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.labelColumn" name="labelColumn" placeholder="labelColumn（必填）" @input="setVal($event,'labelColumn')"></el-input>
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
            // input类型输入框 绑定输入值
            setVal:function (val,field) {
                this.nodeData[field] = val
            },
            // featureColumns 下拉框 绑定获取值
            featureColumnsSelect:function (val) {
                this.nodeData.featureColumns = val;
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