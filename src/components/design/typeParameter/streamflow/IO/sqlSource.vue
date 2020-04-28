<!-- steps参数 dataFlow IO sqlSource -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-sqlsource-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="sql">
                                <el-tooltip class="item" effect="dark" content="sql" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                {{' 使用 Ctrl-Shift-I 插入字段      Ctrl-Shift-F 格式化'}}  
                                <ace-editor @getValue="getValue" :isUseTableName="false" height="150" :defaultSql="nodeData.sql"/>
                                <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                        </el-form-item>
                </el-form>
                <i class="sign" v-if="nodeData.sql==''">{{'sql'| cn}} 不能为空</i>
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
                nodeData:{} //存放节点信息
                
            }
        },
         props:["nodeSetData"],  //接收父组件传值
         //监听节点信息变化
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{
        },
        methods: {
            /**
             * sql  绑定动态获取值
             * ------------------------------------------------------------------
             */
            getValue (val) {
                this.nodeData.sql = val;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            
            console.log(this.nodeData);
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