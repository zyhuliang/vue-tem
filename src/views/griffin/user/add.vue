<template>
    <section>
        <div class="view-content" style="top: 10px" id="bm-griffin-user-add">
            <el-form id="bm-useradd-form" :model="addForm" :label-position="labelPosition" status-icon :rules="addRule" ref="addForm" label-width="200px" class="demo-ruleForm">
                <el-form-item label="id" v-show="!isNew">
                    <el-input type="text" v-model="addForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input type="text" v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginId" v-show="!isNew">
                    <el-input type="text" v-model="addForm.loginId" disabled></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginId" v-show="isNew">
                    <el-input type="text" v-model="addForm.loginId"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="rePassword">
                    <el-input type="password" v-model="addForm.rePassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permissions"  v-show="!isAdmin">
                    <el-checkbox-group v-model="addForm.permissions">
                        <el-checkbox label="woven.user">大数据平台用户</el-checkbox>
                        <el-checkbox label="woven.admin" :disabled="currentUser != 'admin'">大数据平台管理员</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="权限" v-show="isAdmin">
                    <el-checkbox-group v-model="addForm.permissions">
                        <el-checkbox label="woven.user" disabled>大数据平台用户</el-checkbox>
                        <el-checkbox label="woven.admin"  disabled>大数据平台管理员</el-checkbox>
                    </el-checkbox-group>
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
                <el-form-item>
                    <el-button id="bm-griffin-user-add-center" type="primary" @click="submitForm('addForm')">确定</el-button>
                    <el-button id="bm-griffin-user-add-cancel" @click="returnForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
</template>

<script>
    import { addUser,tntQueuesInfo,userDetail,updateUser,tntQueuesInfoCurrent} from '@api';

    export default {
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入姓名'));
                }else {
                    callback();
                }
            };
            var addLoginId = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入登录名'));
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
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var addPermissions = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('选择一个权限'));
                }else if(value.length >= 2 && this.isAdmin == false){
                    callback(new Error('权限只能选择一个'));
                }else {
                    callback();
                }
            };
            return {
                isAdmin:false,
                isNew:true,
                enabled:0,              // 查看修改为1，创建为0
                labelPosition: 'right',
                queuesInfo:[],          // 资源队列选项
                newResourceQueues:[],  // 资源队列
                //selectedPermission:[],
                permission:[],
                addForm: {
                    name:"",
                    loginId:"",
                    password:"",
                    permissions:[],
                    resourceQueues:"",
                    roles:[],
                    hdfsSpaceQuota:0,
                   // type: [],
                },
                addRule: {
                    name: [
                        { required: true,validator: addName, trigger: 'blur' }
                    ],
                    loginId: [
                        { required: true, validator: addLoginId, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: addPassword, trigger: 'blur' },
                    ],
                    rePassword: [
                        { required: true, validator: addRepassword, trigger: 'blur' }
                    ],
                    permissions: [
//                        { type: 'array',required: true, message: '请至少选择一个权限', trigger: 'change' }
                        { type: 'array',required: true, validator: addPermissions, trigger: 'change' }
                    ],
                    resourceQueues: [
                        { required: true, message: '请选择资源队列', trigger: 'change'}
                    ],
                },
                currentUser:""
            };
        },
        created(){
            this.getUserDetail()
        },
        methods: {
            //初始化所需数据
            getInitData(){
                tntQueuesInfoCurrent().then(data =>{
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
                    userDetail(that.$route.params.id).then(data => {
                        //that.onTagAdded(data.resourceQueues[0],false);
                        that.addForm= data;
                        var tempPermission =[];
                        if(that.addForm.loginId == "admin"){
                            that.isAdmin = true
                        }
                        for(var i=0;i<that.addForm.permissions.length;i++){
                            if(that.addForm.permissions[i].name == "woven.user"){
                                tempPermission.push("woven.user");
                            }
                            if(that.addForm.permissions[i].name == "woven.admin"){
                                tempPermission.push("woven.admin");
                            }
                        }
                        that.addForm.permissions = tempPermission
                        that.enabled = this.addForm.enabled;
                        that.addForm.rePassword = this.addForm.password;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    });
                   // this.resetForm('addForm');
                }
            },
            // 保存按钮
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    var that =this
                    if (valid) {
                        if(that.addForm.permissions.indexOf("woven.user") != -1  && that.permission.length <= 0){
                            var temp1 ={
                                name:"woven.user"
                            }
                            that.permission.push(temp1);
                        }
                        if(that.addForm.permissions.indexOf("woven.admin") != -1  && that.permission.length <= 0){
                            var temp2 ={
                                name:"woven.admin"
                            }
                            that.permission.push(temp2);
                        }
                        var dataParam = {
                            enabled: that.enabled,
                            hdfsSpaceQuota: 0,
                            loginId: that.addForm.loginId,
                            maxCpus: that.addForm.maxCpus,
                            maxRam: that.addForm.maxRam,
                            maxRunningJobs: that.addForm.maxRunningJobs,
                            name: that.addForm.name,
                            password: that.addForm.password,
                            resourceQueues: that.addForm.resourceQueues,
                            permissions: that.permission,
                        }
                        if(this.isNew == true){
                            addUser(dataParam).then(data => {
                                that.$router.push({path:'/user'});
                                that.$message({
                                    message: '恭喜你，创建已成功',
                                    type: 'success'
                                });
                            }, err => {
                                    if(err.response.message.indexOf("user loginId already exists") == -1){
                                        this.$message({
                                            message: "用户已存在",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else if(err.response.data.err.indexOf("Data too long for column") != -1){
                                        this.$message({
                                            message: "登录名过长",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else{
                                        this.$message({
                                            message: err.response.message,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }
                                }
                            ).catch(function (error) {
                                if (error.response) {
                                    // The request was made and the server responded with a status code
                                    // that falls out of the range of 2xx
                                    console.log(error.response.data);
                                    console.log(error.response.status);
                                    console.log(error.response.headers);
                                    if(error.response.status == 500){
                                        that.$message({
                                            message: '创建失败，用户已存在',
                                            type: 'success'
                                        });
                                    }
                                }
                            });

                        }else if(that.isNew == false){
                            delete(that.addForm["rePassword"]);
                            updateUser(that.addForm).then(data =>{
                                that.$router.push({path:'/user'});
                                that.$message({
                                    message: '恭喜你，修改已成功',
                                    type: 'success'
                                });
                            }, err => {
                                    this.$message({
                                        message: err.response.message,
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            )
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
           this.currentUser = sessionStorage.getItem("user");
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
        .el-form-item{
            margin-bottom: 15px;
        }
        .el-form-item .el-select{
            width: 350px;

        }
        .el-form-item .el-radio-group{
            min-width: 350px;
        }
    }

</style>