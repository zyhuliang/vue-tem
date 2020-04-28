<!-- steps参数 dataFlow Gateway decision -->
<template>
        <div>
                <el-form id="bm-nodeset-decision-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'condition' | cn">
                                <el-tooltip  class="item" effect="dark" :content="'condition' | cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <ace-editor v-if="key='condition'" @getValue="getValue" :isUseTableName="false" height="150" :dictionaries="schemas" :defaultsql="nodeData.condition"/>
                        </el-form-item>
                </el-form>
                <i class="sign" v-if="nodeData.condition==''">{{"condition" | cn}}不能为空</i>
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
                nodeData:{},  //存放节点信息
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
             * condition 绑定获取值
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
</style>