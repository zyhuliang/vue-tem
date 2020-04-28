<template>
    <section class="job-cep-description">
        <!-- content -->
        <div class="descriptionContent">
            <el-form :id="'bm-stream-job-cep-description-form'" class="job-cep-description"
                     :model="entity.jobDesc.ruleProfiles[0]"
                     status-icon
                     ref="jobCepDescription"
                     :inline="false"
                     label-position="right">
                <el-form-item label="事件源" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入source', trigger:  ['blur', 'change'] }]">
                    <el-input placeholder="请选择内容"
                              class="input-form-width-big el-dataset-input-group" @input="dataSourceInquire('input')"
                              disabled v-model="entity.jobDesc.ruleProfiles[0].input.dataset.name">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"
                                   @click="dataSourceInquire('input')"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="分区键" :label-width="formLabelWidth">
                    <el-select multiple
                               v-model="entity.jobDesc.ruleProfiles[0].input.partitionKey"
                               class="input-form-width-big el-dataset-input-group"
                               placeholder="请选择">
                        <el-option
                                v-for="item in entity.jobDesc.ruleProfiles[0].input.schema.fields"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="规则" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入source', trigger:  ['blur', 'change'] }]">
                    <el-table :data="entity.jobDesc.ruleProfiles[0].rules"
                              style="width: 80%"
                              id="bm-noteset-transform-table"
                              height="calc(100vh - 310px)">
                        <el-table-column align="center">
                            <template slot-scope="scope">
                                <el-card class="box-card">
                                    <el-form :name="'bm-stream-tableProfiles-form'+scope.$index" class="table-profilesForm"
                                             :model="entity.jobDesc.ruleProfiles[0].rules[scope.$index]"
                                             status-icon
                                             ref="tableProfile"
                                             :inline="true"
                                             label-position="right">

                                        <el-form-item label="ID" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-ID-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].id"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="略过策略" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-afterMatchSkipStrategy-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].afterMatchSkipStrategy"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>

                                        <el-form-item label="连接器" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-connector-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].connector"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>

                                        <el-form-item label="规则量词" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-quantifier-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].quantifier"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>

                                        <el-form-item label="规则时限" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-within-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].within"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>

                                        <el-form-item label="过滤器" :label-width="formLabelWidth">
                                            <el-input name="bm-stream-job-cep-description-filters-input" type="text"
                                                      v-model="entity.jobDesc.ruleProfiles[0].rules[scope.$index].filters[0].code"
                                                      class="input-form-width el-dataset-input-group"
                                                      auto-complete="off"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" width="40" align="center">
                            <template slot-scope="scope" class="addOrDeleteButton">
                                <el-button type="danger" size="small" icon="el-icon-minus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="removeRules(scope.$index)"></el-button>
                                <el-button type="primary" size="small" icon="el-icon-plus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="addRules(scope.$index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item label="输出" :label-width="formLabelWidth" :rules="[{ required: true, trigger:  ['blur', 'change'] }]">
                    <el-input placeholder="请选择内容"
                              class="input-form-width-big el-dataset-input-group" @input="dataSourceInquire('outputs[0]')"
                              disabled v-model="entity.jobDesc.ruleProfiles[0].outputs[0].dataset.name">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"
                                   @click="dataSourceInquire('outputs[0]')"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        
        <div :class="draw?'clearfixDraw':'clearfix'">
            <el-tooltip class="run_stop_clear" effect="dark" content="debug" placement="top-end">
                <div v-if="!debugStatus" @click="debugChange(!debugStatus)"><img class="imgDebug"
                                                                                 src="../../../../assets/images/streamJob/run.png"/>
                </div>
                <div v-if="debugStatus" @click="debugChange(debugStatus)"><img class="imgDebug"
                                                                               src="../../../../assets/images/streamJob/stop.png"/>
                </div>
            </el-tooltip>
            <el-tooltip class="run_stop_clear" effect="dark" content="clear" placement="top-end">
                <div @click="clearLog"><img class="imgClear" src="../../../../assets//images/streamJob/delete.png"/></div>
            </el-tooltip>
        </div>

        <el-collapse accordion v-model="drawActiveName" :class="draw?'collapse-height-draw':'collapse-height'"
                     @change="changeLogDraw()">
            <template slot="title" class="collapse-header">

            </template>
            <el-collapse-item name="draw">
                <div class="log" v-if="isLog">
                    <div v-for="(log,i) in logs" :key="i">
                        <pre>{{log}}</pre>
                    </div>
                </div>
                <div class="log" v-if="!isLog">
                    <div>
                        <pre v-text="text"></pre>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <!-- Dataset dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass">
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDatesetVal" rootName="dataset_dir">
                </data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataset">确定</el-button>
                <el-button @click="cancelDatasetDialog">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    // 编写 语句
    import {sqlSelectFields, debugJobLog, debugStopJob, debugJob, postJob, getTemplateList, postTemplate} from '@api'
    import dataSourceInquire from '@components/dataSourceInq/dataSourceInquire.vue';

    export default {
        components: {
            dataSourceInquire,
        },
        data() {
            return {
                //日志信息的收缩状态
                draw: true,
                drawActiveName: [],
                sqlConfig: {
                    height: '100%'
                },
                loading: false,
                logs: [],
                isLog: false,
                text: '',
                dictionaries: {},
                querySql: "",//sql的语句
                entity: {
                    "jobDesc": {
                        "ruleProfiles": [{
                            "input": {
                                "dataset": {
                                    "id": "c15221b1-5360-4c3b-8e18-b1f2b6f49da1",
                                    "name": "flink_test1_data",
                                    "storage": "KAFKA",
                                    "storageConfigurations": {
                                        "topic": "test_socket1_1",
                                        "groupId": "test_new",
                                        "zookeeper": "info1:2181,info2:2181,info3:2181/europa/app/kafka",
                                        "format": "csv",
                                        "brokers": "info3:9093",
                                        "version": "0.10"
                                    }
                                },
                                "schema": {
                                    "id": "3bcfdf05-f1e2-4329-afa9-fbd861bd62ab",
                                    "name": "flink_test1_schema-copy-2017-03-14T06:39:34.551Z",
                                    "fields": [
                                        {
                                            "name": "id",
                                            "type": "int",
                                            "alias": ""
                                        },
                                        {
                                            "name": "name",
                                            "type": "string",
                                            "alias": ""
                                        },
                                        {
                                            "name": "age",
                                            "type": "int",
                                            "alias": ""
                                        }
                                    ]
                                },
                                "partitionKey": [
                                    "id"
                                ]
                            },
                            "rules": [
                                {
                                    "id": "r1",
                                    "afterMatchSkipStrategy": "NO_SKIP",
                                    "connector": "begin",
                                    "filters": [{
                                        "lang": "jexl",
                                        "type": "where",
                                        "code": ""
                                    }]
                                    ,
                                    "quantifier": "{3}"
                                },
                                {
                                    "id": "r2",
                                    "connector": "followedBy",
                                    "filters": [{
                                        "lang": "jexl",
                                        "type": "where",
                                        "code": ""
                                    }],
                                    "quantifier": "{3}",
                                    "within": "60"
                                }
                            ],
                            "outputs": [{
                                "mode": "ALL",
                                "schema": {
                                    "fields": [
                                        {
                                            "name": "id",
                                            "type": "int",
                                            "alias": ""
                                        },
                                        {
                                            "name": "name",
                                            "type": "string",
                                            "alias": ""
                                        },
                                        {
                                            "name": "name2",
                                            "type": "string",
                                            "alias": ""
                                        },
                                        {
                                            "name": "age",
                                            "type": "int",
                                            "alias": ""
                                        }
                                    ]
                                },
                                "dataset": {
                                    "id": "1",
                                    "name": "flink_output_name",
                                    "sliceTime": "",
                                    "sliceType": "H",
                                    "storage": "HDFS",
                                    "storageConfigurations": {
                                        "path": "/tmp/flink_test_agg1",
                                        "format": "csv",
                                        "separator": ","
                                    }
                                }
                            }]
                        }],
                        "settings": {
                            "streaming.flink.checkpoint.enabled": true,
                            "streaming.flink.checkpoint.interval.ms": "5000",
                            "streaming.flink.checkpoint.mode": "",
                            "streaming.flink.restartAttempts.enabled": true,
                            "streaming.flink.restartAttempts.delayInterval.sec": "30",
                            "streaming.flink.restartAttempts.num": "1",
                            "streaming.flink.state.backend.enabled": true,
                            "streaming.flink.state.backend.mode": "memory",
                            "streaming.flink.latency.tracking.enabled": false,
                            "streaming.flink.latency.tracking.interval.ms": "10000",
                            "streaming.flink.maxOutOfOrderness.enabled": true,
                            "streaming.flink.maxOutOfOrderness.ms": "0",
                        }
                    }
                },
                debugStatus: false,
                progressId: '',
                selectTemplateVisible: false,
                dialogDataVisible:false,
                multipleSelection: [],
                tableData: {},
                sqlFormatter: null,
                dialog: null,
                formLabelWidth: '200px',//lable的距离左侧的宽度
                getSelvalData: [],//存放数据集选择弹框的选中值
                datasetType: [],
                rowIndex: 0,
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //查询数据集选择的弹框
            dataSourceInquire: function (type) {
                this.datasetType = type;
                //弹出"data查询"层
                this.dialogDataVisible = true;
            },
            //获取子组件的选中data
            getSelectDatesetVal(data) {
                this.getSelvalData = data;
            },
            //data查询数据点击提交的回调
            submitDataset: function () {
                if (this.getSelvalData === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    //如果类型是source，就放入source，类型是output就加入output
                    if(this.datasetType == 'input'){
                        // 选择dataset之后更新entity的source
                        this.entity.jobDesc.ruleProfiles[0].input.dataset = this.getSelvalData
                        // schema存放dateste对应的schema
                        this.entity.jobDesc.ruleProfiles[0].input.schema = this.getSelvalData.schema
                        // 根据dataset获取source的名称和id
                        this.entity.jobDesc.ruleProfiles[0].input.name = this.getSelvalData.name
                        this.entity.jobDesc.ruleProfiles[0].input.id = this.getSelvalData.id
                         this.entity.jobDesc.ruleProfiles[0].input.partitionKey = []
                    }else{
                        // 选择dataset之后更新entity的source
                        this.entity.jobDesc.ruleProfiles[0].outputs[0].dataset = this.getSelvalData
                        // schema存放dateste对应的schema
                        this.entity.jobDesc.ruleProfiles[0].outputs[0].schema = this.getSelvalData.schema
                        // 根据dataset获取source的名称和id
                        this.entity.jobDesc.ruleProfiles[0].outputs[0].name =this.getSelvalData.name
                        this.entity.jobDesc.ruleProfiles[0].outputs[0].id =this.getSelvalData.id
                    }
                    this.cancelDatasetDialog();
                    sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
                }
            },
            //删除规则
            removeRules(rowIndex) {
                //如果只有一组数据就不允许删除
                if(this.entity.jobDesc.ruleProfiles[0].rules[rowIndex].length == 1){
                    this.$message({
                        message: '至少保留一组数据集配置',
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                this.entity.jobDesc.ruleProfiles[0].rules = this.arrayAddOrRemoreElement(this.entity.jobDesc.ruleProfiles[0].rules, rowIndex)
            },

            //添加规则
            addRules(rowIndex) {
                //定义新添加的表描述的字段结构
                var rule = {
                    "id":'',
                    "afterMatchSkipStrategy":'NO_SKIP',
                    "connector":'begin',
                    "quantifier":'',
                    "within":'',
                    "filters": [
                        {
                            "lang": "jexl",
                            "type": "where",
                            "code": ""
                        }
                    ]
                }
                this.entity.jobDesc.ruleProfiles[0].rules = this.arrayAddOrRemoreElement(this.entity.jobDesc.ruleProfiles[0].rules , rowIndex, rule)
            },
            //切换日志收缩状态的方法
            changeLogDraw(val) {
                this.draw = val ? false : !this.draw;
            },
            //清除日志按钮方法
            clearLog: function () {
                this.text = '';
                this.logs = [];
            },
            //切换debugger按钮状态
            debugChange: function () {
                //点击按钮日志显示出来
                this.drawActiveName = 'draw'
                this.changeLogDraw('notDraw')
                this.debugStatus = !this.debugStatus
                //如果是开启debug
                if (this.debugStatus) {
                    //调用启动debugger的方法
                    debugJob(this.entity).then((res) => {
                            this.progressId = res
                            // 调用成功天出提示信息
                            this.$message({
                                message: '恭喜你，调试状态已打开！',
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
                } else {
                    var tmpProgressId = this.progressId
                    //停止debug的时候就删除progressId，不用再发log请求
                    this.progressId = ''
                    //调用停止debugger的方法
                    debugStopJob(tmpProgressId).then((res) => {
                        // 停止之前要将滚动条放到最后位置
                        $('.log')[0].scrollTop = $('.log')[0].scrollHeight;
                        // 调用成功天出提示信息
                        this.$message({
                            message: '恭喜你，调试状态已关闭！',
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
            },
            //获取debug日志方法
            getDebugLog: function () {
                let height = $('.log-content').height()
                $('.log-content').css({
                    marginTop: -height + 'px'
                });
                if (this.progressId) {
                    var that = this;
                    debugJobLog(this.progressId).then((res) => {
                        for (var i = 0; i < res.length; i++) {
                            that.logs.push(res[i]);
                            this.isLog = true;
                        }
                        if (res.length > 0) {
                            $('.log')[0].scrollTop = $('.log')[0].scrollHeight;
                        }
                    })
                }
            },
            //初始化entity
            init(){
                this.entity = JSON.parse(sessionStorage.getItem('streamJobEntity'));
            },
        },
        beforeDestroy() {
            //在切换之前将此次修改同步到session中
            sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
            //切换页面时停止定时更新任务
            clearInterval(this.referenceProgress);
        },
        created() {
            this.init()
            //每隔2000ms执行一次查看日志方法
            this.referenceProgress = setInterval(this.getDebugLog, 2000);
        }

    }

</script>

<style scoped lang="scss">

    .job-cep-description {
        height: calc(100vh - 100px);
        overflow-y: auto;
        .clearfix {
            z-index: 10; /*z-index的值谁大谁在上面*/
            opacity: 1; /*透明度*/
            position: fixed;
            bottom: 180px;

            .imgClear {
                background-color: #fff;
                width: 20px;
                margin-left: 10px;
            }
            .imgDebug {
                background-color: #fff;
                width: 28px;
                margin-top: -5px;
            }
            .run_stop_clear {
                float: left;
            }
        }

        .clearfixDraw {
            z-index: 10; /*z-index的值谁大谁在上面*/
            opacity: 1; /*透明度*/
            position: fixed;
            bottom: 6px;

            .imgClear {
                background-color: #fff;
                width: 20px;
                margin-left: 10px;
            }
            .imgDebug {
                background-color: #fff;
                width: 28px;
                margin-top: -5px;
            }
            .run_stop_clear {
                float: left;
            }
        }
        .collapse-height {
            z-index: 9; /*z-index的值谁大谁在上面*/
            opacity: 1; /*透明度*/
            position: fixed;
            bottom: 0px;
            right: 0px;
            width: 100%;
            height: 220px;
            .log {
                overflow-y: auto;
                height: 170px;
            }
            .button-color {
                float: right;
                color: #fff;
            }
        }
        .collapse-header {
            background-color: #f5f7fa;
        }
        .collapse-height-draw {
            z-index: 9; /*z-index的值谁大谁在上面*/
            opacity: 1; /*透明度*/
            position: fixed;
            bottom: 0px;
            right: 0px;
            width: 100%;
        }
        .input-form-width-big{
            width: 80%;
        }
    }
</style>