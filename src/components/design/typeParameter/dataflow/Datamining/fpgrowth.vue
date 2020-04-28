<!-- steps参数 dataFlow Datamining fpgrowth -->
<template>
    <div class="stepTable">
        <el-form  ref="nodeSetData" :model="nodeSetData" label-width="150px" id="fpgrowth">
            <!-- minSupport -->
            <el-form-item :label="'minSupport'| cn">
                <el-tooltip  class="item" effect="dark" content="minSupport">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.minSupport" name="minSupport" placeholder="minSupport（必填）" @input="minSupportVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.minSupport ==''">{{'minSupport'| cn}}不能为空</i>
            <!-- numPartitions -->
            <el-form-item :label="'numPartitions'| cn">
                <el-tooltip  class="item" effect="dark" content="numPartitions">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.numPartitions" name="numPartitions" placeholder="numPartitions（必填）" @input="numPartitionsVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.numPartitions ==''">{{'numPartitions'| cn}}不能为空</i>
            <!-- patternColumn -->
            <el-form-item :label="'patternColumn'| cn">
                <el-tooltip  class="item" effect="dark" content="patternColumn">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.patternColumn" name="patternColumn" placeholder="patternColumn（必填）" @input="patternColumnVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.patternColumn ==''">{{'patternColumn'| cn}}不能为空</i>
            <!-- frequencyColumn -->
            <el-form-item :label="'frequencyColumn'| cn">
                <el-tooltip  class="item" effect="dark" content="frequencyColumn">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.frequencyColumn" name="frequencyColumn" placeholder="frequencyColumn（必填）" @input="frequencyColumnVal"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.frequencyColumn ==''">{{'frequencyColumn'| cn}}不能为空</i>
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
            // minSupport 绑定获取值
            minSupportVal:function (val) {
                this.nodeData.minSupport = val
            },
            // numPartitions 绑定获取值
            numPartitionsVal:function (val) {
                this.nodeData.numPartitions = val
            },
            // patternColumn 绑定获取值
            patternColumnVal:function (val) {
                this.nodeData.patternColumn = val
            },
            // frequencyColumn 绑定获取值
            frequencyColumnVal:function (val) {
                this.nodeData.frequencyColumn = val
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