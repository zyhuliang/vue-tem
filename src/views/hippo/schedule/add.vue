<template>
    <section class="clearBox boxClear" id="bm-hippo-schedule">
        <div class="qa-content">
            <el-form id="bm-hi-s-add-form" v-model="addForm" :label-position="labelPosition" status-icon
                     ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="主键" v-show="id != ''">
                    <el-input id="bm-hippo-schedule-id" type="text" v-model="id" auto-complete="off"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" required>
                    <el-input id="bm-hippo-schedule-name" type="text" v-model="addForm.name"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label="'预处理 Flow'|cn">
                    <el-input id="bm-hippo-schedule-flowName" placeholder="请选择内容" v-model="addForm.flowName"
                              @input="flowInput">
                        <el-button id="bm-hippo-schedule-flowName-btn" slot="append" icon="icon iconfont icon-ir-search"
                                   @click="flowInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select id="bm-hippo-schedule-schedulerId" v-model="addForm.schedulerId" placeholder="请选择"
                               class="select-with-select" @change="selectChange">
                        <el-option
                                id="bm-hippo-schedule-schedulerId-value"
                                v-for="item in options"
                                :key="item.schedulerId"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addForm.schedulerId == 'cron'">
                    <span>执行周期：   {{setCron}}</span>
                    <el-button id="bm-hippo-schedule-isModify" v-show="isModify" type="text" @click="showCron">修改
                    </el-button>
                </el-form-item>
                <el-form-item v-show="addForm.schedulerId == 'cron' && !isShowModifyCron">
                    <div id='cron'></div>
                    <div id="example1-result" hidden="true"></div>
                </el-form-item>
                <el-form-item label="开始时间">
                    <div class="block">
                        <el-date-picker
                                id="bm-hippo-schedule-timepicker-start"
                                type="date"
                                format="yyyy/MM/dd HH:mm:ss"
                                v-model="startTime"
                                @change="startTimeChange"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="结束时间" v-show="addForm.schedulerId == 'cron'">
                    <div class="block">
                        <el-date-picker
                                id="bm-hippo-schedule-timepicker-end"
                                v-model="endTime"
                                type="date"
                                format="yyyy/MM/dd HH:mm:ss"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <div v-for="item in getSelValFlowParam">
                    <el-form-item>{{item.name}}
                        <el-input type="text" v-model="item.value || item.defaultVal " auto-complete="off">
                            {{item.value || item.defaultVal}}
                        </el-input>
                    </el-form-item>
                </div>

                <!--高级选项-->
                <el-collapse v-model="activeNames" class="no-border">
                    <el-collapse-item title="高级选项" name="1" class="no-border"
                                      v-show="all.length != 0 || dataflow.length != 0 || streamflow.length != 0">
                        <h4 class="tab-title" v-show="all.length != 0">{{'all' | cn}}</h4>
                        <div v-for="item in all">
                            <el-form-item v-if="item.name !== 'all.runtime.cluster-id'">{{item.name | delPrefix | cn}}
                                <el-input type="text" v-model="item.value" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.name === 'all.runtime.cluster-id'">
                                {{item.name | delPrefix | cn}}
                                <el-select v-model="clusterId" v-if="id == ''" placeholder="请选择"
                                           class="select-with-select">
                                    <el-option
                                            v-for="i in item.value"
                                            :key="i"
                                            :label="i"
                                            :value="i">
                                    </el-option>
                                </el-select>
                                <el-input type="text" v-model="item.value" v-if="id !== ''"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                        </div>
                        <h4 class="tab-title" v-show="dataflow.length != 0">{{'dataflow' | cn}}</h4>
                        <div v-for="item in dataflow">
                            <el-form-item v-if="item.name !== 'dataflow.deploy-mode' && item.name !== 'dataflow.queue'">
                                {{item.name | delPrefix | cn }}
                                <el-input type="text" v-model="item.value" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item v-if="item.name === 'dataflow.deploy-mode'">
                                {{item.name | delPrefix | cn}}
                                <el-select v-model="DeployMode" v-if="id == ''" placeholder="请选择"
                                           class="select-with-select">
                                    <el-option
                                            v-for="i in item.value"
                                            :key="i"
                                            :label="i"
                                            :value="i">
                                    </el-option>
                                </el-select>
                                <el-input type="text" v-model="item.value" v-if="id !== ''"
                                          auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item v-if="item.name === 'dataflow.queue'">
                                {{item.name | delPrefix | cn}}
                                <el-select v-model="queue" v-if="id == ''" placeholder="请选择" class="select-with-select">
                                    <el-option
                                            v-for="i in queues"
                                            :key="i"
                                            :label="i"
                                            :value="i">
                                    </el-option>
                                </el-select>
                                <el-input type="text" v-model="item.value" v-if="id !== ''"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                        </div>
                        <h4 class="tab-title" v-show="streamflow.length != 0">{{'streamflow' | cn}}</h4>
                        <div v-for="item in streamflow">
                            <el-form-item v-if="item.name === 'streamflow.deploy-mode'">
                                {{item.name | delPrefix | cn}}
                                <el-select v-model="DeployMode" v-if="id == ''" placeholder="请选择"
                                           class="select-with-select">
                                    <el-option
                                            v-for="i in item.value"
                                            :key="i"
                                            :label="i"
                                            :value="i">
                                    </el-option>
                                </el-select>
                                <el-input type="text" v-model="item.value" v-if="id !== ''"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.name !== 'streamflow.deploy-mode'">{{item.name | delPrefix | cn}}
                                <el-input type="text" v-model="item.value" auto-complete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>

                <el-form-item id="bm-hippo-schedule-five" label="最近5次运行时间"
                              v-show="addForm.schedulerId == 'cron'">
                    <ol start="1" class="run-time">
                        <li v-for="(item,index) in expectRunTime">{{item}}</li>
                    </ol>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="!addForm.name || !addForm.flowName"
                               @click="submitForm('addForm','toReturn')" id="bm-hippo-schedule-determine">确定
                    </el-button>
                    <el-button @click="returnForm()"  id="bm-hippo-schedule-cancellation">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 预处理 Flow -->
        <el-dialog title="流程查询" id="bm-hippo-schedule-flowSearch" :visible.sync="dialogFlowVisible"
                   :modal-append-to-body="false" :close-on-click-modal="false" custom-class="dialogClass">
            <el-form class="dt-content" id="bm-flow-dialog-form">
                <flow-inquire @thisSelectFlowVal="getSelectFlowVal"></flow-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button id="bm-hippo-schedule-ok" type="primary" @click="submitFlow">确定</el-button>
                <el-button id="bm-hippo-schedule-cancel" @click="dialogFlowVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import flowInquire from '@components/flowTreeInq/flowInquire.vue';
    import {createSchedule, scheduleDetail, flowsDetail, updateSchedule, cronRun, flowParam} from '@api';
    import * as jqueryCronMin from '@static/jsLibrary/cronLibrary/cron/jquery-cron-min.js';
    import jqueryCronCss from '@static/jsLibrary/cronLibrary/cron/jquery-cron.css';
    import * as jqueryGentleSelectMin from '@static/jsLibrary/cronLibrary/gentleSelect/jquery-gentleSelect-min.js';
    import jqueryGentleSelectCss from '@static/jsLibrary/cronLibrary/gentleSelect/jquery-gentleSelect.css';
    import cronstrue from 'cronstrue';
    import {transformArr} from "@function/comFunction";

    export default {
        components: {
            flowInquire,
            jqueryCronMin,
            jqueryCronCss,
            jqueryGentleSelectMin,
            jqueryGentleSelectCss,
            cronstrue
        },
        filters: {
            delPrefix: function (value) {
                var index = value.indexOf('.');
                return value.substring(index + 1, value.length)
            }
        },
        data() {
            return {
                // 日期选择
                startTime: new Date(new Date().toLocaleDateString()).getTime(),
                endTime: new Date(3153600000000).getTime(),
                activeNames: [],
                labelPosition: 'top',
                textShow: false,
                dialogFlowVisible: false,
                getSelValFlowId: '', // 接受子组件返回内容
                getSelValFlowName: '',
                getSelValFlowType: "",
                getSelValFlowParam: [],
                cronContent: "",
                addForm: {
                    name: '',
                    flowId: '',
                    flowName: '',
                    flowType: '',
                    schedulerId: "once",
                    source: 'rhinos',
                    configurations: {
                        startTime: "",
                        arguments: [],
                        cron: '',
                        properties: []
                    },
                },
                options: [{
                    value: 'once',
                    label: '单次'
                }, {
                    value: 'cron',
                    label: '周期性'
                }],
                id: "",
                expectRunTime: [],
                all: [],
                streamflow: [],
                dataflow: [],
                setCron: '',
                isModify: false,     // 控制修改按钮的显示隐藏
                isShowModifyCron: false,      // 查看详情时点击修改才可看见
                DeployMode: 'client',       //参数变量deploy-mode的临时存储值
                clusterId: '',       //参数变量deploy-mode的临时存储值
                queue: '',
                queues: [],
                cronStatus: '',
                dependencies: []
            };
        },
        methods: {
            //根据flow获取flow的参数
            getFlowParam(flowId){
                var that = this;
                flowParam(flowId).then(data => {
                    this.all = [];
                    this.streamflow = [];
                    this.dataflow = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.indexOf("all") != -1) {
                            if (data[i].name.indexOf("all.runtime.cluster-id") != -1 && that.id == '') {
                                that.clusterId = data[i].value[0];
                            }
                            that.all.push(data[i])
                        } else if (data[i].name.indexOf("dataflow") != -1) {
                            if (data[i].name.indexOf("dataflow.queue") != -1 && that.id == '') {
                                that.queues = [];
                                for (var j = 0; j < data[i].value.length; j++) {
                                    that.queues[j] = data[i].value[j]
                                }
                                that.queue = that.queues[0];
                            }
                            that.dataflow.push(data[i])
                        } else if (data[i].name.indexOf("streamflow") != -1) {
                            that.streamflow.push(data[i])
                        }
                    }
                }, err => {
                    var _this = this;
                    if (err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                } )
            },
            //获取子组件的flow
            getSelectFlowVal(data) {
                this.getSelValFlowId = data.id;
                this.getSelValFlowName = data.name;
                this.getSelValFlowType = data.flowType;
                if (data.parameters) {
                    this.getSelValFlowParam = data.parameters;
                }
                this.dependencies = data.dependencies;
                this.getFlowParam(data.id)
            },
            //监听flow输入的值，隐藏input
            flowInput: function (val) {
                if (val === '') {
                    this.textShow = false;
                } else {
                    this.textShow = true;
                }
            },
            //flow查询
            flowInquire: function () {
                //弹出"flow查询"层
                this.dialogFlowVisible = true;
            },
            //flow查询数据提交
            submitFlow: function () {
                if (this.getSelValFlowId === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.addForm.flowId = this.getSelValFlowId;
                    this.addForm.flowName = this.getSelValFlowName;
                    this.addForm.flowType = this.getSelValFlowType;
                    this.textShow = true;
                    this.dialogFlowVisible = false;
                }

            },
            //时间格式转时间戳
            transFormTime: function (time) {
                var temp = new Date(time);
                return temp.getTime();
            },
            //确定按钮提交表单
            submitForm(formName, toRoutes) {
                //将deploy-mode的值修改之后保存
                for (var i = 0; i < this.dataflow.length; i++) {
                    if (this.dataflow[i].name === "dataflow.deploy-mode" && this.id == '') {
                        this.dataflow[i].value = this.DeployMode;
                    }
                    if (this.dataflow[i].name === "dataflow.queue" && this.id == '') {
                        this.dataflow[i].value = this.queue;
                    }
                }
                //将deploy-mode的值修改之后保存
                for (var i = 0; i < this.all.length; i++) {
                    if (this.all[i].name === "all.runtime.cluster-id" && this.id == '') {
                        this.all[i].value = this.clusterId;
                    }
                }
                if (!this.$route.params.id) {
                    var runTimeParams = this.all.concat(this.dataflow, this.streamflow)
                    var paramArr = [];
                    if (this.getSelValFlowParam) {
                        this.getSelValFlowParam.forEach(function (item, key, arr) {
                            var temp = {
                                name: item.name,
                                value: item.defaultVal
                            }
                            paramArr.push(temp)
                        })
                    }
                    // 拼装依赖
                    var depenVal = [];
                    for (var d = 0; d < transformArr(this.dependencies).length; d++) {
                        depenVal.push(this.dependencies[d].name)
                    }
                    if (depenVal == undefined) {
                        depenVal = [];
                    }

                    var onceConfigurations = {
                        'startTime': this.transFormTime(this.startTime),
                        'arguments': [],
                        'cron': "once",
                        // 'properties':getAllObj
                        'properties': runTimeParams,
                        'arguments': paramArr,
                        'dependencies': depenVal.toString()
                    }
                    var cronConfigurations = {
                        'arguments': paramArr,
                        'cron': this.addForm.configurations.cron,
                        'cronType': "simple",
                        'endTime': this.transFormTime(this.endTime),
                        // 'properties':getAllObj,
                        'properties': runTimeParams,
                        'startTime': this.transFormTime(this.startTime),
                        'dependencies': depenVal.toString()
                    }
                    var addForm = {
                        'name': this.addForm.name,
                        'flowId': this.addForm.flowId,
                        'flowName': this.addForm.flowName,
                        'flowType': this.addForm.flowType,
                        'schedulerId': this.addForm.schedulerId,
                        'source': "rhinos",
                        'configurations': this.addForm.schedulerId == "once" ? onceConfigurations : cronConfigurations,
                    };
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            createSchedule(addForm).then(data => {
                                    this.$router.push({"path": "/hippo/schedule"})
                                    this.$message({
                                        message: '恭喜你，新增数据已成功！',
                                        type: 'success'
                                    });
                                }, err => {
                                    var _this = this;
                                    if (err.response.status == 500) {
                                        _this.$message({
                                            message: err.response.data.err,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }
                                }
                            ).catch((error) => {
                                this.$message({
                                    message: error.response.data.err,
                                    type: 'error'
                                });
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    var runTimeParams = this.all.concat(this.dataflow, this.streamflow)
                    this.addForm.configurations.startTime = new Date(this.startTime).getTime()
                    this.addForm.configurations.endTime = this.endTime
                    this.addForm.configurations.cron = this.cronStatus
                    this.addForm.configurations.properties = runTimeParams
                    if (this.addForm.schedulerId == "once") {
                        delete  this.addForm.configurations.cron
                    }
                    updateSchedule(this.addForm).then(data => {
                            this.$router.push({"path": "/hippo/schedule"})
                            this.$message({
                                message: '恭喜你，修改已成功！',
                                type: 'success'
                            });
                        }, err => {
                            var _this = this;
                            if (err.response.status == 500) {
                                _this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    ).catch((error) => {
                        this.$message({
                            message: error.response.data.err,
                            type: 'error'
                        });
                    });
                }
            },
            //取消按钮返回原来页面
            returnForm() {
                history.go(-1);
            },
            //修改开始时间发送五次请求
            startTimeChange: function () {
                var cronParams = {
                    cron: this.addForm.configurations.cron,
                    end:  new Date(this.endTime).getTime(),
                    start:  new Date(this.startTime).getTime()
                }
                cronRun(cronParams).then(data => {
                    this.expectRunTime = [];
                    for (var i = 0; i < data.length; i++) {
                        var a = new Date(data[i]);
                        this.expectRunTime.push(a.toLocaleString())
                    }
                }, err => {
                    var _this = this;
                    if (err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //编辑周期数据
            getDetail: function () {
                // 存在id，进行请求
                var that = this;
                if (that.$route.params.id) {
                    that.id = that.$route.params.id;
                    scheduleDetail(that.$route.params.id).then(data => {
                        // 对高级字段进行展示
                        that.isModify = true
                        that.addForm = data;
                        if (that.addForm.schedulerId == "cron") {
                            that.cronStatus = that.addForm.configurations.cron
                            that.setCron = cronstrue.toString(that.addForm.configurations.cron, {locale: "fr"})
                            that.startTimeChange()
                        }
                        that.endTime = that.addForm.configurations.endTime
                        var higherFields = data.configurations.properties;
                        that.getSelValFlowParam = data.configurations.arguments;
                        that.dependencies = data.configurations.dependencies;
                        if (higherFields) {
                            for (var i = 0; i < higherFields.length; i++) {
                                if (higherFields[i].name.indexOf("all") != -1) {
                                    that.all.push(higherFields[i])
                                } else if (higherFields[i].name.indexOf("dataflow") != -1) {
                                    if (higherFields[i].name.indexOf("dataflow.queue") != -1 && that.id == '') {
                                        that.queues = [];
                                        for (var j = 0; j < higherFields[i].value.length; j++) {
                                            that.queues[j] = higherFields[i].value[j]
                                        }
                                        that.queue = that.queues[0];
                                    }
                                    that.dataflow.push(higherFields[i])
                                } else if (higherFields[i].name.indexOf("streamflow") != -1) {
                                    that.streamflow.push(higherFields[i])
                                }
                            }
                        }
                        that.startTime = new Date(that.addForm.configurations.startTime);
                    }, err => {
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })

                } else {
                    that.init()
                }
                // 存在param，进行请求
                if (that.$route.query.pid) {
                    flowsDetail(that.$route.query.pid).then(data => {
                            that.addForm.flowName = data.name;
                            that.addForm.flowId = data.id
                            that.addForm.flowType = data.flowType
                            that.getSelValFlowParam = data.parameters;
                            that.dependencies = data.dependencies;
                            flowParam(that.addForm.flowId).then(data => {
                                    that.all = [];
                                    that.streamflow = [];
                                    that.dataflow = [];
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].name.indexOf("all") != -1) {
                                            that.all.push(data[i])
                                        } else if (data[i].name.indexOf("dataflow") != -1) {
                                            if (data[i].name.indexOf("dataflow.queue") != -1 && that.id == '') {
                                                that.queues = [];
                                                for (var j = 0; j < data[i].value.length; j++) {
                                                    that.queues[j] = data[i].value[j]
                                                }
                                                that.queue = that.queues[0];
                                            }
                                            that.dataflow.push(data[i])
                                        } else if (data[i].name.indexOf("streamflow") != -1) {
                                            that.streamflow.push(data[i])
                                        }
                                    }
                                }, err => {
                                    var _this = this;
                                    if (err.response.status == 500) {
                                        _this.$message({
                                            message: err.response.message,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }
                                }
                            )
                        }, err => {
                            var _this = this;
                            if (err.response.status == 500) {
                                _this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    )

                }
            },
            //初始化周期数据
            init: function () {
                var that = this
                $(function () {
                    $('#cron').cronBuilder({
                        selectorLabel: "选择时间段:  ",
                        language: "zh_CN",
                        onChange: function (expression) {
                            $('#example1-result').text(expression);
                            var cron = expression.slice(0, expression.length - 1);
                            that.addForm.configurations.cron = cron
                            that.cronStatus = cron
                            that.setCron = cronstrue.toString(cron, {locale: "fr"})
                            if (that.addForm.configurations.cron && that.addForm.configurations.cron != "once") {
                                that.startTimeChange()
                            }
                        }
                    });
                });
            },
            //编辑周期任务时候点击编辑触发时事件
            showCron: function () {
                //之前的周期清空
                this.init();
                //显示出周期配置
                this.isModify = false
            },
            //改变开始时间触发函数
            startTimeChange: function () {
                var cronParams = {
                    cron: this.addForm.configurations.cron,
                    end: new Date(this.endTime).getTime(),
                    start: new Date(this.startTime).getTime()
                }
                cronRun(cronParams).then(data => {
                    this.expectRunTime = [];
                    for (var i = 0; i < data.length; i++) {
                        var a = new Date(data[i]);
                        this.expectRunTime.push(a.toLocaleString())
                    }
                }, err => {
                    var _this = this;
                    if (err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //周期和单词执行之间的切换
            selectChange: function (val) {
                if (val == "cron" && this.$route.params.id) {
                    this.init()
                    this.isModify = false
                    this.endTime = new Date(3153600000000).getTime()
                }
            }
        },
        mounted() {
            let flowId = this.$route.query.pid
            this.getFlowParam(flowId)
            sessionStorage.setItem('status', 'oldData'); // 设置design 返回时显示正常数据
            this.getDetail();
        },

    }
</script>
<style>
    .clearBox .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 292px !important;
    }

    .boxClear {
        left: 0px;
    }
</style>

<style scoped>
    .qa-content {
        padding: 20px;
    }

    .run-time {
        line-height: 20px;
    }

    .el-collapse {
        border: none;
    }

    .demo-ruleForm {
        width: 50%;
    }

    .select-with-select {
        width: 100%;
    }

    .no-border {
        border: none !important;
        color: #337ab7;
    }

    .tab-title {
        font-size: 22px !important;
        margin: 5px;
    }

    .el-form-item__label {
        font-size: 22px !important;
    }
</style>
