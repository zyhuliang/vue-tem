<template>
    <section class="clearBox" id="bm-qa-template-add">
        <div>
            <el-form :model="addForm" :label-position="labelPosition" status-icon :rules="add" ref="addForm" label-width="100px" class="demo-ruleForm" id="bm-qa-template-add-form">
             <div class="scroll-content">  
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="addForm.name" auto-complete="off" name="name"></el-input>
                </el-form-item>
                <el-form-item :label="'flow类型'|cn" prop="flow">
                    <el-select v-model="addForm.flowType" placeholder="请选择flow类型">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'预处理 Flow'|cn" prop="flow" v-show="addForm.flowType !== 'streamflow'">
                    <el-input placeholder="请选择内容" v-model="addForm.flowID" class="input-with-select" @input="flowInput" name="flowID">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="flowInquire" name="flowInquire"></el-button>
                    </el-input>
                    <el-input type="text" v-if="textShow" v-model="addForm.flowName" auto-complete="off" name="flowName"></el-input>
                </el-form-item>
                <el-form-item class="输入数据集" :label="'dataset'|cn" prop="dataset">
                    <el-input v-model="addForm.dataset" placeholder="请选择内容(必选)" class="input-with-select" name="dataset">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataInquire" name="dataInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="'description'|cn" prop="description">
                    <el-input type="text" v-model="addForm.description" name="description"></el-input>
                </el-form-item>
               </div> 
                <el-form-item>
                    <el-button :disabled="!addForm.name || !addForm.dataset" @click="submitForm('addForm','toRules')" name="template-add-editRule">编辑规则</el-button>
                    <el-button type="primary" :disabled="!addForm.name || !addForm.dataset" @click="submitForm('addForm','toReturn')" name="template-add-sure">确定</el-button>
                    <el-button @click="returnForm()" name="template-add-cancle">取消</el-button>
                </el-form-item>
            </el-form>
        </div>


        <!-- 预处理 Flow -->
        <el-dialog title="流程查询" :visible.sync="dialogFlowVisible" :modal-append-to-body="false" :close-on-click-modal="false" custom-class="dialogClass">
            <el-form class="dt-content" id="bm-qa-template-add-flowSearch">
                <flow-inquire @thisSelectFlowVal="getSelectFlowVal"></flow-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer" id="bm-qa-template-add-flowFooter">
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
                <el-button type="primary" @click="submitDataSet" @hideParentDialog="hideParentDialog" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import flowInquire from '@components/flowTreeInq/flowInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {addTbaleDate,tempDetail} from '@api';
    export default {
        components: {
            flowInquire,
            dataSourceInquire
        },
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称'));
                }
                callback();
            };
            var addDataset = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入Data名称'));
                }
                callback();
            };
            return {
                options: [{
                    value: 'dataflow ',
                    label: 'dataflow '
                    }, {
                    value: 'streamflow',
                    label: 'streamflow'
                }],
                labelPosition: 'top',
                textShow:false,
                dialogFlowVisible:false,
                dialogDataSetVisible:false,
                getSelValFlowId:'',
                getSelValFlowName:'',
                getSelvalDataId:'',
                getSelvalDataName:'',
                addForm: {
                    name: '',
                    dataset: '',
                    flowType: 'dataflow',
                    flowID:'',
                    flowName:'',
                    description:''
                },
                add: {
                    name: [
                        { validator: addName, trigger: 'blur' }
                    ],
                    dataset: [
                        { validator: addDataset, trigger: 'change' }
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
            hideParentDialog(val){
                this.dialogDataSetVisible=val;
            },
            //获取子组件的flow
            getSelectFlowVal(data){
                this.getSelValFlowId = data.id;
                this.getSelValFlowName = data.name;
            },
            //获取子组件的data
            getSelectDateVal(data){
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
            },
            //监听flow输入的值，隐藏input
            flowInput:function (val) {
                if(val === ''){
                    this.textShow=false;
                }else{
                    this.textShow=true;
                }
            },
            //flow查询
            flowInquire:function () {
                //弹出"flow查询"层
                this.dialogFlowVisible = true;
            },
            //flow查询数据提交
            submitFlow:function () {
                if(this.getSelValFlowId === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.addForm.flowID = this.getSelValFlowId;
                    this.addForm.flowName = this.getSelValFlowName;
                    this.textShow = true;
                    this.dialogFlowVisible = false;
                }

            },
            //data查询
            dataInquire:function () {
                //弹出"data查询"层
                this.dialogDataSetVisible = true;
            },
            //data查询数据提交
            submitDataSet:function () {
                if(this.getSelvalDataName === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.addForm.dataset = this.getSelvalDataName;
                    this.cancelDatasetDialog();
                }

            },
            submitForm(formName,toRoutes) {

                var addForm={
                    'name':this.addForm.name,
                    'description':this.addForm.description,
                    'expiredPeriod':0,
                    'preProcessFlowId':this.addForm.flowID,
                    'preProcessFlowName':this.addForm.flowName,
                    'processDataId':this.addForm.dataset,
                    'flowType': this.addForm.flowType,
                    "processDataType":"Dataset"
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addTbaleDate(addForm).then(data => {
                            this.$message({
                                message: '恭喜你，新增数据已成功！',
                                type: 'success'
                            });
                            if(toRoutes == 'toRules'){
                            	
                            	tempDetail(data.id).then(res=>{
				        			this.$router.push({ name: "规则模板",params:{row:{processDataId:res.processDataId}}, query: {id: data.id, processDataId:res.processDataId}});
				        		}).catch(err=>{
				        			console.log(err);
				        		})
                            	
                                 //this.$router.push({ path: '/qualityAnalysis/analysisTemplate/rules?id='+data.id,query:{row:{processDataId:'test_标准_new'}}});
                                 /*this.$router.push({ name: "规则模板",params:{row:{processDataId:res.processDataId}}, query: {id: data.id}});*/
                                
                                
                                
                            }else {
                                return this.$router.push({ path: '/qualityAnalysis/analysisTemplate'});
                            }
                        }, err => {
                        	    //console.log(err.response.data.err);
                        	    if(err.response.data.err=='Name Duplicated'){
                        	    	
                        	    	this.$message({
                                    /*message: err.response.message,*/
                                    message:'保存失败，此名称已存在',
                                    type: 'error',
                                    duration: 1500
                                  });
                        	    }
                                
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            returnForm(){
                history.go(-1);
            },

        },
        mounted() {

        }

    }
</script>

<style scoped>
	.clearBox{
		padding-left: 20px;
		padding-top: 20px;
	}
    .demo-ruleForm{
        width: 50%;
    }
    .el-select{
        width: 100%;
    }
    /*.scroll-content{
    	height: calc(100vh - 330px);
    	overflow: auto;
    }*/
</style>