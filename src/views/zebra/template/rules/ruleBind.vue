<template>
    <section class="clearBox" id="bm-qa-template-rules-rulebind">
        <div class="box-wrapper">
            <span>查看模板-规则绑定</span>
            <el-button @click="lock" v-if="editable == false" icon="fa fa-unlock">&nbsp;锁定</el-button>
            <el-button type="primary" @click="open" v-if="editable == true" icon="fa fa-lock">&nbsp;解锁</el-button>
            <el-form id="bm-z-t-r-r-form" :model="addForm" label-position="top" status-icon ref="addForm"
                     label-width="100px"
                     :rules="add"
                     :disabled="editable"
                     class="demo-ruleForm">
                <el-form-item label="主键" prop="id">
                    <el-input type="text" v-model="addForm.id" disabled="disabled" auto-complete="off"
                              name="id"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="addForm.name" auto-complete="off" name="name"></el-input>
                </el-form-item>
                <el-form-item label="模板主键" prop="modelId">
                    <el-input disabled="disabled" type="text" v-model="addForm.modelId" auto-complete="off"
                              name="modelId"></el-input>
                </el-form-item>
                <el-form-item label="规则主键" prop="ruleId">
                    <el-input placeholder="规则选择（必选）" v-model="addForm.ruleId" class="input-with-select" disabled
                              name="ruleId">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="rulesInquire"
                                   name="rulesInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="规则名称" prop="ruleName">
                    <el-input type="text" v-model="addForm.ruleName" auto-complete="off" disabled
                              name="ruleName"></el-input>
                </el-form-item>
                <el-form-item label="权重" prop="priority">
                    <el-tooltip class="priorityMes" placement="top" effect="light">
                        <div slot="content">合法值0 - 10。 值越大，质量评级权重越高</div>
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                    <el-input type="text" v-model="addForm.priority" name="priority"></el-input>
                </el-form-item>
                <el-form-item label="输入范围" prop="dataScope">
                    <el-input type="text" v-model="addForm.dataScope" disabled name="dataScope"></el-input>
                </el-form-item>
                <el-form-item label="字段名" prop="fieldName">
                    <el-input placeholder="字段名（必填）" v-model="addForm.fieldName" class="input-with-select"
                              name="fieldName">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire"
                                   name="fieldInquire"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="表达式输入字段" prop="expreInputField" v-if="showInputELColumns">
                    <el-input type="text" v-model="addForm.expreInputField" placeholder="输入字段名,逗号分隔(必填)"
                              name="expreInputField">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire2"
                                   name="fieldInquire2"></el-button>

                    </el-input>
                </el-form-item>

                <el-form-item label="自定义表达式" prop="customExpression" v-if="showCustomExpression">
                    <el-input type="text" v-model="addForm.customExpression"

                              placeholder="自定义表达式(必填)" name="customExpression"></el-input>
                </el-form-item>

                <el-form-item label="正则表达式" prop="regularExpression" v-if="showRegExpression">
                    <el-input type="text" v-model="addForm.regularExpression" placeholder="正则表达式(必填)"
                              name="regularExpression"></el-input>
                </el-form-item>

                <el-form-item label="缺省日期格式" prop="dafaultDate" v-if="showDateFormat">
                    <el-select v-model="addForm.dafaultDate" style="width:100%;" placeholder="请选择" name="dafaultDate">
                        <el-option
                                v-for="item in dateOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="计数不同值／唯一值等" prop="count" v-if="showCount">
                    <el-input placeholder="输入字段名，逗号分隔(必填)" v-model="addForm.count" class="input-with-select"
                              name="count">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire3"
                                   name="fieldInquire3"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="数据集" v-if="showDataset" prop="dataset">
                    <el-input placeholder="数据选择" class="input-with-select" v-model="addForm.dataset" name="dataset">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataInquire"
                                   name="dataInquire"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="数据集字段" v-if="showDataField" prop="datasetField">
                    <el-input type="text" placeholder="数据集字段(必填)" v-model="addForm.datasetField"
                              name="datasetField"></el-input>
                </el-form-item>

                <el-form-item label="分组列（逗号分隔）" prop="groupingColumns" v-if="showGroupCol">
                    <el-input type="text" v-model="addForm.groupingColumns" placeholder="输入字段名，逗号分隔(必填)"
                              name="groupingColumns">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire4"
                                   name="fieldInquire4"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="聚合列（逗号分隔）" prop="aggregateColumn" v-if="showPolyCol">
                    <el-input type="text" v-model="addForm.aggregateColumn" placeholder="输入字段名，逗号分隔(必填)"
                              name="aggregateColumn">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire5"
                                   name="fieldInquire5"></el-button>
                    </el-input>
                </el-form-item>
                <div v-if="showStatistics">
                    <el-form-item label="范围起始值(包括此值)" prop="rangeStartVal">
                        <el-input type="text" placeholder="范围起始值(包括此值)" v-model="addForm.rangeStartVal"
                                  name="rangeStartVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围结束值(不包括此值)" prop="rangeEndVal">
                        <el-input type="text" placeholder="范围结束值(不包括此值)" v-model="addForm.rangeEndVal"
                                  name="rangeEndVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围基准值" prop="rangeBaseVal">
                        <el-input type="text" placeholder="范围基准值" value="0" v-model="addForm.rangeBaseVal"
                                  name="rangeBaseVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围段大小" prop="rangeSize">
                        <el-input type="text" placeholder="范围段大小(必填)" v-model="addForm.rangeSize"
                                  name="rangeSize"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="自定义 SQL 表达式" prop="sqlExpression" v-if="showSql">
                    <el-input type="text" placeholder="自定义 SQL 表达式(必填)" v-model="addForm.sqlExpression"
                              name="sqlExpression"></el-input>
                </el-form-item>


                <el-form-item label="输出字段" v-if="showOutpuistFields" prop="outputField">
                    <el-input type="text" placeholder="输入字段名,逗号分隔(必填)" v-model="addForm.outputField" name="outputField">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="fieldInquire1"
                                   name="fieldInquire1"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="打分方式" prop="scoreWay" v-if="showScoreMethod">
                    <!--<el-input type="text"  v-model="addForm.scoreWay"></el-input>-->
                    <el-select v-model="addForm.scoreWay" style="width:100%;" placeholder="请选择" name="scoreWay">
                        <el-option
                                v-for="item in scoreOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="坏数据行数限制" prop="badDataLimit" v-if="showOutputLimit">
                    <el-input type="text" v-model="addForm.badDataLimit" placeholder="坏数据行数限制"
                              name="badDataLimit"></el-input>
                </el-form-item>

                <!--<el-form-item>
                    <el-button  type="primary" @click="saveForm('addForm')" :disabled="editable">确定</el-button>
                    <el-button @click="returnForm()">取消</el-button>
                </el-form-item>
                -->
            </el-form>
            <el-button type="primary" @click="saveForm('addForm')" :disabled="editable"
                       name="bm-qa-template-rules-rulebind-sure">确定
            </el-button>
            <el-button @click="returnForm()" name="bm-qa-template-rules-rulebind-cancle">取消</el-button>
        </div>

        <!-- 规则ID 查询 -->
        <el-dialog title="规则查询" :visible.sync="dialogRulesVisible" :modal-append-to-body="false" class="dialogBox">
            <el-form id="bm-rulesinq-form">
                <rules-inquire @thisSelectRulesVal="getSelectRulesVal"></rules-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer-rule">
                <el-button type="primary" @click="submitRules">确定</el-button>
                <el-button @click="dialogRulesVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--选择字段(字段名)-->
        <el-dialog title="选择字段" :visible.sync="showFieldDialog" :modal-append-to-body="false">
            <div class="bb">
                <div class="field-left">
                    <div class="title">
                        <span>选项</span>
                        <i title="新增已选字段" class="ns_fields1 el-icon-plus" @click="newAdd"></i>
                        <i title="消除已选状态" class="ns_fields2 el-icon-refresh" @click="refresh"></i>
                    </div>
                    <ul>
                        <li v-for="(item,index) in fieldsList"
                            ref="lis"
                            @click.stop="handleItem($event)" class="">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
                <div class="field-right">
                    <div class="title">
                        <span class="checked">已选</span>
                        <span class="deleteAll" @click="deleteAll"><i class="el-icon-close"></i>删除全部</span>
                    </div>
                    <ul ref="hasSelect">
                        <li v-for="(item,index) in hasChose"
                            ref="ites"
                            @click="deleteItem(index)">{{item}} <i class="el-icon-close delItem"></i></li>
                    </ul>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" id="bm-qa-template-rules-rulebind-field">
                <el-button type="primary" @click="submitField" name="field-sure">确定</el-button>
                <el-button @click="showFieldDialog = false" name="field-cancle">取消</el-button>
            </div>
        </el-dialog>
        <!-- 数据集查询 dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass"
                   append-to-body>
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
                                     rootName="dataset_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>

</template>

<script>
    import {ruleBind, ruleForm, fieldsList, saveEditRule} from '@api'
    import rulesInquire from '@components/rulesInq/rulesInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    export default {
        components: {
            rulesInquire,
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
                    callback(new Error('请选择数据集'));
                }
                callback();
            };
            var addCustomExpression = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入自定义表达式'));
                }
                callback();
            };
            var addPriority = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入权重'));
                }
                callback();
            };
            var addRuleId = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择规则'));
                }
                callback();
            };
            var addFieldName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择字段'));
                }
                callback();
            };
            var addExpreInputField = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择字段'));
                }
                callback();
            }
            var addOutputField = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择字段'));
                }
                callback();
            }
            var addRegularExpression = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入表达式'));
                }
                callback();
            }
            var addCount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择字段'));
                }
                callback();
            }
            var addDatasetField = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入字段'));
                }
                callback();
            }
            var addGroupingColumns = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入字段'));
                }
                callback();
            }
            var addAggregateColumn = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入字段'));
                }
                callback();
            }
            var addRangeSize = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入范围段'));
                }
                callback();
            }
            var addSqlExpression = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入表达式'));
                }
                callback();
            }
            return {
                editable: true,
                row: this.$route.params.row,
                ruleId: '',
                getRuleOutput: [],
                getRuleInput: [],
                ruleNochangeIn: {},
                ruleNochangeOut: {},
                showInputELColumns: false,
                showCustomExpression: false,
                showRegExpression: false,
                showDateFormat: false,
                showCount: false,
                showDataset: false,
                showDataField: false,
                showGroupCol: false,
                showPolyCol: false,
                showStatistics: false,
                showSql: false,
                showOutpuistFields: false,
                showScoreMethod: false,
                showOutputLimit: false,
                scoreOptions: [],
                dateOptions: [],
                dialogRulesVisible: false,
                dialogDataSetVisible: false,
                showFieldDialog: false,
                fieldsList: [],
                hasChose: ['*'],
                flag: false, //字段名标识
                flag1: false, //输出字段标识
                flag2: false,  //表达式输入字段标识
                flag3: false,//计数不同值
                flag4: false,//分组列
                flag5: false, //聚合列
                childVal: false,//是否有从规则查询子组件传过来值
                inputVal: [],
                outputVal: [],
                ruleNochangeOutputVal: [],
                ruleNochangeInputVal: [],
                addForm: {
                    id: '',
                    name: '',
                    modelId: '',
                    ruleId: '',
                    ruleName: '',
                    priority: '',
                    dataScope: '',
                    fieldName: '',
                    expreInputField: '',
                    customExpression: '',
                    regularExpression: '',
                    dafaultDate: 'yyyy-MM-dd-HH-mm-ss',
                    count: '',
                    dataset: '',
                    datasetField: '',
                    groupingColumns: '',
                    aggregateColumn: '',
                    rangeStartVal: '',
                    rangeEndVal: '',
                    rangeBaseVal: '',
                    rangeSize: '',
                    sqlExpression: '',
                    outputField: '',
                    scoreWay: '',
                    badDataLimit: ''
                },
                add: {
                    name: [
                        {validator: addName, trigger: 'blur'}
                    ],
                    dataset: [
                        {validator: addDataset, trigger: 'change'}
                    ],
                    customExpression: [
                        {validator: addCustomExpression, trigger: 'blur'}
                    ],
                    priority: [
                        {validator: addPriority, trigger: 'blur'}
                    ],
                    ruleId: [
                        {validator: addRuleId, trigger: 'blur'}
                    ],
                    fieldName: [
                        {validator: addFieldName, trigger: 'change'}
                    ],
                    expreInputField: [
                        {validator: addExpreInputField, trigger: 'change'}
                    ],
                    outputField: [
                        {validator: addOutputField, trigger: 'change'}
                    ],
                    regularExpression: [
                        {validator: addRegularExpression, trigger: 'blur'}
                    ],
                    count: [
                        {validator: addCount, trigger: 'blur'}
                    ],
                    datasetField: [
                        {validator: addDatasetField, trigger: 'blur'}
                    ],
                    groupingColumns: [
                        {validator: addGroupingColumns, trigger: 'blur'}
                    ],
                    aggregateColumn: [
                        {validator: addAggregateColumn, trigger: 'blur'}
                    ],
                    rangeSize: [
                        {validator: addRangeSize, trigger: 'blur'}
                    ],
                    sqlExpression: [
                        {validator: addSqlExpression, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog() {
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //解锁
            open() {
                this.editable = false;
            },
            lock() {
                this.editable = true;
            },
            getRuleCon() {
                ruleBind(this.$route.query.id, this.$route.params.ruleId).then(res => {
                    console.log(res);
                    this.addForm.id = res.id;
                    this.addForm.name = res.name;
                    this.addForm.modelId = res.modelId;
                    this.addForm.ruleId = res.ruleId;
                    this.addForm.ruleName = res.ruleName;
                    this.addForm.priority = res.priority;
                    this.addForm.fieldName = res.dataId;
                    this.ruleNochangeIn = res.inputParams.inputGroup;
                    this.ruleNochangeOut = res.inputParams.outputGroup;
                    //inputGroup部分
                    if (res.inputParams.inputGroup) {
                        for (var i in res.inputParams.inputGroup) {
                            if (res.inputParams.inputGroup[i].name == 'inputELColumns') {

                                this.addForm.expreInputField = res.inputParams.inputGroup[i].value;
                                this.showInputELColumns = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'customExpression') {
                                this.addForm.customExpression = res.inputParams.inputGroup[i].value;
                                this.showCustomExpression = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'ruleRegexDefaultPattern') {
                                this.addForm.regularExpression = res.inputParams.inputGroup[i].value;
                                this.showRegExpression = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'ruleDefaultDateFormat') {
                                this.addForm.dafaultDate = res.inputParams.inputGroup[i].value;
                                this.showDateFormat = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'countDistinctFields') {
                                this.addForm.count = res.inputParams.inputGroup[i].value;
                                this.showCount = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'lookupDataset') {
                                this.addForm.dataset = res.inputParams.inputGroup[i].value;
                                this.showDataset = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'lookupDatasetFieldName') {
                                this.addForm.datasetField = res.inputParams.inputGroup[i].value;
                                this.showDataField = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'groupByColumns') {
                                this.addForm.groupingColumns = res.inputParams.inputGroup[i].value;
                                this.showGroupCol = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'aggregationColumns') {
                                this.addForm.aggregateColumn = res.inputParams.inputGroup[i].value;
                                this.showPolyCol = true;
                            }
                            /*字段值分布统计*/
                            if (res.inputParams.inputGroup[i].name == 'valueStartFrom') {
                                this.addForm.rangeStartVal = res.inputParams.inputGroup[i].value;
                                this.showStatistics = true;
                            }
                            if (res.inputParams.inputGroup[i].name == 'valueEndTo') {
                                this.addForm.rangeEndVal = res.inputParams.inputGroup[i].value;
                            }
                            if (res.inputParams.inputGroup[i].name == 'valueBase') {
                                this.addForm.rangeBaseVal = res.inputParams.inputGroup[i].value;
                            }
                            if (res.inputParams.inputGroup[i].name == 'valueStep') {
                                this.addForm.rangeSize = res.inputParams.inputGroup[i].value;
                            }
                            if (res.inputParams.inputGroup[i].name == 'customSqlValidation') {
                                this.addForm.sqlExpression = res.inputParams.inputGroup[i].value;
                                this.showSql = true;
                            }
                        }
                    }
                    //outputGroup部分
                    if (res.inputParams.outputGroup) {
                        for (var i in res.inputParams.outputGroup) {
                            if (res.inputParams.outputGroup[i].name == 'outputFields') {
                                this.addForm.outputField = res.inputParams.outputGroup[i].value;
                                this.showOutpuistFields = true;
                            }
                            if (res.inputParams.outputGroup[i].name == 'qualityType') {
                                this.addForm.scoreWay = res.inputParams.outputGroup[i].value;
                                this.showScoreMethod = true;
                            }
                            if (res.inputParams.outputGroup[i].name == 'outputLimit') {
                                this.addForm.badDataLimit = res.inputParams.outputGroup[i].value;
                                this.showOutputLimit = true;
                            }
                        }//循环结束处
                    }
                    this.getDataScope();
                })
                console.log(this.row)
            },
            //有些字段要从规则查询接口获取
            getDataScope() {
                ruleForm(this.addForm.ruleId)
                    .then(res => {
                        this.addForm.dataScope = res.dataScope;
                        for (var i = 0; i < res.ruleOption.paramsMap.outputGroup.length; i++) {
                            if (res.ruleOption.paramsMap.outputGroup[i].name == 'qualityType') {
                                this.scoreOptions = res.ruleOption.paramsMap.outputGroup[i].valueOptions;
                            }
                        }
                        for (var i = 0; i < res.ruleOption.paramsMap.inputGroup.length; i++) {
                            if (res.ruleOption.paramsMap.inputGroup[i].name == 'ruleDefaultDateFormat') {
                                this.dateOptions = res.ruleOption.paramsMap.inputGroup[i].valueOptions;
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            //规则查询---------------------------------
            rulesInquire() {
                this.dialogRulesVisible = true;
            },
            //获取子组件的Rules
            getSelectRulesVal(id, name, ruleClass, ruleOutput, ruleInput, dataScope, fieldValueType) {
                this.childVal = true;
                this.getSelValRulesId = id;
                this.getSelValRulesName = name;
                //获取从子组件传来的输入范围
                this.getSelscope = dataScope;
                this.getFieldValueType = fieldValueType;
                this.getRuleOutput = ruleOutput;
                this.getRuleInput = ruleInput;
            },
            //提交规则查询
            submitRules() {
                this.showOutpuistFields = false;
                this.showScoreMethod = false;
                this.showOutputLimit = false;
                this.showInputELColumns = false;
                this.showCustomExpression = false;
                this.showRegExpression = false;
                this.showDateFormat = false;
                this.showCount = false;
                this.showDataset = false;
                this.showDataField = false;
                this.showGroupCol = false;
                this.showPolyCol = false;
                this.showStatistics = false;
                this.showSql = false;
                this.dialogRulesVisible = false;
                this.addForm.ruleId = this.getSelValRulesId;
                this.addForm.ruleName = this.getSelValRulesName;
                this.addForm.dataScope = this.getSelscope;
                //当规则ID不为空时，字段名为可编写状态
                if (this.addForm.rulesId !== '') {
                    this.disField = false;
                }
                // this.addForm.flowID='*';


                //控制某些input标签的显示隐藏
                if (this.getRuleOutput) {
                    for (var i = 0; i < this.getRuleOutput.length; i++) {
                        if (this.getRuleOutput[i].name == 'outputFields') {
                            this.showOutpuistFields = true;
                            this.addForm.outputField = this.getRuleOutput[i].defaultValue;
                        }
                        if (this.getRuleOutput[i].name == 'qualityType') {
                            this.showScoreMethod = true;
                            this.scoreOptions = this.getRuleOutput[i].valueOptions;
                            this.addForm.scoreWay = this.getRuleOutput[i].valueOptions[0];
                        }
                        if (this.getRuleOutput[i].name == 'outputLimit') {
                            this.showOutputLimit = true;
                            this.addForm.badDataLimit = this.getRuleOutput[i].defaultValue;
                        }
                    }
                }
                if (this.getRuleInput) {
                    for (var i = 0; i < this.getRuleInput.length; i++) {
                        if (this.getRuleInput[i].name == 'inputELColumns') {
                            this.showInputELColumns = true;
                            this.addForm.expreInputField = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'customExpression') {
                            this.showCustomExpression = true;
                        }
                        if (this.getRuleInput[i].name == 'ruleRegexDefaultPattern') {
                            this.showRegExpression = true;
                            this.addForm.regularExpression = this.getRuleInput[i].defaultValue
                        }
                        if (this.getRuleInput[i].name == 'ruleDefaultDateFormat') {
                            this.showDateFormat = true;
                            this.dateOptions = this.getRuleInput[i].valueOptions;
                        }
                        if (this.getRuleInput[i].name == 'countDistinctFields') {
                            this.showCount = true;
                            this.addForm.count = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'lookupDataset') {
                            this.showDataset = true;
                        }
                        if (this.getRuleInput[i].name == 'lookupDatasetFieldName') {
                            this.showDataField = true;
                            this.addForm.datasetField = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'groupByColumns') {
                            this.showGroupCol = true;
                        }
                        if (this.getRuleInput[i].name == 'aggregationColumns') {
                            this.showPolyCol = true;
                            this.addForm.aggregateColumn = this.getRuleInput[i].defaultValue;
                        }
                        /*字段值分布统计*/
                        if (this.getRuleInput[i].name == 'valueStartFrom') {
                            this.showStatistics = true;
                        }
                        if (this.getRuleInput[i].name == 'customSqlValidation') {
                            this.showSql = true;
                            this.addForm.sqlExpression = this.getRuleInput[i].defaultValue;
                        }
                    }
                }
            },
            /*字段选择部分------------------------------*/
            newAdd() {

                for (var i = 0; i < this.$refs.lis.length; i++) {
                    if (this.$refs.lis[i].className == 'active') {
                        this.hasChose.push(this.$refs.lis[i].innerText)
                    }
                }
            },
            refresh() {
                console.log(this.$refs.lis);
                for (var i = 0; i < this.$refs.lis.length; i++) {
                    this.$refs.lis[i].className = '';
                    this.fieldsList[i].show = false;
                }
            },
            //获取字段列表
            getFieldsList() {
                fieldsList(this.$route.params.row.processDataId).then(data => {
                    console.log(data.fields);
                    this.fieldsList = data.fields;
                })
            },
            deleteAll() {
                this.hasChose = [];
            },
            //点击确定时，根据不同按钮提交不同的值
            submitField() {
                if (this.flag == true) {
                    this.addForm.fieldName = this.hasChose.join(',');
                }

                if (this.flag1 == true) {
                    this.addForm.outputField = this.hasChose.join(',');
                }

                if (this.flag2 == true) {
                    this.addForm.expreInputField = this.hasChose.join(',');
                }
                if (this.flag3 == true) {
                    this.addForm.count = this.hasChose.join(',');
                }
                if (this.flag4 == true) {
                    this.addForm.groupingColumns = this.hasChose.join(',');
                }
                if (this.flag5 == true) {
                    this.addForm.aggregateColumn = this.hasChose.join(',');
                }
                //this.addForm.inputField=this.hasChose.join(',');
                this.flag = false;
                this.flag1 = false;
                this.flag2 = false;
                this.flag3 = false;
                this.flag4 = false;
                this.flag5 = false;
                this.showFieldDialog = false;
                //this.refresh();
            },
            deleteItem(index) {
                for (var i = 0; i < this.$refs.ites.length; i++) {
                    if (i == index) {
                        this.hasChose.splice(i, 1);
                    }
                }
            },
            handleItem(e) {
                //alert(!item.show);
                //item.show = !item.show;
                if (e.target.className.indexOf('active') == -1) {
                    e.target.className = 'active';
                } else {
                    e.target.className = '';
                }
            },
            fieldInquire() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];

                if (this.addForm.fieldName != '') {
                    this.hasChose = this.addForm.fieldName.split(',');
                }
                this.flag = true;
                this.showFieldDialog = true;
            },
            fieldInquire1() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];
                this.flag1 = true;
                this.showFieldDialog = true;
                if (this.addForm.outputField != '') {
                    this.hasChose = this.addForm.outputField.split(',');
                }
            },
            fieldInquire2() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];

                if (this.addForm.expreInputField != '') {
                    this.hasChose = this.addForm.expreInputField.split(',');
                }
                this.flag2 = true;
                this.showFieldDialog = true;
            },
            fieldInquire3() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];

                if (this.addForm.count != '') {
                    this.hasChose = this.addForm.count.split(',');
                }
                this.flag3 = true;
                this.showFieldDialog = true;
            },
            fieldInquire4() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];
                if (this.addForm.groupingColumns != '') {
                    this.hasChose = this.addForm.groupingColumns.split(',');
                }
                this.flag4 = true;
                this.showFieldDialog = true;
            },
            fieldInquire5() {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];
                if (this.addForm.aggregateColumn != '') {
                    this.hasChose = this.addForm.aggregateColumn.split(',');
                }
                this.flag5 = true;
                this.showFieldDialog = true;
            },
            //数据集弹窗---------------------
            //data查询数据提交
            submitDataSet() {
                if (this.getSelvalDataName === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.addForm.dataset = this.getSelvalDataName;
                    this.cancelDatasetDialog();
                    console.log(this.getSelvalDataId)
                }
            },
            //获取子组件的data
            getSelectDateVal(data) {
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
            },
            dataInquire() {
                //弹出"data查询"层
                this.dialogDataSetVisible = true;
            },
            returnForm() {
                history.back(-1)
            },
            //保存时分两种情况，一种是选择规则的保存，一种是没有选择规则的保存
            saveForm(formName) {
                var addForm = {
                    'id': this.addForm.id,
                    'name': this.addForm.name,
                    "modelId": this.addForm.modelId,
                    'dataId': this.addForm.fieldName,
                    'ruleId': this.addForm.ruleId,
                    'ruleName': this.addForm.ruleName,
                    'priority': this.addForm.priority,
                    "inputParams": {
                        "outputGroup": {},
                        "inputGroup": {}
                    }
                };
                //保存时上传表单的形式  outputGroup
                if (this.getRuleOutput) {
                    for (var i = 0; i < this.getRuleOutput.length; i++) {
                        if (this.getRuleOutput[i].name == 'outputFields') {
                            this.outputVal[i] = this.addForm.outputField;
                        }
                        if (this.getRuleOutput[i].name == 'qualityType') {
                            this.outputVal[i] = this.addForm.scoreWay
                        }
                        if (this.getRuleOutput[i].name == 'outputLimit') {
                            this.outputVal[i] = this.addForm.badDataLimit;
                        }
                        addForm.inputParams.outputGroup[i] = {
                            "name": this.getRuleOutput[i].name,
                            "value": this.outputVal[i]
                        }
                    }
                }
                //当没有变化规则时
                if (this.childVal == false) {
                    for (var i in this.ruleNochangeOut) {
                        if (this.ruleNochangeOut[i].name == 'outputFields') {
                            this.ruleNochangeOutputVal[i] = this.addForm.outputField;
                        }
                        if (this.ruleNochangeOut[i].name == 'qualityType') {
                            this.ruleNochangeOutputVal[i] = this.addForm.scoreWay;
                        }
                        if (this.ruleNochangeOut[i].name == 'outputLimit') {
                            this.ruleNochangeOutputVal[i] = this.addForm.badDataLimit;
                        }
                        addForm.inputParams.outputGroup[i] = {
                            "name": this.ruleNochangeOut[i].name,
                            "value": this.ruleNochangeOutputVal[i]
                        }
                    }
                }
                //保存时上传表单的形式 inputGroup
                if (this.getRuleInput) {
                    for (var i = 0; i < this.getRuleInput.length; i++) {
                        if (this.getRuleInput[i].name == 'inputELColumns') {
                            this.inputVal[i] = this.addForm.expreInputField;
                        }
                        if (this.getRuleInput[i].name == 'customExpression') {
                            this.inputVal[i] = this.addForm.customExpression;
                        }
                        if (this.getRuleInput[i].name == 'ruleRegexDefaultPattern') {
                            this.inputVal[i] = this.addForm.regularExpression;
                        }
                        if (this.getRuleInput[i].name == 'ruleDefaultDateFormat') {
                            this.inputVal[i] = this.addForm.dafaultDate;
                        }
                        if (this.getRuleInput[i].name == 'countDistinctFields') {
                            this.inputVal[i] = this.addForm.count;
                        }
                        if (this.getRuleInput[i].name == 'lookupDataset') {
                            this.inputVal[i] = this.addForm.dataset;
                        }
                        if (this.getRuleInput[i].name == 'lookupDatasetFieldName') {
                            this.inputVal[i] = this.addForm.datasetField;
                        }
                        if (this.getRuleInput[i].name == 'groupByColumns') {
                            this.inputVal[i] = this.addForm.groupingColumns;
                        }
                        if (this.getRuleInput[i].name == 'aggregationColumns') {
                            this.inputVal[i] = this.addForm.aggregateColumn;
                        }
                        if (this.getRuleInput[i].name == 'valueStartFrom') {
                            this.inputVal[i] = this.addForm.rangeStartVal;
                        }
                        if (this.getRuleInput[i].name == 'valueEndTo') {
                            this.inputVal[i] = this.addForm.rangeEndVal;
                        }
                        if (this.getRuleInput[i].name == 'valueBase') {
                            this.inputVal[i] = this.addForm.rangeBaseVal;
                        }
                        if (this.getRuleInput[i].name == 'valueStep') {
                            this.inputVal[i] = this.addForm.rangeSize;
                        }
                        if (this.getRuleInput[i].name == 'customSqlValidation') {
                            this.inputVal[i] = this.addForm.sqlExpression;
                        }
                        addForm.inputParams.inputGroup[i] = {
                            "name": this.getRuleInput[i].name,
                            "value": this.inputVal[i]
                        }
                    }
                }
                //当没有变化规则时
                if (this.childVal == false) {
                    for (var i in this.ruleNochangeIn) {
                        if (this.ruleNochangeIn[i].name == 'inputELColumns') {
                            this.ruleNochangeInputVal[i] = this.addForm.expreInputField;
                        }
                        if (this.ruleNochangeIn[i].name == 'customExpression') {
                            this.ruleNochangeInputVal[i] = this.addForm.customExpression;
                        }
                        if (this.ruleNochangeIn[i].name == 'ruleRegexDefaultPattern') {
                            this.ruleNochangeInputVal[i] = this.addForm.regularExpression;
                        }
                        if (this.ruleNochangeIn[i].name == 'ruleDefaultDateFormat') {
                            this.ruleNochangeInputVal[i] = this.addForm.dafaultDate;
                        }
                        if (this.ruleNochangeIn[i].name == 'countDistinctFields') {
                            this.ruleNochangeInputVal[i] = this.addForm.count;
                        }
                        if (this.ruleNochangeIn[i].name == 'lookupDataset') {
                            this.ruleNochangeInputVal[i] = this.addForm.dataset;
                        }
                        if (this.ruleNochangeIn[i].name == 'lookupDatasetFieldName') {
                            this.ruleNochangeInputVal[i] = this.addForm.datasetField;
                        }
                        if (this.ruleNochangeIn[i].name == 'groupByColumns') {
                            this.ruleNochangeInputVal[i] = this.addForm.groupingColumns;
                        }
                        if (this.ruleNochangeIn[i].name == 'aggregationColumns') {
                            this.ruleNochangeInputVal[i] = this.addForm.aggregateColumn;
                        }
                        if (this.ruleNochangeIn[i].name == 'valueStartFrom') {
                            this.ruleNochangeInputVal[i] = this.addForm.rangeStartVal;
                        }
                        if (this.ruleNochangeIn[i].name == 'valueEndTo') {
                            this.ruleNochangeInputVal[i] = this.addForm.rangeEndVal;
                        }
                        if (this.ruleNochangeIn[i].name == 'valueBase') {
                            this.ruleNochangeInputVal[i] = this.addForm.rangeBaseVal;
                        }
                        if (this.ruleNochangeIn[i].name == 'valueStep') {
                            this.ruleNochangeInputVal[i] = this.addForm.rangeSize;
                        }
                        if (this.ruleNochangeIn[i].name == 'customSqlValidation') {
                            this.ruleNochangeInputVal[i] = this.addForm.sqlExpression;
                        }
                        addForm.inputParams.inputGroup[i] = {
                            "name": this.ruleNochangeIn[i].name,
                            "value": this.ruleNochangeInputVal[i]
                        }
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        saveEditRule(this.addForm.modelId, this.addForm.id, addForm).then(data => {
                                this.$router.push({path: '/qualityAnalysis/analysisTemplate/rules?id=' + this.row.id});
                                this.$message({
                                    message: '恭喜你，编辑数据已成功！',
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
                            console.log(error.respons);
                            this.$message({
                                message: error.response.data.err,
                                type: 'error'
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }//保存表格结束处
        },
        mounted() {
            this.getRuleCon();
            this.getFieldsList();
        }
    }
</script>

<style scoped>

    .box-wrapper {
        margin-left: 20px;
    }

    .demo-ruleForm {
        width: 50%;
        /* height: calc(100vh - 200px);
         overflow: auto;
         margin-bottom: 20px;*/
    }

    .priorityMes {
        position: absolute;
        top: -27px;
        left: 45px;
    }

    .field-left {
        width: 50%;
        padding-right: 5px;
    }

    .field-right {
        width: 50%;
        padding-left: 5px;
    }

    .bb {
        width: 100%;
        display: flex;
    }

    .title {
        background: #dae6ec;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        color: #31708f;
    }

    li.active {
        color: #3e98fe;
        font-weight: bold;
        background: url("../../../../assets/pitch_on.png") no-repeat;
        background-position: right center;
    }

    .ns_fields2 {
        float: right;
        margin-top: 13px;
        margin-right: 10px;
        cursor: pointer;
    }

    .ns_fields1 {
        float: right;
        margin-top: 13px;
        margin-right: 20px;
        cursor: pointer;
    }

    .deleteAll {
        float: right;
        cursor: pointer;
    }

    /* .checked{
         margin-right:30%;
     }*/
    li {
        height: 40px;
        line-height: 40px;
        cursor: pointer;
    }

    .delItem {
        float: right;
        margin-top: 13px;
        color: red;
        font-weight: bold;
    }

    .dialog-footer-rule {
        width: 100%;
        margin-top: 40px;
        text-align: right;
        padding-right: 20px;
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #eeeeee;
        box-shadow: 0px 1px 5px 0 rgba(0, 0, 0, 0.1);
    }

</style>
