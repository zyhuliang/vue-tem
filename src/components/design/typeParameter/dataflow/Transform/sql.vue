<!-- steps参数 dataFlow Transform sql -->
<template>
        <div class="stepTable">
            <el-form id="bm-nodeset-sql-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                    <el-form-item :label="'sql'|cn">
                            <el-tooltip class="item" effect="dark" content="sql" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            {{' 使用 Ctrl-Shift-Alt-I 插入字段      Ctrl-Shift-Alt-F 格式化'}}  
                            <ace-editor  @getValue="getValue" :isUseTableName="false" height="150" :dictionaries="schemas" :defaultsql="nodeData.sql"/>
                            <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                    </el-form-item>
                    <i class="sign" v-if="nodeData.sql==''">{{'sql'|cn}} 不能为空</i>
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
                nodeData:{}  //存放节点参数信息
            }
        },
        props:["nodeSetData", 'schemas'],
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

            console.log("schemas",this.schemas)
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