<!-- steps参数 dataFlow Datamining clustering_kmeans_train -->
<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px">
            <el-form-item :label="'modelPath'| cn">
                <el-tooltip  class="item" effect="dark" content="modelPath">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.modelPath" name="modelPath" placeholder="modelPath（必填）" @input="setVal($event,'modelPath')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.modelPath ==''">{{'modelPath'| cn}}不能为空</i>
            <el-form-item :label="'k'| cn">
                <el-tooltip  class="item" effect="dark" content="k">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.k" name="k" placeholder="k（必填）" @input="setVal($event,'k')" ></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.k ==''">{{'k'| cn}}不能为空</i>
            <el-form-item :label="'maxIterations '| cn">
                <el-tooltip  class="item" effect="dark" content="maxIterations">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.maxIterations " name="maxIterations " placeholder="maxIterations （必填）" @input="setVal($event,'maxIterations ')" ></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.maxIterations  ==''">{{'maxIterations '| cn}}不能为空</i>
            <el-form-item :label="'runs'| cn">
                <el-tooltip  class="item" effect="dark" content="runs">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.runs" name="runs" placeholder="runs（必填）" @input="setVal($event,'runs')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.runs ==''">{{'runs'| cn}}不能为空</i>
            <el-form-item :label="'epsilon '| cn">
                <el-tooltip  class="item" effect="dark" content="epsilon ">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.epsilon" name="epsilon" placeholder="epsilon（必填）" @input="setVal($event,'epsilon')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.epsilon ==''">{{'epsilon'| cn}}不能为空</i>

            <el-form-item :label="'initializationMode'| cn">
               <el-tooltip  class="item" effect="dark" content="initializationMode" placement="top" >
                   <i class="parIcon el-icon-warning"></i>
               </el-tooltip>
               <el-select class="selectClass" :value="nodeData.initializationMode" placeholder="请选择" @change="setVal($event,'initializationMode')">
                   <el-option value="k-means||"></el-option>
                   <el-option value="random"></el-option>
               </el-select>
           </el-form-item>

            <el-form-item :label="'initializationSteps '| cn">
                <el-tooltip  class="item" effect="dark" content="initializationSteps ">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.initializationSteps " name="initializationSteps " placeholder="initializationSteps （必填）" @input="setVal($event,'initializationSteps ')" ></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.initializationSteps  ==''">{{'initializationSteps '| cn}}不能为空</i>
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
            //categoricalFeaturesInfo 数组对象 categories 绑定获取值
            sctCategories:function (val,index) {
                this.nodeData.categoricalFeaturesInfo[index].categories=val;
            },
            //categoricalFeaturesInfo 数组 新增对象
            addSct:function () {
                this.nodeData.categoricalFeaturesInfo.push({ "featureColumn": "", "categories": "" })
            },
            //categoricalFeaturesInfo 数组 移除对象
            removeSct:function (index) {
                this.nodeData.categoricalFeaturesInfo.splice(index,1);
            },
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
    .tableTitle{
        float: left;
        width: 100%;
        height: 30px;
        margin: 10px 0px 0px 0px;
        padding:0px;
    }
    .tableTitle li{
        float: left;
        width: 31%;
        margin-right: 1%;
        text-align: center;
    }
    .selectClass{
        width: 100%;
    }
    .adSct{
        float: left;
    }
    .adSct i{
        color: #3e98fe;
    }
    .removeSct i{
        color: #ff4949;
    }
</style>