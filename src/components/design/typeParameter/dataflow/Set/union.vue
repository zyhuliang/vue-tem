<!-- steps参数 dataFlow Set union -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-union-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="distinct">
                                <el-tooltip class="item" effect="dark" content="是否要去除掉输出数据中重复的数据。从下拉框中选择，取值范围为(true, false)" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <!--<el-tooltip v-else class="item" effect="dark" :content="key" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>-->
                                <el-select class="distinctClass" :value="nodeData.distinct" placeholder="请选择" @change="distinctSelect">
                                        <el-option value=true></el-option>
                                        <el-option value=false></el-option>
                                </el-select>
                                <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                        </el-form-item>
                        <!-- <i class="sign" v-if="nodeData.distinct==''">distinct 不能为空</i> -->
                </el-form>

        </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},  //存放节点参数
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
             * distinctSelect 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            distinctSelect : function (val) {
                this.nodeData.distinct = val;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;            
        }
    }

</script>

<style scoped>
        .distinctClass{
                width: 100%;
        }
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