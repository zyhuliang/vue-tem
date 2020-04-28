<template>
    <section class="clearBox" id="bm-qa-template-edit">
        <div>
            <el-form :model="row" :label-position="labelPosition" status-icon ref="row" label-width="100px"
            	:rules="add"
            	class="demo-ruleForm"
            	id="bm-qa-template-edit-form"
            	>
            <div class="scroll-content">
                <el-form-item label="主键" prop="name">
                    <el-input type="text" v-model="row.id" disabled auto-complete="off" name="id"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="flow">
                    <el-input type="text" v-model="row.name" disabled
                    	placeholder="名称(必填)"
                    	auto-complete="off" name="name"></el-input>
                </el-form-item>
                <el-form-item :label="'预处理 Flow' | cn" prop="preProcessFlowId">
                    <el-input placeholder="请选择内容" :disabled="isDisabled"
                    	@input="flowInput"
                    	v-model="row.preProcessFlowId" class="input-with-select" name="preProcessFlowId">
                        <el-button slot="append" :disabled="isDisabled" icon="icon iconfont icon-ir-search" @click="flowInquire" name="flowInquire"></el-button>
                    </el-input>
                    <el-input type="text" v-model="row.preProcessFlowName"  v-if="textShow"   :disabled="isDisabled" auto-complete="off" name="preProcessFlowName"></el-input>
                </el-form-item>
                <el-form-item :label="'dataset'|cn" prop="processDataId">
                    <el-input type="text" v-model="row.processDataId" :disabled="isDisabled"
                    	placeholder="数据选择(必填)"
                    	auto-complete="off" name="processDataId">
                    	<el-button slot="append" :disabled="isDisabled" icon="icon iconfont icon-ir-search" @click="dataInquire" name="dataInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="'description'|cn"  prop="description">
                    <el-input v-model.number="row.description"  auto-complete="off" :disabled="isDisabled" name="description"></el-input>
                </el-form-item>
              </div>
                <el-form-item>
                    <el-button @click="returnForm()" name="cancle">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
</template>

<script>
    import {editTmp,tempDetail} from '@api';
    export default {
        data() {
            return {
            	flagTxt:'',
                //URL参数ID
                id:this.$route.query.id,
                row:this.$route.params.row,
                labelPosition: 'top',
                changeType:true,
                isDisabled:true,
                dialogFlowVisible:false,
                dialogDataVisible:false,
                textShow:false,
                row:{
                	id:'',
                	name:'',
                	preProcessFlowId:'',
                	preProcessFlowName:'',
                	processDataId:'',
                	description:''
                },
               add: {
                    name: [
                        { required: true, trigger: 'blur', message:'请输入名称' }
                    ]
                }
            };
        },
        methods: {
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
                this.dialogDataVisible = true;
            },
            //获取子组件的data
            getSelectDateVal(data){
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
            },
             //data查询数据提交
            submitData() {
                if(this.getSelvalDataName === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.row.processDataId = this.getSelvalDataName;
                    this.dialogDataVisible = false;
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
            	this.$router.push({name:'规则模板',query:{id:this.row.id},params:{row:this.row}});
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
    .clearBox{
    	padding-left:20px;
    	padding-top: 20px;
    	height: 100%;
    }
</style>
