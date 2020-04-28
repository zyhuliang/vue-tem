<template>
    <div class="step4" id='bm-ch-col-step4-tmp'>
        <el-form id="bm-sh-step4-form" label-position="top" :model="step4Form" ref="step4Form" :rules="rules"
                 class="demo-step4">
            <!-- 表单项，prop属性表示要进行表单验证，验证规则对应为rules的属性name -->
            <el-form-item type="number" label="并行度" :label-width="formLabelWidth" prop="parallelism">
                <el-input name="bm-ch-step4Form-parallelism-input" type="text" v-model="step4Form.parallelism"
                          auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="错误记录上限数" :label-width="formLabelWidth" prop="errorNumber">
                <el-input name="bm-ch-step4Form-errorNumber-input" type="text" v-model="step4Form.errorNumber"
                          auto-complete="off" placeholder="错误记录数超过此值任务自动结束"></el-input>
            </el-form-item>

            <el-form-item label="Schema发生改变后，此任务应该" :label-width="formLabelWidth"
                          v-if="CollectorID && CollectorID!='WOVEN-SERVER'">
                <el-radio-group name="bm-ch-step4Form-stopOnSchemaChanged-radio" prop="stopOnSchemaChanged"
                                v-model="step4Form.stopOnSchemaChanged">
                    <el-radio :label="false">继续</el-radio>
                    <el-radio :label="true">停止</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="触发器" :label-width="formLabelWidth" prop="sliceType">
                <el-select name="bm-ch-step4Form-trigger-select" class='select-form-width' v-model="trigger"
                           @change="triggerChange(trigger)">
                    <el-option
                            v-for="item in triggerTypes"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="trigger == '周期执行' && dsType != 'SOCKET' ">
                <span>执行周期：   {{setCron}}</span>
                <el-button name="bm-ch-step4Form-showCron-button" v-show="isModify" type="text" @click="showCron">修改
                </el-button>
            </el-form-item>

            <el-form-item v-if="trigger == '周期执行' && dsType != 'SOCKET' ">
                <div id='cron-trigger'></div>
                <div id="trigger-result" hidden="true"></div>
            </el-form-item>

            <el-form-item label="增量字段" :label-width="formLabelWidth" prop="cursorCol"
                          v-if="trigger == '周期执行' && dsType != 'SOCKET'">
                <el-select name="bm-ch-step4Form-cursorCol-select" type="text" v-model="step4Form.cursorCol"
                           auto-complete="off" placeholder="增量字段">
                    <el-option key=""
                               label=""
                               value="">
                    </el-option>
                    <el-option
                            v-for="item in dateFields"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分区键" :label-width="formLabelWidth" prop="partitionKey">
                <el-select name="bm-ch-step4Form-partitionKey-select" type="text" v-model="step4Form.partitionKey"
                           auto-complete="off" placeholder="分区键" @change="partitionKeyType(step4Form.partitionKey)">
                    <el-option
                            v-for="item in st"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分区键格式" :label-width="formLabelWidth" prop="partitionPattern"
                          v-if="dsType != 'SOCKET' && isDate">
                样例: {{partitionKeyText}}
                <el-input name="bm-ch-step4Form-partitionPattern-input" type="textarea"
                          v-model="step4Form.partitionPattern" auto-complete="off" placeholder="yyyy-MM-dd"
                          @blur="changePartitionKeyFormat(step4Form.partitionPattern)"></el-input>
            </el-form-item>

            <el-form-item label="执行参数" :label-width="formLabelWidth" prop="opts">
                <el-input name="bm-ch-step4Form-opts-input" type="textarea" v-model="step4Form.opts" auto-complete="off"
                          placeholder="执行参数"></el-input>
            </el-form-item>

            <el-form-item label="缓冲区大小" :label-width="formLabelWidth" prop="bufferSize">
                <el-input name="bm-ch-step4Form-bufferSize-input" type="text" v-model="step4Form.bufferSize"
                          auto-complete="off" placeholder="缓冲区大小"></el-input>
            </el-form-item>

            <el-form-item label="延时刷出时间(毫秒)" :label-width="formLabelWidth" prop="flushPaddingTime">
                <el-input name="bm-ch-step4Form-flushPaddingTime-input" type="text" v-model="step4Form.flushPaddingTime"
                          auto-complete="off" placeholder="延时刷出时间"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import task from '@jsTask/taskStep.js';
    import {getPartitionKeyText, cronRun} from '@api';
    //周期引入的组件
    import * as jqueryCronMin from '@static/jsLibrary/cronLibrary/cron/jquery-cron-min.js';
    import jqueryCronCss from '@static/jsLibrary/cronLibrary/cron/jquery-cron.css';
    import * as jqueryGentleSelectMin from '@static/jsLibrary/cronLibrary/gentleSelect/jquery-gentleSelect-min.js';
    import jqueryGentleSelectCss from '@static/jsLibrary/cronLibrary/gentleSelect/jquery-gentleSelect.css';
    import cronstrue from 'cronstrue';

    export default {
        name: 'step4',
        components: {
            jqueryCronMin,
            jqueryCronCss,
            jqueryGentleSelectMin,
            jqueryGentleSelectCss,
            cronstrue,
        },
        data: function () {
            return {
                //增量字段只显示data和timepstamp
                dateFields:[],
                //datasource的类型
                dsType: "DB",
                //暂时先留着，如果是采集起任务为true
                CollectorID: false,
                //设置form元素左侧距离的变量
                formLabelWidth: '200px',
                //周期执行的select的option选项
                triggerTypes: ["单次执行", "周期执行"],
                //周期select的显示文字
                trigger: '单次执行',
                //分区间的标准文本
                partitionKeyText: '',
                //数据源的字段
                sf: [],
                //数据集的字段
                st: [],
                //分区键是不是date
                isDate: '',
                //form字段
                step4Form: {
                    //并行度
                    parallelism: 1,
                    //触发器
                    trigger: "",
                    //增量字段
                    cursorCol: "",
                    //错误记录上限
                    errorNumber: 0,
                    //分区键
                    partitionKey: "",
                    //Schema发生改变后，此任务应该停止
                    stopOnSchemaChanged: false,
                    //分区间格式
                    partitionPattern: "",
                    //缓冲区大小
                    bufferSize: 5000,
                    //延时刷出时间
                    flushPaddingTime: 30000

                },
                //周期的开始时间
                startTime: this.getCurrentTime(),
                //周期的结束时间
                endTime: new Date(3153600000000).getTime(),
                setCron: '',
                // 控制修改按钮的显示隐藏
                isModify: false,
                rules: {
                    parallelism: [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value) {
                                    callback('并行度不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {

                                    callback('并行度必须为数字值....');
                                }
                                callback(errors);
                            }
                        }
                    ],
                    errorNumber: [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value && value != 0) {
                                    callback('错误记录上限不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('错误记录上限必须为数字值....');
                                }
                                callback(errors);

                            }
                        }
                    ],
                    bufferSize: [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value && value != 0) {
                                    callback('缓冲区大小不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('缓冲区大小必须为数字值....');
                                }
                                callback(errors);

                            }
                        }
                    ],
                    flushPaddingTime: [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value && value != 0) {
                                    callback('延时刷出时间不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('延时刷出时间必须为数字值....');
                                }
                                callback(errors);

                            }
                        }
                    ],
                }
            }
        },
        methods: {
            //初始化step4
            init: function () {
                var that = this;
                //获取datasource的字段
                that.sf = [];
                if (that.sf[0] != '') that.sf[0] = ''
                that.step4Form.mappingSource.forEach(function (item) {
                    that.sf.push(item.sourceField)
                })
                //换取dataset的字段
                that.st = [];
                if (that.st[0] != '') {
                    that.st[0] = ''
                }
                that.step4Form.fieldMapping.forEach(function (item) {
                    if (item.sourceField != '')
                        that.st.push(item.targetField)
                })
                //获取datasource类型
                that.dsType = that.step4Form.dataSource.type.toUpperCase();
                //如果是周期执行就显示周期
                if (that.step4Form.trigger != '') {
                    that.setCron = cronstrue.toString(that.step4Form.trigger, {locale: "fr"})
                    that.isModify = true
                    that.trigger = "周期执行"
                } else {
                    that.trigger = "单次执行";
                }
                //验证是不是date类型数据
                that.partitionKeyType(that.step4Form.partitionKey)

            },
            //周期和单词之间的切换，初始化周期的参数
            triggerChange: function (val) {
                var that = this
                if (val == "周期执行") {
                    that.initTrigger()
                    that.isModify = false
                    that.endTime = new Date(3153600000000).getTime()
                } else {
                    that.step4Form.trigger = ''
                }
            },
            //是否显示周期执行
            showCron: function () {
                this.initTrigger();
                this.isModify = false
            },
            //初始化周期执行
            initTrigger: function () {
                var that = this
                $(function () {
                    // Initialize DOM with cron builder with options
                    $('#cron-trigger').cronBuilder({
                        selectorLabel: "选择时间段:  ",
                        language: "zh_CN",
                        onChange: function (expression) {
                            $('#trigger-result').text(expression);
                            var cron = expression.slice(0, expression.length - 1);
                            that.step4Form.trigger = cron
                            that.setCron = cronstrue.toString(cron, {locale: "fr"})
                            if (that.step4Form.trigger && that.step4Form.trigger != "单次执行") {
                                if (that.endTime) {
                                    var end = new Date(that.endTime);
                                } else {
                                    var end = new Data(that.endTime)
                                }
                                var start = new Date(that.startTime);
                                var cronParams = {
                                    cron: cron,
                                    end: end.getTime(),
                                    start: start.getTime()
                                }
                                cronRun(cronParams).then(data => {
                                    that.expectRunTime = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var a = new Date(data[i]);
                                        that.expectRunTime.push(a.toLocaleString())
                                    }
                                }, err => {
                                    this.$message({
                                        message: err.response.message,
                                        type: 'error',
                                        duration: 1500
                                    });
                                })
                            }
                        }
                    });
                });
            },

            //分区键变更时触发
            changePartitionKeyFormat: function (format) {
                var that = this;
                that.isSuccess = true;
                //调用api接口获取text
                getPartitionKeyText(format).then(res => {
                    that.partitionKeyText = res.text
                    that.isSuccess = res.success;
                    if (!that.isSuccess) {
                        this.$confirm("表达式书写错误!", "错误", {
                            type: "error"
                        })
                    }
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            //如果分区键是时间格式的要进行验证
            partitionKeyType: function (partitionKey) {
                var that = this;
                that.isDate = false;
                that.step4Form.fieldMapping.forEach(function (e) {
                    if (e.targetField == partitionKey) {
                        if (e.targetType.toLowerCase() == "date" || 'timestamp' == e.targetType.toLowerCase().substr(0, 9)) {
                            that.step4Form.partitionPattern = that.step4Form.partitionPattern? that.step4Form.partitionPattern: "yyyyMMdd";
                            that.changePartitionKeyFormat(that.step4Form.partitionPattern);
                            that.isDate = true;
                        } else {
                            that.step4Form.partitionPattern = "";
                        }
                        return;
                    }
                })
            }
        },
        created() {
            if (localStorage.taskEntity) {
                var that = this;
                //获取全局的entity
                that.step4Form = JSON.parse(localStorage.taskEntity);
                //获取采集器的id
                var httpArr = window.location.href.split('/')
                that.step4Form.collecterId = httpArr[httpArr.indexOf('step4') + 1]
                that.step4Form.resourceId = httpArr[httpArr.indexOf('step4') + 2]
                // 根据sft转换出dateFields
                this.dateFields = []
                if(this.step4Form.mappingSource) {
                    var that = this;
                    that.step4Form.mappingSource.forEach(function (item) {
                        if (item.sourceType.toUpperCase().indexOf('DATE') > -1 || item.sourceType.toUpperCase().indexOf('TIMESTAMP') > -1) {
                            that.dateFields.push(item.sourceField)
                        }
                    })
                }
                that.init();
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if (localStorage.taskEntity) {
                //获取全局的entity
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step4Form = that.copyObject(entity, that.step4Form)
                //如果是单次执行删除增量索引，增量字段置空
                if (that.step4Form.trigger == '') {
                    that.step4Form.cursorCol = ''
                    delete that.step4Form.cursorIdx
                }
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step4Form);
            }
            //如果在向导中跳转
            if (to.path.substr(0, 16) == '/taskWizard/step') {
                var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                var toStep = to.path.charAt(to.path.indexOf('taskWizard/step') + 15)
                if (fromStep > toStep) {
                    next();
                } else
                //如果验证都通过才可以下一步
                    that.$refs.step4Form.validate((valid) => {
                        if (valid) {
                            next();
                        } else {
                            //获取从第几步到第几步
                            var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                            task.$emit('taskNextStep', fromStep)
                            return false;
                        }
                    })
            } else {
                localStorage.removeItem('taskEntity');
                next();
            }
        },
    }
</script>
<style scoped lang="scss">
    .step4 {
        height: calc(100vh - 187px);
        overflow-y: auto;
        .demo-step4 {
            margin-left: 25%;
            width: 50%;
        }
    }

</style>
