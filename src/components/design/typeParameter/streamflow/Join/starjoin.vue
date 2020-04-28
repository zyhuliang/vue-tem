<!-- steps参数 dataFlow Join starjoin -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-starjoin-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="factTable">
                                <el-tooltip class="item" effect="dark" content="作为中心表的数据集名称。剩余的数据集都将和它进行join操作" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <!--<el-tooltip v-else-if="key == 'joinConditions'" class="item" effect="dark" content="校验规则。用于指明每个维表与factTable进行join操作时的规则" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-tooltip v-else class="item" effect="dark" :content="key" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>-->
                                
                                        <el-select class="selectClass" :value="nodeData.factTable" placeholder="请选择(必填项)" @change="factTableSelect">
                                                <el-option v-for="(la,inputLa,index) in lineData.inputLine" :key="inputLa" :value="la.lineNameSource"></el-option>
                                        </el-select>
                                        <i class="sign" v-if="nodeData.factTable==''">{{'joinType' | cn}} 不能为空</i>
                                
                               
                                <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                        </el-form-item>
                        <el-form-item label="joinConditions">
                        	<el-tooltip class="item" effect="dark" content="校验规则。用于指明每个维表与factTable进行join操作时的规则" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <ul class="tableTitle">
                                                <li>维表</li>
                                                <li>维表字段</li>
                                                <li>事实表字段</li>
                                        </ul>
                                        <ul class="tableTitle" v-for="(joinC,key1,index) in nodeData.joinConditions" :key="key1">
                                                <li>
                                                        <el-select class="selectClass" :value="joinC.tableName" placeholder="请选择(必填项)" @change="(value) => tableName(value, key1)">
                                                                <el-option v-for="(lb,inputLb,index) in lineData.inputLine" :key="inputLb" :value="lb.lineNameSource"></el-option>
                                                        </el-select>
                                                </li>
                                                <li>
                                                        <el-select class="selectClass" :value="joinC.dimColumn" placeholder="请选择(必填项)" @visible-change="(value) => dimColumnClick(value, key1)" @change="(value) => dimColumn(value, key1)">
                                                                <el-option v-for="(lc,inputLc,index) in dTable" :key="inputLc" :value="lc.alias"></el-option>
                                                        </el-select>
                                                </li>
                                                <li>
                                                        <el-select class="selectClass" :value="joinC.factColumn" placeholder="请选择(必填项)" @visible-change="(value) => factColumnClick(value, key1)" @change="(value) => factColumn(value, key1)">
                                                                <el-option v-for="(ld,inputLd,index) in fTable" :key="inputLd" :value="ld.alias"></el-option>
                                                        </el-select>
                                                </li>
                                                <div class="removeCondition" v-if="nodeData.joinConditions.length > '1'">
                                                        <i @click="removeCondition(key1)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                        </ul>
                                        <div class="adCondition">
                                                <i @click="addCondition" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                        </el-form-item>
                </el-form>

        </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},   //节点参数信息
                lineData:{},
                getSelField:[],
                dTable:[],
                fTable:[]
            }
        },
        props:["nodeSetData","getSelFields","nodeSetLine"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
            nodeSetLine(newValue, oldValue) {
                this.lineData = newValue;
            },
            getSelFields(newValue, oldValue){
                this.getSelField = newValue;
            }
        },
        filters:{

        },
        methods: {
            /**
             * factTableSelect 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            factTableSelect : function (val) {
                this.nodeData.factTable = val;
            },
            /**
             * joinConditions table 新增数据
             * ------------------------------------------------------------------
             */
            addCondition : function () {
                this.nodeData.joinConditions.push({ "tableName": "", "dimColumn": "", "factColumn": "" })
            },
            /**
             * 移除 joinConditionsVal
             * ------------------------------------------------------------------
             */
            removeCondition:function (index) {
                this.nodeData.joinConditions.splice(index,1);
            },
            /**
             * joinConditions tableName 维表 绑定值
             * ------------------------------------------------------------------
             */
            tableName:function (val,index) {
                this.nodeData.joinConditions[index].tableName=val;
            },
            /**
             * joinConditions dimColumn 维表字段 绑定值
             * ------------------------------------------------------------------
             */
            dimColumn:function (val,index) {
                this.nodeData.joinConditions[index].dimColumn=val;
            },
            dimColumnClick : function (val,index) {
                let dFieldsId = this.nodeData.joinConditions[index].tableName;
                for(var i = 0; i < this.getSelField.length; i++){
                    if(dFieldsId === this.getSelField[i].id){
                        this.dTable = this.getSelField[i].fields;
                    }
                }
            },
            /**
             * joinConditions factColumn 事实表字段 绑定值
             * ------------------------------------------------------------------
             */
            factColumn:function (val,index) {
                this.nodeData.joinConditions[index].factColumn=val;
            },
            factColumnClick : function (val,index) {
                let fFieldsId = this.nodeData.factTable
                for(var i = 0; i < this.getSelField.length; i++){
                    if(fFieldsId === this.getSelField[i].id){
                        this.fTable = this.getSelField[i].fields;
                    }
                }
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;            
            this.getSelField = this.getSelFields;            
            this.lineData = this.nodeSetLine;
            console.log(this.nodeData);
        }
    }

</script>

<style scoped>
        .selectClass{
                width: 100%;
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
        .adCondition{
                float: left;
        }
        .adCondition i{
                color: #3e98fe;
        }
        .removeCondition i{
                color: #ff4949;
        }
        .sign{ 
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