<!-- steps参数 dataFlow workflow dataFlow -->
<template>
        <div>
                <el-form id="bm-nodeset-dataflow-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'dataflowId$'| cn">
                                <el-tooltip  class="item" effect="dark" content="dataflowId" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <!--<el-tooltip v-else class="item" effect="dark" :content="key" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>-->
                                <el-input placeholder="请选择内容" :value="nodeData.dataflowId$" :disabled="true" name="dataflowId">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataFlowInq"></el-button>
                                </el-input>
                        </el-form-item>
                        <el-form-item v-if="keyv != 'interceptor' && keyv != 'sessionCache' && keyv != 'dataflowId$'" :label="keyv" v-for="(vp,keyv,index) in nodeData" :key="keyv">
                                <el-tooltip  class="item" effect="dark" :content="keyv" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input class="nodeTextArea" type="text" :value="vp" @input="(value) => varpaValue(value,keyv)" name="varpaValue"></el-input>
                        </el-form-item>
                        <div hidden="hidden"> {{nodeP}}</div>
                </el-form>
                <!-- flow 查询 -->
                <div v-if="dialogFlowVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>查询 dataflow </h3>
                                <span @click="dialogFlowVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent flowTop">
                                <el-form class="elForm" ref="form" label-width="80px" :label-position="labelPosition" id="bm-dataflow-form">
                                        <dataflow-inq @thisSelectFlowVal="getSelectFlowVal"></dataflow-inq>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitFlow" name="flowSure">确定</el-button>
                                <el-button @click="dialogFlowVisible = false" name="flowCancel">取消</el-button>
                        </div>
                </div>
        </div>
</template>

<script>
    import dataflowInq from '@components/flowTreeInq/flowInquire.vue';
    import {designChildList} from '@api';
    import {copyArr,deepCopy,transformArr,extend} from "@function/comFunction";

    export default {
        components: {
            dataflowInq
        },
        data() {
            return {
                nodeData:{},  //存放节点参数
                dialogFlowVisible:false,
                labelPosition: 'left',
                varPar:[],
                nodeP:[],
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
             * dataflowId 查询
             * ------------------------------------------------------------------
             */
            dataFlowInq : function () {
                this.dialogFlowVisible = true;
            },
            /**
             * 获取子组件的flow
             * ------------------------------------------------------------------
             */
            getSelectFlowVal(data){
                this.getSelvalFlowId = data.id;
                this.getSelvalFlowName = data.name;
                    
            },
            varpaValue : function (val,index) {
                this.nodeData[index] = val;
            },
            /**
             * 获取flow 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitFlow : function () {
                var _this = this;
                $.each(this.nodeData,function(key,value){
                    if(key != "dataflowId$" || key != "interceptor" || key != "sessionCache"){
                        delete _this.nodeData[key];
                    }
                })
                designChildList(_this.getSelvalFlowId).then(data =>{
                    let statusArr = {inputs:[],outputs:[]}
                    _this.varPar = data.parameters;
                    _this.nodeP =[]
                    if(this.varPar && this.varPar.length!=0){
                        for(var i =0; i<this.varPar.length; i++){
                            var arr=[];
                            arr['name']=_this.varPar[i].name;
                            var obj={};
                            for(var h in arr)
                            {

                                obj[h]=arr[h];
                            }
                            let defValue = _this.varPar[i].defaultVal;
                            _this.nodeP.push({[arr.name]:defValue})
                        }
                    }
                    

                    for(var j = 0; j < _this.nodeP.length; j++){
                        this.nodeData = extend(this.nodeData,_this.nodeP[j])
                    }

                    sessionStorage.setItem("dataflowId",_this.getSelvalFlowId);

                    //传选择dataflow之后的状态
                    statusArr.inputs = data.inputs
                    statusArr.outputs = data.outputs
                    this.$emit('tabstatus',data)
                })

                this.$emit('nodeSetNewName',this.getSelvalFlowName);
                
                this.nodeSetData.dataflowId$ = this.getSelvalFlowId;
                this.dialogFlowVisible = false;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            console.log(this.nodeData);
        }
    }

</script>

<style scoped>
        .flowTop{
                margin-top: 10px;
        }
</style>