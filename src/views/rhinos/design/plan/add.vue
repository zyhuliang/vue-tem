<template>
    <section class="clearBox2" id="bm-rh-design-add">
        <h1>创建流程执行计划</h1>
        <el-form id="bm-rh-paddflow-form" :model="addForm" :label-position="labelPosition" status-icon :rules="add" ref="addForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="名称" prop="">
                <el-input type="text" v-model="addForm.name" auto-complete="off" name="name"></el-input>
            </el-form-item>
            <el-form-item label="流程ID" prop="">
                <el-input placeholder="" :disabled="disflowId" v-model="addForm.flowId" class="input-with-select" name="flowId">
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="flowInquire" name="flowInquire"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="addForm.type" style="width:100%;" placeholder="请选择">
                    <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :name="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-input type="text" v-model="addForm.startTime" auto-complete="off" name="startTime"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="resetForm('addForm')" name="sureBtn">确定</el-button>
                <el-button @click="returnForm()" name="cancelBtn">取消</el-button>
            </el-form-item>
        </el-form>

        <!-- 流程ID Flow -->
        <el-dialog v-dialog-drag title="流程查询" :visible.sync="dialogFlowVisible" :modal-append-to-body="false">
            <el-form id="bm-rh-pflowid-form">
                <flow-inquire @thisSelectFlowVal="getSelectFlowVal"></flow-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFlow" name="footer-sure">确定</el-button>
                <el-button @click="dialogFlowVisible = false" name="footer-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>

    import flowInquire from '@components/flowTreeInq/flowInquire.vue';

    export default {
        components: {
            flowInquire
        },
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称）'));
                }
            };
            var addExplain = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入说明信息'));
                }
            };
            return {
                labelPosition: 'top',
                dialogFlowVisible:false,
                disflowId: true,
                typeOptions:[{
                    value: '选项1',
                    label: '单次'
                }, {
                    value: '选项2',
                    label: '多次'
                }],
                addForm: {
                    name: '',
                    flowId: '',
                    type: '',
                    startTime:'',
                    explain: '',
                },
                add: {
                    name: [
                        { validator: addName, trigger: 'blur' }
                    ],
                    explain: [
                        { validator: addExplain, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //获取子组件的flow
            getSelectFlowVal(data){
                this.getSelValFlowId = data.id;
                this.getSelValFlowName = data.name;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            returnForm(){
                history.go(-1);
            },
            //引入流程ID查询组件
            flowInquire:function () {
                //弹出"flow查询"层
                this.dialogFlowVisible = true;
            },
            submitFlow(formName,toRoutes) {
                var addForm={
                    'name':this.addForm.name,
                    'description':this.addForm.description,
                    'expiredPeriod':0,
                    'preProcessFlowId':this.addForm.flowID,
                    'preProcessFlowName':this.addForm.flowName,
                    'processDataId':this.addForm.dataset,
                    "processDataType":"Dataset"
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
//                        addTbaleDate(addForm).then(data => {
//                            this.$message({
//                                message: '恭喜你，新增数据已成功！',
//                                type: 'success'
//                            });
//                            if(toRoutes == 'toRules'){
//                                return this.$router.push({ path: '/qualityAnalysis/analysisTemplate/rules?id='+data.id});
//                            }else {
//                                return this.$router.push({ path: '/qualityAnalysis/analysisTemplate'});
//                            }
//                        }).catch((error) => {
//                            console.log(error.respons);
//                            this.$message({
//                                message: error.response.data.err,
//                                type: 'error'
//                            });
//                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        mounted() {
        }
    }

</script>

<style scoped lang="scss">
    .clearBox2{
        position: absolute;
        background-color: #fff;
        width: 100%;
        margin-left: 0px;
        padding:0px;
        top: -61px;
        box-sizing: border-box;
        z-index: 100;
        min-height: 120%;
        max-height:10000px;
    }
    .con-module h1{
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        font-weight: normal;
        padding: 0px;
        margin: 0px;
        border-bottom: 1px solid #dddddd;
    }
    .demo-ruleForm{
        margin-top: 10px;
        width: 50%;
    }
</style>