<template>
    <section class="clearBox">
        <div class="view-content" style="top: 10px" id="bm-hippo-addrule">
            <el-form id="bm-hippo-addrule-form" :model="addForm" :label-position="labelPosition" status-icon
                     :rules="addRule" ref="addForm" label-width="200px"
                     class="demo-ruleForm">
                <el-form-item label="id:" v-show="this.addForm.id">
                    <el-input id="bm-hippo-addrule-form-id" type="text" v-model="addForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input id="bm-hippo-addrule-form-name" type="text:" v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述:" prop="description">
                    <el-input id="bm-hippo-addrule-form-des" type="text" v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="通知邮箱:" prop="email">
                    <el-input id="bm-hippo-addrule-form-email" type="email" v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="单个任务失败超过(次):" prop="failed">
                    <el-input id="bm-hippo-addrule-form-failed" type="text" v-model="addForm.failed"></el-input>
                </el-form-item>
                <el-form-item label="任务等待时间超过(分钟):" prop="waitTime">
                    <el-input id="bm-hippo-addrule-form-waitTime" type="text" v-model="addForm.waitTime"></el-input>
                </el-form-item>
                <el-form-item label="负责人:" prop="principal">
                    <el-input id="bm-hippo-addrule-form-principal" type="principal"
                              v-model="addForm.principal"></el-input>
                </el-form-item>
                <el-form-item label="告警等级:">
                    <div class="alarm-statusType">
                        <el-select id="bm-hippo-addrule-form-alarm-type" v-model="addForm.type" placeholder="warning">
                            <el-option
                                    v-for="item in alarmType_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button id="bm-hippo-addrule-ok" type="primary" @click="submitForm('addForm')">确定</el-button>
                    <el-button id="bm-hippo-addrule-cancel" @click="returnForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
</template>

<script>
    import {getAlarmRule, createAlarmRule, updateAlarmRule} from '@api';
    import resIn from './alarmNav.js'

    export default {
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称'));
                } else {
                    callback();
                }
            };
            var addFailed = (rule, value, callback) => {
                var p = /[a-z]/i;
                var b = p.test(value);
                if (b || value.length > 9 || value * 1 < 0 || Math.floor(value * 1) != value) {
                    callback(new Error('请输入正整数(长度0-9位)'));
                } else {
                    callback();
                }
            };
            var addWaitTime = (rule, value, callback) => {
                var p = /[a-z]/i;
                var b = p.test(value);
                if (b || value.length > 9 || value * 1 < 0 || Math.floor(value * 1) != value) {
                    callback(new Error('请输入正整数(长度0-9位)'));
                } else {
                    callback();
                }
            };
            return {
                alarmType_options: [{
                    value: 'warning',
                    label: '警告'
                }, {
                    value: 'serious',
                    label: '严重'
                }, {
                    value: 'deadly',
                    label: '致命'
                }],
                isNew: true,
                enabled: 0,              // 查看修改为1，创建为0
                labelPosition: 'right',
                addForm: {
                    name: "",
                    description: "",
                    email: "",
                    failed: 0,
                    waitTime: 0,
                    type: 'warning',
                    principal: '',
                    enabled: 1,
                },
                addRule: {
                    name: [
                        {required: true, validator: addName, trigger: 'blur'}
                    ],
                    failed: [
                        {required: true, validator: addFailed, trigger: 'blur'}
                    ],
                    waitTime: [
                        {required: true, validator: addWaitTime, trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            // 告警规则具体信息
            getUserDetail() {
                if (this.$route.params.id) {
                    var that = this;
                    this.isNew = false;
                    getAlarmRule(that.$route.params.id).then(data => {
                        that.addForm = data;
                    }, err => {
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    });
                    this.resetForm('addForm');
                }
            },
            // 保存按钮
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    var that = this
                    if (valid) {
                        if (that.isNew) {
                            createAlarmRule(this.addForm).then(data => {
                                that.$router.push({path: '/hippo/alarm/rule'});
                                that.$message({
                                    message: '恭喜你，创建已成功',
                                    type: 'success'
                                });
                                resIn.$emit('refreshList');
                            }, error => {
                                var err = error.response.data.err
                                if (err.indexOf('Duplicate') > -1)
                                    err = '保存失败，此名称已存在'
                                var _this = this;
                                if (err.response.status == 500) {
                                    _this.$message({
                                        message: err,
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            }).catch(function (error) {
                                if (error.response) {
                                    // The request was made and the server responded with a status code
                                    // that falls out of the range of 2xx
                                    console.log(error.response.data);
                                    console.log(error.response.status);
                                    console.log(error.response.headers);
                                    if (error.response.status == 500 && error.response.data.err.indexOf("Duplicate") != "-1") {
                                        that.$message({
                                            message: '创建失败，用户已存在',
                                            type: 'warning'
                                        });
                                    }
                                }
                            });
                        } else {
                            updateAlarmRule(this.addForm).then(data => {
                                    +
                                        that.$router.push({path: '/hippo/alarm/rule'});
                                    that.$message({
                                        message: '恭喜你，更新已成功',
                                        type: 'success'
                                    });
                                    resIn.$emit('refreshList');
                                }, err => {
                                    var err = err.response.data.err
                                    if (err.indexOf('Duplicate') > -1)
                                        err = '保存失败，此名称已存在'
                                    var _this = this;
                                    if (err.response.status == 500) {
                                        _this.$message({
                                            message: err,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }
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
            returnForm() {
                history.go(-1);
            },
            // 比较函数,0返回较大值，1返回较小值
            compare(first, second, way) {
                if (way == 0) {   // 返回大值
                    if (first > second) {
                        return first;
                    } else {
                        return second;
                    }
                } else {   // 返回小值
                    if (first < second) {
                        return first
                    } else {
                        return second
                    }
                }
            },
        },
        mounted() {
            this.getUserDetail();
        },
    }
</script>

<style lang="scss" scoped>
    .demo-ruleForm {
        width: 50%;
        .el-input {
            width: 350px;
        }
        .alarm-statusType {
            float: left;
            width: 260px;
            height: 34px;
            line-height: 34px;
            h4 {
                margin: 0px;
                float: left;
            }
            .el-select {
                float: left;
                width: 345px;
                margin-left: 5px;
            }
        }
    }

</style>