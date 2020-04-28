<!-- steps参数 dataFlow Gateway validate -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-validate-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'validationRules'| cn">
                                <el-tooltip  class="item" effect="dark" content="验证规则" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                {{' 使用 Ctrl-Shift-I 插入字段      Ctrl-Shift-F 格式化'}}  
                                <div v-for="(vr,key1,index) in nodeData.validationRules" :key="key1">
                                        <el-input :value="vr.name" placeholder="名称（必填）" @input="(value) => vrNameVal(value, key1)"></el-input>
                                        <ace-editor v-if="key='condition'" @getValue="(value) => vrExpressionVal(value, key1)" :isUseTableName="false" height="150" :dictionaries="schemas" :defaultsql="vr.expression"/>
                                        <div class="removeVr" v-if="nodeData.validationRules.length > '1'">
                                                <i @click="removeVr(key1)" class="i remove el-icon-remove-outline"></i>
                                        </div>
                                        <i class="sign-vali mr15" v-if="vr.name==''">名称不能为空 </i>  <i class="sign-vali" v-if="vr.expression==''"> {{'validationRules'| cn}}不能为空</i>
                                </div>
                                <div class="addVr">
                                        <i @click="addVr" class="i el-icon-circle-plus-outline"></i>
                                </div>
                        </el-form-item>
                        <el-form-item :label="'action'| cn">
                                <el-tooltip  class="item" effect="dark" content="错误处理模式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.action | actionFilter" placeholder="请选择" @change="actionSelect">
                                        <el-option value="忽略"></el-option>
                                        <el-option value="中止执行"></el-option>
                                        <el-option value="保存错误信息"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.action==''">{{'action'| cn}}不能为空</i>
                        <el-form-item :label="'showDetails'| cn">
                                <el-tooltip  class="item" effect="dark" content="当不符合规则时, 是否输出这些规则" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.showDetails" placeholder="请选择" @change="showDetailsSelect">
                                        <el-option value="true"></el-option>
                                        <el-option value="false"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.showDetails==''">{{'showDetails'| cn}}不能为空</i>
                        <el-form-item label="detailColumn">
                                <el-tooltip  class="item" effect="dark" content="定义不匹配规则输出信息的标题" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.detailColumn" placeholder="detailColumn" @input="detailColumnVal"></el-input>
                        </el-form-item>
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
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{
            actionFilter :function (val) {
                if(val == "ignore"){
                    return "忽略"
                }else if(val == "error"){
                    return "中止执行"
                }else if(val == "save"){
                    return "保存错误信息"
                }
            }
        },
        methods: {
            /**
             * validationRules (数组对象) 绑定获取值 (name,expression)
             * ------------------------------------------------------------------
             */
            vrNameVal : function (val,index) {
                this.nodeData.validationRules[index].name = val;
            },
            vrExpressionVal : function (val,index) {
                this.nodeData.validationRules[index].expression = val;
            },
            // 新增 validationRules 内的对象
            addVr:function () {
                this.nodeData.validationRules.push({name:"",expression:""})
            },
            // 移除 validationRules 内的对象
            removeVr:function (index) {
                this.nodeData.validationRules.splice(index,1);
            },
            /**
             * action select 绑定获取值
             * ------------------------------------------------------------------
             */
            actionSelect : function (val) {
                if(val == "忽略"){
                    this.nodeData.action = "ignore";
                }else if(val == "中止执行"){
                    this.nodeData.action = "error";
                }else if(val == "保存错误信息"){
                    this.nodeData.action = "save";
                }
            },
            /**
             * showDetails select 绑定获取值
             * ------------------------------------------------------------------
             */
            showDetailsSelect : function (val) {
                this.nodeData.showDetails = val;
            },
            /**
             * detailColumn 绑定获取值
             * ------------------------------------------------------------------
             */
            detailColumnVal : function (val) {
                this.nodeData.detailColumn = val;
            }

        },
        mounted() {
            this.nodeData = this.nodeSetData;

            //action 默认值
            if(this.nodeData.action == ""){
                this.nodeData.action = "ignore";
            }
            //showDetails 默认值
            if(this.nodeData.showDetails == ""){
                this.nodeData.showDetails = "true";
            }

            console.log(this.nodeData);
        }
    }

</script>

<style scoped>
        .selectClass{
                width: 100%;
        }
        .addVr{
                float: right;
                right: 0px;
                top: 0px;
        }
        .removeVr{
                float: right;
                margin-left: 10px;
        }
        .i{
                color: #3e98fe;
        }
        .remove{
                color: #ff4949;
        }
        .mr15 {
            margin-right: 30px;
        }
        .sign-vali{ 
                color: red;
                padding:0px; 
                font-size:8px;
                font-style:normal;
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