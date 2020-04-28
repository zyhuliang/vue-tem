<!-- steps参数 dataFlow Datamining decisiontree_train -->
<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px">
            <el-form-item :label="'modelType '| cn">
                <el-tooltip  class="item" effect="dark" content="modelType" placement="top" >
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" :value="nodeData.modelType " placeholder="请选择" @change="setVal($event,'modelType')">
                    <el-option value="classification"></el-option>
                    <el-option value="regression"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="'numClasses'| cn">
                <el-tooltip  class="item" effect="dark" content="numClasses">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.numClasses" name="numClasses" placeholder="numClasses（必填）" @input="setVal($event,'numClasses')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.numClasses ==''">{{'numClasses'| cn}}不能为空</i>
            <el-form-item :label="'impurity '| cn">
                <el-tooltip  class="item" effect="dark" content="impurity " placement="top" >
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" :value="nodeData.impurity " placeholder="请选择" @change="setVal($event,'impurity ')">
                    <el-option value="gini"></el-option>
                    <el-option value="entropy"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="'maxDepth'| cn">
                <el-tooltip  class="item" effect="dark" content="maxDepth">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.maxDepth" name="maxDepth" placeholder="maxDepth（必填）" @input="setVal($event,'maxDepth')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.maxDepth ==''">{{'maxDepth'| cn}}不能为空</i>
            <el-form-item :label="'maxBins'| cn">
                <el-tooltip  class="item" effect="dark" content="maxBins">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.maxBins" name="maxBins" placeholder="maxBins（必填）" @input="setVal($event,'maxBins')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.maxBins ==''">{{'maxBins'| cn}}不能为空</i>
            <el-form-item :label="'trainPortion'| cn">
                <el-tooltip  class="item" effect="dark" content="trainPortion">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.trainPortion" name="trainPortion" placeholder="trainPortion（必填）" @input="setVal($event,'trainPortionVal')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.trainPortion ==''">{{'trainPortion'| cn}}不能为空</i>
            <el-form-item :label="'modelPath'| cn">
                <el-tooltip  class="item" effect="dark" content="存放模型的路径">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.modelPath" name="modelPath" placeholder="modelPath（必填）" @input="setVal($event,'modelPath')"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.modelPath ==''">{{'modelPath'| cn}}不能为空</i>
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
            <el-form-item :label="'categoricalFeaturesInfo'| cn">
                <el-tooltip class="item" effect="dark" content="categoricalFeaturesInfo" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <div>
                    <ul class="tableTitle">
                        <li>featureColumn</li>
                        <li>categories</li>
                    </ul>
                    <ul class="tableTitle" v-for="(sct,key1,index) in nodeData.categoricalFeaturesInfo" :key="key1">
                        <li>
                            <el-select class="selectClass" v-model="sct.featureColumn"  placeholder="请选择">
                                <el-option  v-for="(item,key2,index2) in nodeData.featureColumns" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <el-input :value="sct.categories" placeholder="必填" @input="(value) => sctCategories(value, key1)"></el-input>
                        </li>
                        <div class="removeSct">
                            <i @click="removeSct(key1)" class="i remove el-icon-remove-outline"></i>
                        </div>
                    </ul>
                    <div class="adSct">
                        <i @click="addSct" class="i el-icon-circle-plus-outline"></i>
                    </div>
                </div>
            </el-form-item>
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