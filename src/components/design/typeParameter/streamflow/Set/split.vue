<!-- steps参数 dataFlow Set split -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-split-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="condition">
                                <el-tooltip  class="item" effect="dark" content="过滤条件，将满足条件的数据和不满足条件的数据分开存储，语法类似于sql" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                {{' 使用 Ctrl-Shift-I 插入字段      Ctrl-Shift-F 格式化'}}  
                                <!--<el-tooltip v-else class="item" effect="dark" :content="key" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>-->
                                 <ace-editor  @getValue="getValue" :isUseTableName="false" height="150" :dictionaries="schemas" :defaultsql="nodeData.condition"/>
                               <!-- <el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                        </el-form-item>
                        <i class="sign" v-if="nodeData.condition==''">{{'condition'| cn}} 不能为空</i>
                </el-form>

        </div>
</template>

<script>
    // 编写 语句
    import AceEditor from '@components/aceEditor/aceEditor'
    export default {
        components: {
            AceEditor
        },
        data() {
            return {
                nodeData:{},  //存放节点参数信息
            }
        },
        props:["nodeSetData", 'schemas'],
        //监听节点参数变化
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * conditionVal 绑定动态获取值
             * ------------------------------------------------------------------
             */
            getValue (val) {
                this.$set(this.nodeData, 'condition', val)
            }
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