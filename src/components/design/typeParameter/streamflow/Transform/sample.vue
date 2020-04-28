<!-- steps参数 dataFlow Transform sample -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-sample-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'withReplacement'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'withReplacement'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.withReplacement" placeholder="" type="text" @input="withReplacementVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'fraction'| cn" >
                                <el-tooltip  class="item" effect="dark" :content="'fraction'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.fraction" placeholder="" type="text" @input="fractionVal"></el-input>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.condition==''">{{'fraction'| cn}} 不能为空</i>
                </el-form>

        </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},  //存放节点参数信息
            }
        },
        props:["nodeSetData"],  //父组件传递过来的值
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * withReplacementVal 绑定动态获取值
             * ------------------------------------------------------------------
             */
            withReplacementVal:function (val) {
                this.nodeData.withReplacement = val;
            },
            /**
             * fraction 绑定动态获取值
             * ------------------------------------------------------------------
             */
            fractionVal:function (val) {
                this.nodeData.fraction = val;
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