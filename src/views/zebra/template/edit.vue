<template>
    <section class="clearBox" id="bm-qa-template-edit">
        <div>
            <el-button v-if="changeType" type="primary" @click="editLock" icon="fa fa-lock" name="template-edit-unlock">&nbsp;解锁</el-button>
            <el-button v-if="!changeType" @click="editLock" icon="fa fa-unlock" name="template-edit-lock">&nbsp;锁定</el-button>
            <el-form :model="row" :label-position="labelPosition" status-icon ref="row" label-width="100px"
            	:rules="add"
            	class="demo-ruleForm"
            	id="bm-qa-template-edit-form"
            	>
            <div class="scroll-content">
                <el-form-item label="主键" prop="name">
                    <el-input type="text" v-model="row.id" disabled="disabled" auto-complete="off" name="id"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="flow">
                    <el-input type="text" v-model="row.name" :disabled="isDisabled"
                    	placeholder="名称(必填)"
                    	auto-complete="off" name="name"></el-input>
                </el-form-item>
                 <el-form-item :label="'flow类型'|cn" prop="flow">
                    <el-select v-model="row.flowType" placeholder="请选择flow类型" :disabled="isDisabled" >
                        <el-option
                            v-for="item in ['dataflow', 'streamflow']"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'预处理 Flow'|cn" prop="preProcessFlowId"  v-show="row.flowType !== 'streamflow'">
                    <el-input placeholder="请选择内容" :disabled="isDisabled"
                    	@input="flowInput"
                    	v-model="row.preProcessFlowId" class="input-with-select" name="preProcessFlowId">
                        <el-button slot="append" :disabled="isDisabled" icon="icon iconfont icon-ir-search" @click="flowInquire" name="flowInquire"></el-button>
                    </el-input>
                    <el-input type="text" v-model="row.preProcessFlowName"  v-if="textShow"   :disabled="isDisabled" auto-complete="off" name="preProcessFlowName"></el-input>
                </el-form-item>
                <el-form-item :label="'输入数据集'|cn" prop="processDataId">
                    <el-input type="text" v-model="row.processDataId" :disabled="isDisabled"
                    	placeholder="数据选择(必填)"
                    	auto-complete="off" name="processDataId">

                    	<el-button slot="append" :disabled="isDisabled" icon="icon iconfont icon-ir-search" @click="dataInquire" name="dataInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="'description'|cn" prop="description">
                    <el-input v-model.number="row.description"  auto-complete="off" :disabled="isDisabled" name="description"></el-input>
                </el-form-item>
              </div>
                <el-form-item>
                    <el-button @click="toRulesList('row')" :disabled="!row.name || !row.processDataId || isDisabled" name="edit">编辑规则</el-button>
                    <el-button type="primary" @click="saveForm('row')" :disabled="!row.name || !row.processDataId || isDisabled" name="sure">确定</el-button>
                    <el-button @click="returnForm()" name="cancle">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 预处理 Flow -->
        <el-dialog v-dialog-drag title="流程查询" :visible.sync="dialogFlowVisible" :modal-append-to-body="false" >
            <el-form class="content" id="bm-qa-template-edit-flowSearch">
                <flow-inquire @thisSelectFlowVal="getSelectFlowVal"></flow-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer" id="bm-qa-template-edit-flowFooter">
                <el-button type="primary" @click="submitFlow" name="flowFooter-sure">确定</el-button>
                <el-button @click="dialogFlowVisible = false" name="flowFooter-cancle">取消</el-button>
            </div>
        </el-dialog>
        <!-- 数据集查询 dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
                                     rootName="dataset_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {editTmp,tempDetail} from '@api';
    import flowInquire from '@components/flowTreeInq/flowInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    export default {
    	components:{
    		flowInquire,
            dataSourceInquire
    	},
        data() {
            return {
                //URL参数ID
                id:this.$route.query.id,
                labelPosition: 'top',
                changeType:true,
                isDisabled:true,
                dialogFlowVisible:false,
                dialogDataSetVisible:false,
                textShow:false,
                row:{
                	id:'',
                	name:'',
                	preProcessFlowId:'',
                	preProcessFlowName:'',
                	processDataId:'',
                    description:'',
                    flowType: 'dataflow'
                },
               add: {
                    name: [
                        { required: true, trigger: 'blur',message: '请输入名称' }
                    ]
                }
            };
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
        	//获取表单数据
        	getEditCon(){
        		tempDetail(this.id).then(res=>{
        			this.row=res;
        			this.row.id=res.id;
        			this.row.name=res.name;
        			this.row.preProcessFlowId=res.preProcessFlowId;
        			this.row.preProcessFlowName=res.preProcessFlowName;
        			this.row.processDataId=res.processDataId;
        			this.row.description=res.description;
        		})
        	},
        	//获取子组件的flow
            getSelectFlowVal(data){
                this.getSelValFlowId = data.id;
                this.getSelValFlowName = data.name;
            },
            //flow查询数据提交
            submitFlow () {
                if(this.getSelValFlowId === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.row.preProcessFlowId= this.getSelValFlowId;
                    this.row.preProcessFlowName= this.getSelValFlowName;
                    this.textShow = true;
                    this.dialogFlowVisible = false;
                }
            },

            //监听flow输入的值，隐藏input
            flowInput(val) {
                if(val === ''){
                    this.textShow=false;
                    //flowId无值时，flowName也为空
                    this.row.preProcessFlowName='';
                }else{
                    this.textShow=true;
                }
            },

            //data查询
            dataInquire(){
                //弹出"data查询"层
                this.dialogDataSetVisible = true;
            },

            //获取子组件的data
            getSelectDateVal(data){
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
            },

             //data查询数据提交
            submitDataSet() {
                if(this.getSelvalDataName === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.row.processDataId = this.getSelvalDataName;
                    this.cancelDatasetDialog();
                }
            },

            saveForm(formName) {
                this.$refs[formName].validate((valid)=>{
                	if(valid){
                		editTmp(this.row.id,this.row).then(data=>{
                			this.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                			this.$router.push({path:'/qualityAnalysis/analysisTemplate'})
                		},err=>{
                			if(err.response.data.err=='Name Duplicated'){
                				this.$message({
	                				message:'保存失败，此名称已存在',
	                				type:'error',
	                				duration:1500
                				})
                			}
                		})
                	}else{
                		return false;
                	}
                })

            },
            toRulesList(formName){
            	this.$router.push({name:'规则模板',query:{id:this.row.id, processDataId:this.$route.query.processDataId},params:{row:this.row}});
            	//跳转到规则列表页，并保存分析模板
                this.$refs[formName].validate((valid)=>{
                	if(valid){
                		editTmp(this.row.id,this.row).then(data=>{
                			this.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                		},err=>{
                			if(err.response.data.err=='Name Duplicated'){
                				this.$message({
	                				message:'保存失败，此名称已存在',
	                				type:'error',
	                				duration:1500
                				})
                			}
                		})
                	}else{
                		return false;
                	}
                })
            },
            //解锁
            editLock:function () {
            	this.changeType=!this.changeType;
            },
            returnForm(){
                history.back(-1);
            },

            //flow查询
            flowInquire(){
            	//弹出"flow查询"层
                this.dialogFlowVisible = true;
            }
        },
        mounted() {
            this.getEditCon();
        },
        watch:{
        	changeType(){
        		if(this.changeType==true){
        			this.isDisabled=true;
        		}else{
        			this.isDisabled=false;
        		}
        	}
        }
    }
</script>

<style scoped>
    .demo-ruleForm{
        width: 50%;
    }
    .el-select{
        width: 100%;
    }
    .content{
        float: left;
        width: 100%;
        box-sizing: border-box;
        height: calc(80vh - 120px);
    }
    .clearBox{
    	padding-left:20px;
    	padding-top: 20px;
    	height: 100%;
    }
</style>
