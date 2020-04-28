<template>
    <section class="clearBox" id="bm-qa-rules-edit">
        <div>
            <el-button @click="editable = true" v-if="editable == false" icon="fa fa-unlock">&nbsp;锁定</el-button>
            <el-button type="primary" @click="open" v-if="editable == true && showButton" icon="fa fa-lock">&nbsp;解锁
            </el-button>
            <el-form :model="addForm" :label-position="labelPosition" status-icon :rules="add" ref="addForm"
                     label-width="100px" class="edit-ruleForm" :disabled="editable"
                     id="bm-qa-rules-edit-form" v-loading="loading">
                <el-form-item label="主键">
                    <el-input type="text" v-model="addForm.id" auto-complete="off" disabled name="id"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="addForm.name1" auto-complete="off" :disabled="editable"
                              name="name1"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input type="text" v-model="addForm.buildType" :disabled="true" auto-complete="off"
                              name="buildType"></el-input>
                </el-form-item>
                <el-form-item label="聚合类型" v-if="addForm.buildType=='Builtin'">
                    <el-input type="text" v-model="addForm.aggType" :disabled="true" auto-complete="off"
                              name="aggType"></el-input>
                </el-form-item>
                <el-form-item label="输入范围" v-if="addForm.buildType=='Builtin'">
                    <el-input type="text" v-model="addForm.dataScope" :disabled="true" auto-complete="off"
                              name="dataScope"></el-input>
                </el-form-item>
                <el-form-item label="自定义类型" v-if="addForm.buildType=='Custom'">
                    <el-select v-model="addForm.customType" style="width: 100%" placeholder="请选择" :disabled="editable"
                               name="customType">
                        <el-option value="Extend"></el-option>
                        <el-option value="EL"></el-option>
                        <el-option value="SQL"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自定义表达式" v-if="addForm.buildType=='Custom'">
                    <el-input type="text" v-model="addForm.customValue" auto-complete="off" placeholder="自定义数据/表达式"
                              :disabled="editable" name="customValue"></el-input>
                </el-form-item>
                <el-form-item label="基类" v-if="addForm.customType === 'Extend'">
                    <el-input v-model="addForm.ruleClass" auto-complete="off" placeholder="请选择基类"
                              class="input-with-select" :disabled="editable" name="ruleClass">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dialogDataRuleVisible = true"
                                   :disabled="editable"></el-button>
                    </el-input>
                    <el-form-item v-for="f in params" :label="f.displayStr" :key="f.name">
                        <el-input v-if="!f.options" type="text" v-model="paramsValues[f.id]"
                                  auto-complete="off"></el-input>
                        <el-select v-if="f.options" v-model="paramsValues[f.id]" style="width: 100%">
                            <el-option v-for="option in f.options" :value="option" :key="option"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="输入字段类型" v-if="addForm.buildType=='Builtin' || addForm.customType=='Extend'
                	|| addForm.customType=='SQL'">
                    <el-select v-model="addForm.fieldValueType" style="width: 100%" placeholder="请选择"
                               :disabled="editable" name="fieldValueType">
                        <el-option value="Any"></el-option>
                        <el-option value="String"></el-option>
                        <el-option value="Number"></el-option>
                        <el-option value="Date"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表达式输入字段" prop="expreInputField" v-if="showExpreInputField">
                    <el-input type="text" v-model="addForm.expreInputField" placeholder="输入字段名,逗号分隔(必填)" disabled
                              name="expreInputField">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="自定义表达式" prop="customExpression" v-if="showCustomExpression">
                    <el-input type="text" v-model="addForm.customExpression"
                              placeholder="自定义表达式(必填)" disabled name="customExpression"></el-input>
                </el-form-item>
                <el-form-item label="正则表达式" prop="regularExpression" v-if="showRegularExpre">
                    <el-input type="text" v-model="addForm.regularExpression" placeholder="正则表达式(必填)" disabled
                              name="regularExpression"></el-input>
                </el-form-item>
                <el-form-item label="缺省日期格式" prop="dafaultDate" v-if="showDateFormat">
                    <el-select v-model="dafaultDate" style="width:100%;" placeholder="请选择" name="dafaultDate">
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
                        <el-button slot="append" icon="icon iconfont icon-ir-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="数据集" v-if="showDataset" prop="dataset">
                    <el-input placeholder="数据选择" class="input-with-select" v-model="addForm.dataset" name="dataset">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="数据集字段" v-if="showDataField" prop="datasetField">
                    <el-input type="text" placeholder="数据集字段(必填)" v-model="addForm.datasetField"
                              name="datasetField"></el-input>
                </el-form-item>
                <el-form-item label="分组列（逗号分隔）" prop="groupingColumns" v-if="showGroupCol">
                    <el-input type="text" v-model="addForm.groupingColumns" placeholder="输入字段名，逗号分隔(必填)" disabled
                              name="groupingColumns">
                    </el-input>
                </el-form-item>
                <el-form-item label="聚合列（逗号分隔）" prop="aggregateColumn" v-if="showAggreCol">
                    <el-input type="text" v-model="addForm.aggregateColumn" placeholder="输入字段名，逗号分隔(必填)" disabled
                              name="aggregateColumn">
                    </el-input>
                </el-form-item>
                <div v-if="showStatistics">
                    <el-form-item label="范围起始值(包括此值)" prop="rangeStartVal">
                        <el-input type="text" placeholder="范围起始值(包括此值)" v-model="addForm.rangeStartVal" disabled
                                  name="rangeStartVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围结束值(不包括此值)" prop="rangeEndVal">
                        <el-input type="text" placeholder="范围结束值(不包括此值)" v-model="addForm.rangeEndVal" disabled
                                  name="rangeEndVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围基准值" prop="rangeBaseVal">
                        <el-input type="text" placeholder="范围基准值" value="0" v-model="addForm.rangeBaseVal" disabled
                                  name="rangeBaseVal"></el-input>
                    </el-form-item>
                    <el-form-item label="范围段大小" prop="rangeSize">
                        <el-input type="text" placeholder="范围段大小(必填)" v-model="addForm.rangeSize" disabled
                                  name="rangeSize"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="自定义 SQL 表达式" prop="sqlExpression" v-if="showCustomSql">
                    <el-input type="text" placeholder="自定义 SQL 表达式(必填)" v-model="addForm.sqlExpression"
                              name="sqlExpression"></el-input>
                </el-form-item>
                <el-form-item label="输出字段" v-if="showOutputFields" prop="outputField">
                    <el-input type="text" placeholder="输入字段名,逗号分隔(必填)" v-model="addForm.outputField" disabled
                              name="outputField">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" disabled></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="打分方式" prop="scoreWay" v-if="showQualityType">
                    <el-select v-model="scoreWay" style="width:100%;" placeholder="请选择" @change="currentSel"
                               name="scoreWay">
                        <el-option
                                v-for="item in scoreOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="坏数据行数限制" prop="badDataLimit" v-if="showOutputLimit">
                    <el-input type="text" v-model="addForm.badDataLimit" placeholder="坏数据行数限制" disabled
                              name="badDataLimit"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="text" v-model="addForm.description" auto-complete="off"
                              name="description"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="save('addForm')" :disabled="editable" name="rule-sure">确定</el-button>
            <el-button @click="returnForm()" name="rule-cancel">取消</el-button>
        </div>

        <!-- rule dialog-->
        <el-dialog
                :visible.sync="dialogDataRuleVisible"
                :modal-append-to-body="false"
                title="规则查询"
        >
            <el-form id="bm-qa-rules-edit-ruleSearch">
                <rules-inquire @thisSelectRulesVal="getSelectRuleVal"></rules-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer" id="bm-qa-rules-edit-ruleSearchFooter">
                <el-button type="primary" @click="submitRuleData()" name="footer-sure">确定</el-button>
                <el-button @click="dialogDataRuleVisible=false" name="footer-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {updateRule, ruleForm, ruleFormBuilt} from '@api';
    import rulesInquire from '@components/rulesInq/rulesInquire'

    export default {
        name: "edit",
        components: {
            rulesInquire
        },
        data() {
            return {
                loading: false,
                showButton: false,
                showExpreInputField: false,
                showCustomExpression: false,
                showRegularExpre: false,
                showDateFormat: false,
                showCount: false,
                showDataset: false,
                showDataField: false,
                showGroupCol: false,
                showAggreCol: false,
                showStatistics: false,
                showCustomSql: false,
                showOutputFields: false,
                showQualityType: false,
                showOutputLimit: false,
                scoreOptions: [],
                dateOptions: [],
                editable: true,
                labelPosition: 'top',
                dialogDataRuleVisible: false,
                getSelValDataRule: {},
                params: new Array(),
                paramsValues: {},
                ruleOption: {},
                getRuleInput: [],
                getRuleOutput: [],
                expreInputField: '',
                outputField: '',
                scoreWay: '',
                dafaultDate: '',
                regularExpre: '',
                rangeEndVal: '',
                rangeSize: '',
                description: '',
                res: {},
                addForm: {
                    id: '',
                    //为了防止分析结果页面，点击内建规则之后，再点取消，原来的模板规则名称会变，将属性名name改为name1
                    name1: '',
                    buildType: '',
                    customType: '',
                    customValue: '',
                    description: '',
                    fieldValueType: '',
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
                    badDataLimit: '',
                    ruleClass: '',
                    ruleOption: {paramsMap: {inputGroup: [], outputGroup: []}, outValueType: '', outputFields: []}
                },
                add: {
                    name: [
                        {required: true, trigger: 'blur', message: '请输入名称'}
                    ]
                }
            };
        },
        methods: {
            currentSel(val) {
                this.addForm.scoreWay = val;
            },
            getRuleForm() {
                var ruleId = this.addForm.id || this.addForm.detailId;
                if (this.addForm.id) {
                    this.loading = true;
                    ruleForm(ruleId).then(res => {
                        this.loading = false;
                        this.res = res;
                        this.addForm.id = res.id;
                        this.addForm.name1 = res.name;
                        this.addForm.buildType = res.buildType;
                        this.addForm.aggType = res.aggType;
                        this.addForm.dataScope = res.dataScope;
                        this.addForm.fieldValueType = res.fieldValueType;
                        this.addForm.customType = res.customType;
                        //inputGroup部分
                        if (res.ruleOption.paramsMap.inputGroup) {
                            var inputGroup = res.ruleOption.paramsMap.inputGroup;
                            for (var i = 0; i < inputGroup.length; i++) {
                                if (inputGroup[i].name == 'inputELColumns') {
                                    this.addForm.expreInputField = inputGroup[i].defaultValue;
                                    this.showExpreInputField = true;
                                }
                                if (inputGroup[i].name == 'customExpression') {
                                    this.addForm.customExpression = inputGroup[i].name;
                                    this.showCustomExpression = true;
                                }
                                if (inputGroup[i].name == 'ruleRegexDefaultPattern') {
                                    if (inputGroup[i].defaultValue != '') {
                                        this.addForm.regularExpression = inputGroup[i].defaultValue;
                                    } else {
                                        this.addForm.regularExpression = inputGroup[i].name;
                                    }
                                    this.showRegularExpre = true;
                                }
                                if (inputGroup[i].name == 'ruleDefaultDateFormat') {
                                    this.dafaultDate = inputGroup[i].defaultValue;
                                    this.dateOptions = inputGroup[i].valueOptions;
                                    this.showDateFormat = true;
                                }
                                if (inputGroup[i].name == 'countDistinctFields') {
                                    this.addForm.count = inputGroup[i].defaultValue;
                                    this.showCount = true;
                                }
                                if (inputGroup[i].name == 'lookupDataset') {
                                    this.addForm.dataset = inputGroup[i].name;
                                    this.showDataset = true;
                                }
                                if (inputGroup[i].name == 'lookupDatasetFieldName') {
                                    this.addForm.datasetField = inputGroup[i].name;
                                    this.showDataField = true;
                                }
                                if (inputGroup[i].name == 'groupByColumns') {
                                    this.addForm.groupingColumns = inputGroup[i].name;
                                    this.showGroupCol = true;
                                }
                                if (inputGroup[i].name == 'aggregationColumns') {
                                    this.addForm.aggregateColumn = inputGroup[i].defaultValue;
                                    this.showAggreCol = true;
                                }
                                /*字段值分布统计*/
                                if (inputGroup[i].name == 'valueStartFrom') {
                                    this.addForm.rangeStartVal = inputGroup[i].name;
                                    this.showStatistics = true;
                                }
                                if (inputGroup[i].name == 'valueEndTo') {
                                    this.addForm.rangeEndVal = inputGroup[i].name;
                                }
                                if (inputGroup[i].name == 'valueBase') {
                                    this.addForm.rangeBaseVal = inputGroup[i].defaultValue;
                                }
                                if (inputGroup[i].name == 'valueStep') {
                                    this.addForm.rangeSize = inputGroup[i].name;
                                }
                                if (inputGroup[i].name == 'customSqlValidation') {
                                    this.addForm.sqlExpression = inputGroup[i].name;
                                    this.showCustomSql = true;
                                }
                            }
                        }
                        if (res.ruleOption.paramsMap.outputGroup) {
                            var outputGroup = res.ruleOption.paramsMap.outputGroup;
                            for (var i = 0; i < outputGroup.length; i++) {
                                if (outputGroup[i].name == 'outputFields') {
                                    this.addForm.outputField = outputGroup[i].defaultValue;
                                    this.showOutputFields = true;
                                }
                                if (outputGroup[i].name == 'qualityType') {
                                    this.scoreWay = outputGroup[i].defaultValue;
                                    this.scoreOptions = outputGroup[i].valueOptions;
                                    this.showQualityType = true;
                                }
                                if (outputGroup[i].name == 'outputLimit') {
                                    this.addForm.badDataLimit = outputGroup[i].defaultValue;
                                    this.showOutputLimit = true;
                                }
                            }//循环结束处
                        }
                    })
                } else if (this.addForm.detailId) {
                    this.loading = true;
                    ruleFormBuilt(ruleId).then(res => {
                        this.loading = false;
                        this.res = res;
                        this.addForm.id = res.id;
                        this.addForm.name1 = res.name;
                        this.addForm.buildType = res.buildType;
                        this.addForm.aggType = res.aggType;
                        this.addForm.dataScope = res.dataScope;
                        this.addForm.fieldValueType = res.fieldValueType;
                        this.addForm.customType = res.customType;
                        //inputGroup部分
                        if (res.ruleOption.paramsMap.inputGroup) {
                            var inputGroup = res.ruleOption.paramsMap.inputGroup;
                            for (var i = 0; i < inputGroup.length; i++) {
                                if (inputGroup[i].name == 'inputELColumns') {
                                    this.addForm.expreInputField = inputGroup[i].defaultValue;
                                    this.showExpreInputField = true;
                                }
                                if (inputGroup[i].name == 'customExpression') {
                                    this.addForm.customExpression = inputGroup[i].name;
                                    this.showCustomExpression = true;
                                }
                                if (inputGroup[i].name == 'ruleRegexDefaultPattern') {
                                    if (inputGroup[i].defaultValue != '') {
                                        this.addForm.regularExpression = inputGroup[i].defaultValue;
                                    } else {
                                        this.addForm.regularExpression = inputGroup[i].name;
                                    }
                                    this.showRegularExpre = true;
                                }
                                if (inputGroup[i].name == 'ruleDefaultDateFormat') {
                                    this.dafaultDate = inputGroup[i].defaultValue;
                                    this.dateOptions = inputGroup[i].valueOptions;
                                    this.showDateFormat = true;
                                }
                                if (inputGroup[i].name == 'countDistinctFields') {
                                    this.addForm.count = inputGroup[i].defaultValue;
                                    this.showCount = true;
                                }
                                if (inputGroup[i].name == 'lookupDataset') {
                                    this.addForm.dataset = inputGroup[i].name;
                                    this.showDataset = true;
                                }
                                if (inputGroup[i].name == 'lookupDatasetFieldName') {
                                    this.addForm.datasetField = inputGroup[i].name;
                                    this.showDataField = true;
                                }
                                if (inputGroup[i].name == 'groupByColumns') {
                                    this.addForm.groupingColumns = inputGroup[i].name;
                                    this.showGroupCol = true;
                                }
                                if (inputGroup[i].name == 'aggregationColumns') {
                                    this.addForm.aggregateColumn = inputGroup[i].defaultValue;
                                    this.showAggreCol = true;
                                }
                                /*字段值分布统计*/
                                if (inputGroup[i].name == 'valueStartFrom') {
                                    this.addForm.rangeStartVal = inputGroup[i].name;
                                    this.showStatistics = true;
                                }
                                if (inputGroup[i].name == 'valueEndTo') {
                                    this.addForm.rangeEndVal = inputGroup[i].name;
                                }
                                if (inputGroup[i].name == 'valueBase') {
                                    this.addForm.rangeBaseVal = inputGroup[i].defaultValue;
                                }
                                if (inputGroup[i].name == 'valueStep') {
                                    this.addForm.rangeSize = inputGroup[i].name;
                                }
                                if (inputGroup[i].name == 'customSqlValidation') {
                                    this.addForm.sqlExpression = inputGroup[i].name;
                                    this.showCustomSql = true;
                                }
                            }
                        }
                        if (res.ruleOption.paramsMap.outputGroup) {
                            var outputGroup = res.ruleOption.paramsMap.outputGroup;
                            for (var i = 0; i < outputGroup.length; i++) {
                                if (outputGroup[i].name == 'outputFields') {
                                    this.addForm.outputField = outputGroup[i].defaultValue;
                                    this.showOutputFields = true;
                                }
                                if (outputGroup[i].name == 'qualityType') {
                                    this.scoreWay = outputGroup[i].defaultValue;
                                    this.scoreOptions = outputGroup[i].valueOptions;
                                    this.showQualityType = true;
                                }
                                if (outputGroup[i].name == 'outputLimit') {
                                    this.addForm.badDataLimit = outputGroup[i].defaultValue;
                                    this.showOutputLimit = true;
                                }
                            }//循环结束处
                        }
                    })
                }
            },
            save: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var that = this;
                        that.addForm.ruleOption = that.getSelValDataRule.ruleOption;
                        that.applyRuleData(that.addForm, that.paramsValues)
                        //将取到的值，编辑后再存回去
                        //可编辑部分：
                        that.res.name = that.addForm.name1;  //名称
                        that.res.customType = that.addForm.customType;  //自定义类型
                        that.res.customValue = that.addForm.customValue;  //自定义数据/表达式
                        that.res.fieldValueType = that.addForm.fieldValueType;  //输入字段类型
                        that.res.description = that.addForm.description;   //描述
                        that.res.ruleClass = that.addForm.ruleClass;
                        if (that.res.ruleOption.paramsMap.outputGroup) {
                            var resOutput = that.res.ruleOption.paramsMap.outputGroup;
                            for (var i = 0; i < resOutput.length; i++) {
                                if (resOutput[i].name == 'qualityType') {
                                    resOutput[i].defaultValue = this.scoreWay;
                                }
                            }
                        }     //打分方式
                        if (that.res.ruleOption.paramsMap.inputGroup) {
                            var resInput = that.res.ruleOption.paramsMap.inputGroup;
                            for (var i = 0; i < resInput.length; i++) {
                                if (resInput[i].name == 'ruleDefaultDateFormat') {
                                    resInput[i].defaultValue = this.dafaultDate;
                                }
                            }
                        }   //日期选择
                        updateRule(that.addForm.id, that.res).then(data => {
                            that.$router.push({path: '/qualityAnalysis/analysisRules'});
                        }, err => {
                            var _this = this;
                            if (err.response.status == 500) {
                                _this.$message({
                                    message: err.response.data.err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //解锁
            open: function () {
                //Builtin类型的不可编辑
                if (this.addForm.buildType == 'Builtin') {
                    this.editable = true;
                } else {
                    this.editable = false;
                }
            },
            returnForm() {
                history.go(-1);
            },
            //获取子组件的DateSchema  entity
            getSelectRuleVal(id, name, ruleClass, ruleOutput, ruleInput, dataScope, fieldValueType,
                             aggType, ruleOption) {
                this.ruleClass = ruleClass;
                this.aggType = aggType;
                //获取规则查询子组件传过来的值放入表单中
                this.addForm.dataScope = dataScope;
                this.ruleOption = ruleOption;
                this.getRuleOutput = ruleOutput;
                this.getRuleInput = ruleInput;
            },

            getAllPropsKey: function (obj) {
                // 用来保存所有的属性名称和值
                var props = new Array;
                // 开始遍历
                for (var p in obj) {
                    // 方法
                    if (typeof (obj[p]) == "function") {
                        obj[p]();
                    } else {
                        // p 为属性名称
                        props.push(p);
                    }
                }
                // 最后显示所有的属性
                return props;
            },

            //转换rule的属性
            transformProps: function (properties) {
                var propKeys = this.getAllPropsKey(properties)
                for (var i = 0; i < propKeys.length; i++) {
                    var paramDescList = properties[propKeys[i]];
                    if (paramDescList && paramDescList.length > 0) {
                        for (var j = 0; j < paramDescList.length; j++) {
                            var id = "pd_" + i + "_" + j;
                            this.paramsValues[id] = paramDescList[j].defaultValue;
                            this.params.push({
                                keyName: propKeys[i],
                                id: "pd_" + i + "_" + j,
                                idx: j,
                                name: paramDescList[j].name,
                                displayStr: paramDescList[j].displayStr,
                                vtype: paramDescList[j].vtype,
                                inputType: "text",
                                defaultValue: paramDescList[j].defaultValue,
                                options: paramDescList[j].valueOptions
                            })
                        }
                    }
                }
            },

            //应用转换后的数据到rule
            applyRuleData(ruleEntity, inputParams) {
                // ruleEntity -> Rule
                // inputParams -> $scope.inputParams ( variable storing value input from UI)
                if (Object.keys(inputParams).length !== 0) {
                    // get param keys
                    var propKeys = this.getAllPropsKey(this.getSelValDataRule.ruleOption.paramsMap);
                    // list param descs
                    for (var i = propKeys.length - 1; i >= 0; i--) {
                        var paramDescList = this.getSelValDataRule.ruleOption.paramsMap[propKeys[i]];
                        if (paramDescList && paramDescList.length > 0) {
                            for (var j = paramDescList.length - 1; j >= 0 && this.params.length > 0; j--) {
                                var id = "pd_" + i + "_" + j;
                                paramDescList[j].defaultValue = inputParams[id];
                            }
                        }
                    }
                }
            },
            //rule查询数据提交
            submitRuleData: function () {
                this.showExpreInputField = false;
                this.showCustomExpression = false;
                this.showRegularExpre = false;
                this.showDateFormat = false;
                this.showCount = false;
                this.showDataset = false;
                this.showDataField = false;
                this.showGroupCol = false;
                this.showAggreCol = false;
                this.showStatistics = false;
                this.showCustomSql = false;
                this.showOutputFields = false;
                this.showQualityType = false;
                this.showOutputLimit = false;
                this.dialogDataRuleVisible = false;
                this.addForm.ruleClass = this.ruleClass;
                this.addForm.aggType = this.aggType;
                this.addForm.description = this.description;
                this.addForm.ruleOption = this.ruleOption;
                if (this.getRuleInput) {
                    for (var i = 0; i < this.getRuleInput.length; i++) {
                        if (this.getRuleInput[i].name == 'inputELColumns') {
                            this.showExpreInputField = true;
                            this.addForm.expreInputField = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'customExpression') {
                            this.showCustomExpression = true;
                            this.addForm.customExpression = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'ruleRegexDefaultPattern') {
                            if (this.getRuleInput[i].defaultValue != '') {
                                this.addForm.regularExpression = this.getRuleInput[i].defaultValue;
                            } else {
                                this.addForm.regularExpression = this.getRuleInput[i].name;
                            }
                            this.showRegularExpre = true;
                        }
                        if (this.getRuleInput[i].name == 'ruleDefaultDateFormat') {
                            this.showDateFormat = true;
                            this.dateOptions = this.getRuleInput[i].valueOptions;
                            this.dafaultDate = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'countDistinctFields') {
                            this.showCount = true;
                            this.addForm.count = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'lookupDataset') {
                            this.showDataset = true;
                            this.addForm.dataset = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'lookupDatasetFieldName') {
                            this.showDataField = true;
                            this.addForm.datasetField = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'groupByColumns') {
                            this.showGroupCol = true;
                            this.addForm.groupingColumns = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'aggregationColumns') {
                            this.showAggreCol = true;
                            this.addForm.aggregateColumn = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'valueStartFrom') {
                            this.showStatistics = true;
                            this.addForm.rangeStartVal = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'valueEndTo') {
                            this.addForm.rangeEndVal = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'valueBase') {
                            this.addForm.rangeBaseVal = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'valueStep') {
                            this.addForm.rangeSize = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'customSqlValidation') {
                            this.showCustomSql = true;
                            this.addForm.sqlExpression = this.getRuleInput[i].name;
                        }
                    }
                    this.res.ruleOption.paramsMap.inputGroup = this.getRuleInput;
                }
                if (this.getRuleOutput) {
                    for (var i = 0; i < this.getRuleOutput.length; i++) {
                        if (this.getRuleOutput[i].name == 'outputFields') {
                            this.showOutputFields = true;
                            this.addForm.outputField = this.getRuleOutput[i].defaultValue;
                        }
                        if (this.getRuleOutput[i].name == 'qualityType') {
                            this.showQualityType = true;
                            this.scoreOptions = this.getRuleOutput[i].valueOptions;
                            this.scoreWay = this.getRuleOutput[i].defaultValue;
                        }
                        if (this.getRuleOutput[i].name == 'outputLimit') {
                            this.showOutputLimit = true;
                            this.addForm.badDataLimit = this.getRuleOutput[i].defaultValue;
                        }
                    }
                    this.res.ruleOption.paramsMap.outputGroup = this.getRuleOutput;
                }
            }
        },
        mounted() {
            if (this.$route.params.addForm) {
                this.addForm = this.$route.params.addForm;
                console.log(this.addForm);
                //当是Builtin的时候不显示解锁button
                //当从执行结果进入规则编辑页时，是有detailId属性的，从分析规则进入则没有该属性
                if (this.$route.params.addForm.buildType == 'Custom' && this.$route.params.addForm.detailId == undefined) {
                    this.showButton = true;
                }
                this.getRuleForm();
            }
        }
    }
</script>

<style scoped>

    .edit-ruleForm {
        width: 50%;
    }

    .clearBox {
        padding: 20px 0 0 20px;
    }
</style>
