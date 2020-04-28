<template>
    <section>
        <div class="view-content" style="top: 10px" id="bm-griffin-tenant-add">
            <el-form id="bm-griffin-tenant-add-form" :model="addForm" :label-position="labelPosition" status-icon :rules="addRule" ref="addForm" label-width="200px" class="demo-ruleForm">
                <el-form-item label="租户ID" prop="id" v-show="this.addForm.enabled == 1">
                    <el-input type="text" v-model="addForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="租户名称" prop="name" v-show="this.addForm.enabled == 1">
                    <el-input type="text" v-model="addForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="租户名称" prop="name" v-show="this.addForm.enabled != 1">
                    <el-input type="text" v-model="addForm.name" placeholder="创建后不可修改"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="text" v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="资源队列" prop="resourceQueues">
                    <el-select
                            v-model="addForm.resourceQueues"
                            multiple
                            placeholder="请选择资源队列">
                        <el-option
                                v-for="item in queuesInfo"
                                :key="item.index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理员密码" prop="adminPassword"  v-if="isEdit">
                    <el-input type="password" v-model="addForm.adminPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码确认" prop="rePassword" v-if="isEdit">
                    <el-input type="password" v-model="addForm.rePassword" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
                    <el-button @click="returnForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
</template>

<script>
    const Base64 = require("js-base64").Base64;
    import {tntQueuesInfo,addTenant,tenantDetail,updateTenant} from '@api';
    import { encrypt, decrypt } from '@components/encryption/aes.js'
    export default {
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称'));
                }else {
                    callback();
                }
            };
            var addPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(value.length < 6){
                    callback(new Error('密码太短(至少为6位)'));
                }else {
                    callback();
                }
            };
            var addRepassword = (rule, value, callback) => {
                if (this.addForm.rePassword !== this.addForm.adminPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                isEdit: true,
                enabled:0,              // 查看修改为1，创建为0
                labelPosition: 'right',
                cappedInfo:{},          // yarn上线信息
                tntMaxInfo:{},          // 租户最大值信息
                queuesInfo:[],          // 资源队列选项
                newResourceQueues:[],  // 资源队列
                selectedPermission:[],
                addForm: {
                    name:"",
                    description:"",
                    hosts:[],
                    adminPassword:"",
                    resourceQueues:"",
                    hdfsSpaceQuota:0,
                    rePassword:""
                },
                addRule: {
                    name: [
                        { required: true,validator: addName, trigger: 'blur' }
                    ],
                    adminPassword: [
                        { required: true, validator: addPassword, trigger: 'blur' },
                    ],
                    rePassword: [
                        { required: true, validator: addRepassword, trigger: 'blur' }
                    ],
                    resourceQueues: [
                        { required: true, message: '请选择资源队列', trigger: 'change'}
                    ],
                    description:[
                        { message: '请输入域名列表', trigger: 'change'}
                    ]
                },
                isNew:true,
            };
        },
        methods: {
             //初始化所需数据
            getInitData(){
                tntQueuesInfo().then(data =>{
                    this.queuesInfo = data;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
            // 查看用户具体信息
            getUserDetail(){
                if(this.$route.params.id){
                    this.isNew = false
                    var that = this;
                    tenantDetail(this.$route.params.id).then(data => {
                        if (data.status === 0) {
                            that.addForm= data.content;
                            that.enabled = this.addForm.enabled = 1;
                            that.addForm.rePassword = ''
                            that.addForm.adminPassword = ''
                            that.isEdit = false
                        } else {
                            this.$message({
                            message: data.message,
                            type: 'error',
                            duration: 1500
                        });
                        }
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    });
                    this.resetForm('addForm');
                }
            },
            // 保存按钮
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var dataParam = {
                            enabled: this.enabled,
                            hdfsSpaceQuota: 0,
                            id: this.addForm.id,
                            name: this.addForm.name,
                            adminPassword: encrypt(this.addForm.adminPassword), // 加密
                            resourceQueues: this.addForm.resourceQueues,
                            description:this.addForm.description,
                        }
                        if(this.isNew == true){
                            var _this= this
                            addTenant(dataParam).then(data => {
                                if (data.status === 0) {
                                    _this.$router.push({path:'/tenants'});
                                    _this.$message({
                                        message: '恭喜你，创建已成功',
                                        type: 'success'
                                    });
                                } else {
                                    _this.$message({
                                        message: data.message,
                                        type: 'error'
                                    });
                                }
                            }).catch(function (error) {
                                if (error.response) {
                                    if(error.response.status == 500){
                                        _this.$message({
                                            message: '创建失败，用户已存在',
                                            type: 'warning'
                                        });
                                    }
                                }
                            });
                        }else if(this.isNew == false){
                            // 加密
                            this.addForm.adminPassword = encrypt(this.addForm.adminPassword)
                            delete(this.addForm["rePassword"]);
                            updateTenant(this.addForm).then(data =>{
                                this.$router.push({path:'/tenants'});
                                this.$message({
                                    message: '恭喜你，修改已成功',
                                    type: 'success'
                                });
                            }, err => {
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            returnForm(){
                history.go(-1);
            },
        },
        mounted(){
            this.getUserDetail();
            this.getInitData();
        },
    }
</script>

<style lang="scss" scoped>
    .demo-ruleForm{
        width: 50%;
        .user-radio{
            width: 350px;
        }
        .el-input{
            width: 350px;
        }
        .el-form-item .el-select{
            width: 350px;

        }
        .el-form-item .el-radio-group{
            min-width: 350px;
        }
    }

</style>