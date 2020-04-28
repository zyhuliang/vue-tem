<template>
    <!--编辑采集器信息-->
    <el-dialog
            :visible.sync="dialogEditCollectorVisible"
            width="50%"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :title="isNew?'新建采集器':'编辑采集器'"
            custom-class="redialogClass"
            id='bm-ch-col-edit-tmp'
    >
        <el-form id="bm-collectoredit-form" :model="addForm" :label-position="labelPosition" :rules="add" ref="addForm"
                 label-width="100px" class="demo-ruleForm">
            <el-form-item label="主键" prop="id">
                <el-input name='bm-ch-col-edit-id-input' type="text" v-model="addForm.id" auto-complete="off"
                          :disabled="!isNew" placeholder="必填"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input name='bm-ch-col-edit-name-input' type="text" v-model="addForm.name" auto-complete="off"
                          placeholder="必填"></el-input>
            </el-form-item>
            <el-form-item label="密钥" prop="secretKey">
                <el-input name='bm-ch-col-edit-secretKey-input' type="password" v-model="addForm.secretKey"
                          auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>

            <el-form-item label="操作系统">
                <el-select
                        name='bm-ch-col-edit-platform-select'
                        auto-complete="off"
                        value-key="platform"
                        v-model="addForm.platform">
                    <el-option
                            v-for="item in platforms"
                            :key="item"
                            :name="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运行时路径">
                <el-input name='bm-ch-col-edit-javaPath-input' type="text" v-model="addForm.javaPath"
                          placeholder="/usr/jdk64/jdk1.8.0_77" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="安装路径">
                <el-input name='bm-ch-col-edit-installPath-input' type="text" v-model="addForm.installPath"
                          placeholder="/app/linkoop/collecter" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="版本">
                <el-select
                        name='bm-ch-col-edit-cversion-select'
                        auto-complete="off"
                        value-key="cversion"
                        v-model="addForm.cversion">
                    <el-option
                            v-for="item in selecteds"
                            :key="item"
                            :name="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm('addForm')" name="bm-ch-col-edit-form-ok">确定</el-button>
            <el-button @click="dialogEditCollectorVisible = false" name="bm-ch-col-edit-form-cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {createCollector } from '@api'

    export default {
        name: 'editCollector',
        data() {
            var addId = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入ID'));
                } else callback();
            };
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称'));
                } else callback();
            };
            var addSecretKey = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密钥'));
                } else callback();
            };
            return {
                isNew: true,
                dialogEditCollectorVisible: false,
                platforms: ['linux'/*, 'windows'*/],
                selecteds: ['1.0'],
                labelPosition: 'top',
                addForm: {
                    id: "",
                    name: '',
                    secretKey: '',
                    platform: 'linux',
                    javaPath: '',
                    installPath: '',
                    cversion: '1.0',
                },
                add: {
                    id: [
                        {validator: addId, trigger: 'blur'}
                    ],
                    name: [
                        {validator: addName, trigger: 'blur'}
                    ],
                    secretKey: [
                        {validator: addSecretKey, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                //编辑之后的提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                            createCollector(this.addForm).then(data => {
                                this.dialogEditCollectorVisible = false
                                this.$emit('getList');
                            }, err => {
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            })

                    } else {
                        return false;
                    }
                });
            },
            getCollector(row) {
                this.dialogEditCollectorVisible = true
                if (row) {
                    this.isNew = false;
                    this.addForm.id = row.id;
                    this.addForm.name = row.name;
                    this.addForm.secretKey = row.secretKey;
                    this.addForm.platform = row.platform;
                    this.addForm.javaPath = row.javaPath;
                    this.addForm.installPath = row.installPath;
                    this.addForm.cversion = row.cversion;
                } else {
                    this.isNew = true;
                    this.addForm.id = "";
                    this.addForm.name = "";
                    this.addForm.secretKey = "";
                    this.addForm.platform = "linux";
                    this.addForm.javaPath = "";
                    this.addForm.installPath = "";
                    this.addForm.cversion = '1.0';
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            returnForm() {
                history.go(-1);
            }
        },
    }
</script>
<style lang="scss" scoped>
    .demo-ruleForm {
        float: left;
        width: 100%;
        padding: 10px;
        height: calc(80vh - 120px) !important;
        margin-bottom: 20px;
        overflow-y: auto;
    }
</style>