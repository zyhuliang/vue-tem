<template>
    <section class="clearBox" id="bm-qa-template-rules-new">
        <div>
            <el-form :model="addForm" :label-position="labelPosition" status-icon :rules="rule" ref="addForm"
                     label-width="100px"
                     class="demo-ruleForm" id="bm-qa-template-rules-new-form">
                <div class="scroll-content">
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="addForm.name" auto-complete="off" name="name"></el-input>
                    </el-form-item>
                    <el-form-item label="模板主键" prop="id">
                        <el-input :disabled="true" type="text" v-model="this.id" auto-complete="off"
                                  name="id"></el-input>
                    </el-form-item>
                    <el-form-item label="规则主键" prop="rulesId">
                        <el-input placeholder="规则选择（必选）" :disabled="disrulesId" v-model="addForm.rulesId"
                                  class="input-with-select" name="rulesId">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                       @click="rulesInquire(addForm.rulesId)"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="规则名称" prop="rulesName">
                        <el-input type="text" :disabled="disrulesName" v-model="addForm.rulesName" auto-complete="off"
                                  name="rulesName"></el-input>
                    </el-form-item>
                    <el-form-item label="权重" prop="priority">
                        <el-tooltip class="priorityMes" placement="top" effect="light">
                            <div slot="content">合法值0 - 10。 值越大，质量评级权重越高</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-input type="text" v-model="addForm.priority" name="priority"></el-input>
                    </el-form-item>
                    <el-form-item label="输入范围" prop="inputRange">
                        <el-input type="text" :disabled="disinputRange" v-model="addForm.inputRange"
                                  name="inputRange"></el-input>
                    </el-form-item>
                    <el-form-item label="输入字段值类型" prop="inputRange" v-if="showDataset || showStatistics">
                        <el-input type="text" :disabled="disinputRange" v-model="addForm.fieldType"
                                  name="fieldType"></el-input>
                    </el-form-item>
                    <el-form-item label="字段名" prop="fieldName">
                        <el-input placeholder="字段名（必填）" :disabled="disField" v-model="addForm.fieldName"
                                  class="input-with-select" name="fieldName">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('fieldName')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="自定义 SQL 表达式" prop="sqlExpression" v-if="showSql">
                        <el-input type="text" placeholder="自定义 SQL 表达式(必填)" v-model="addForm.sqlExpression"
                                  name="sqlExpression"></el-input>
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
                    <el-form-item label="分组列（逗号分隔）" prop="groupingColumns" v-if="showGroupCol">
                        <el-input type="text" v-model="addForm.groupingColumns" placeholder="输入字段名，逗号分隔(必填)"
                                  name="groupingColumns">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('groupingColumns')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="聚合列（逗号分隔）" prop="aggregateColumn" v-if="showPolyCol">
                        <el-input type="text" v-model="addForm.aggregateColumn" placeholder="输入字段名，逗号分隔(必填)"
                                  name="aggregateColumn">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('aggregateColumn')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="数据集" v-if="showDataset" prop="dataset">
                        <el-input placeholder="数据选择" :disabled="disField" class="input-with-select"
                                  v-model="addForm.dataset" name="dataset">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="dataInquire"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="数据集字段" v-if="showDataField" prop="datasetField">
                        <el-input type="text" placeholder="数据集字段(必填)" v-model="addForm.datasetField"
                                  name="datasetField"></el-input>
                    </el-form-item>
                    <el-form-item label="计数不同值／唯一值等" prop="count" v-if="showCount">
                        <el-input placeholder="输入字段名，逗号分隔(必填)" :disabled="disField" v-model="addForm.count"
                                  class="input-with-select" name="count">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('count')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="正则表达式" prop="regularExpression" v-if="showRegExpression">
                        <el-input type="text" v-model="addForm.regularExpression" placeholder="正则表达式(必填)"
                                  name="regularExpression"></el-input>
                    </el-form-item>
                    <el-form-item label="缺省日期格式" prop="dafaultDate" v-if="showDateFormat">
                        <el-select v-model="addForm.dafaultDate" style="width:100%;" placeholder="请选择"
                                   name="dafaultDate">
                            <el-option
                                    v-for="item in dateOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="表达式输入字段" prop="expreInputField" v-if="showInputELColumns">
                        <el-input type="text" v-model="addForm.expreInputField" placeholder="输入字段名,逗号分隔(必填)"
                                  name="expreInputField">
                            <el-button :disabled="disField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('expreInputField')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="自定义表达式" prop="customExpression" v-if="showCustomExpression">
                        <el-input type="text" v-model="addForm.customExpression"
                                  placeholder="自定义表达式(必填)" name="customExpression"></el-input>
                    </el-form-item>
                    <el-form-item label="输出字段" v-if="showOutpuistFields" prop="outputField">
                        <el-input type="text" placeholder="输入字段名,逗号分隔(必填)" v-model="addForm.outputField"
                                  name="outputField" :disabled="outDisField">
                            <el-button :disabled="outDisField" slot="append" icon="icon iconfont icon-ir-search"
                                       @click="fieldInquire('outputField')"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="打分方式" prop="scoreWay" v-if="showScoreMethod">
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
                </div>
                <el-form-item>
                    <el-button type="primary" @click="saveForm('addForm')" name="new-sure">确定</el-button>
                    <el-button @click="returnForm()" name="new-cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 规则ID 查询 -->
        <el-dialog title="规则查询" :visible.sync="dialogRulesVisible" :modal-append-to-body="false" class="dialogBox">
            <el-form id="bm-qa-template-rules-new-ruleSearchForm">
                <rules-inquire @thisSelectRulesVal="getSelectRulesVal"></rules-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer-rule" id="bm-qa-template-rules-new-ruleSearchFooter">
                <el-button type="primary" @click="submitRules" name="rule-footer-sure">确定</el-button>
                <el-button @click="dialogRulesVisible = false" name="rule-footer-cancel">取消</el-button>
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
                        <span class="deleteAll" @click="hasChose = []"><i class="el-icon-close"></i>删除全部</span>
                    </div>
                    <ul ref="hasSelect">
                        <li v-for="(item,index) in hasChose"
                            ref="ites"
                            @click="deleteItem(index)">{{item}} <i class="el-icon-close delItem"></i></li>
                    </ul>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" id="bm-qa-template-rules-new-fieldSearchFooter">
                <el-button type="primary" @click="submitField" name="field-sure">确定</el-button>
                <el-button @click="showFieldDialog = false" name="field-cancel">取消</el-button>
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
    import rulesInquire from '@components/rulesInq/rulesInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {saveNewRule, fieldsList} from '@api'

    export default {
        components: {
            rulesInquire,
            dataSourceInquire
        },
        data() {
            return {
                outDisField: false,
                inputVal: [],
                outputVal: [],
                dialogDataSetVisible: false,
                //URL参数ID
                fieldsList: [],
                hasChose: ['*'],
                id:this.$route.query.id,
               // processDataId:this.$route.params.row.processDataId,
                labelPosition: 'top',
                disrulesId: true,
                disrulesName: true,
                disinputRange: true,
                disField: true,
                dialogRulesVisible: false,
                showFieldDialog: false,
                getSelValRulesId: '',
                getSelValRulesName: '',
                getSelscope: '',
                getFieldValueType: '',
                getCustomValue: "",
                getRuleOutput: [],
                getRuleInput: [],
                dateOptions: [],
                scoreOptions: [],
                showOutpuistFields: false,
                showScoreMethod: false,
                showOutputLimit: false,
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
                fieldInquireType:'',//弹框选择 字段名标识,输出字段标识,表达式输入字段标识,计数不同值,分组列,聚合列 类型中的一种
                addForm: {
                    name: '',
                    rulesId: '',
                    rulesName: '',
                    priority: 1,
                    inputRange: '',
                    fieldName: '',
                    expreInputField: '',
                    regularExpression: '',
                    inputField: '',
                    outputField: '',
                    scoreWay: '',
                    badDataLimit: '',
                    regularExpression: '',
                    customExpression: '',
                    groupingColumns: '',
                    aggregateColumn: '',
                    sqlExpression: '',
                    dafaultDate: 'yyyy-MM-dd-HH-mm-ss',
                    dataScope: '',
                    count: '',
                    fieldType: '',
                    flowID: '',
                    dataset: '',
                    datasetField: '',
                    rangeStartVal: '',
                    rangeEndVal: '',
                    rangeBaseVal: '0',
                    rangeSize: ''
                },
                rule: {
                    name: [
                        {required: true, trigger: 'blur', message: '请输入名称'}
                    ],
                    dataset: [
                        {required: true, trigger: 'change', message: '请选择数据集'}
                    ],
                    customExpression: [
                        {required: true, trigger: 'blur', message: '请输入自定义表达式'}
                    ],
                    priority: [
                        {required: true, trigger: 'blur', message: '请输入权重'}
                    ],
                    rulesId: [
                        {required: true, trigger: 'change', message: '请选择规则'}
                    ],
                    fieldName: [
                        {required: true, trigger: 'change', message: '请选择字段'}
                    ],
                    expreInputField: [
                        {required: true, trigger: 'change', message: '请选择字段'}
                    ],
                    outputField: [
                        {required: true, trigger: 'change', message: '请选择字段'}
                    ],
                    regularExpression: [
                        {required: true, trigger: 'change', message: '请输入表达式'}
                    ],
                    count: [
                        {required: true, trigger: 'change', message: '请选择字段'}
                    ],
                    datasetField: [
                        {required: true, trigger: 'change', message: '请输入字段'}
                    ],
                    groupingColumns: [
                        {required: true, trigger: 'change', message: '请输入字段'}
                    ],
                    aggregateColumn: [
                        {required: true, trigger: 'change', message: '请输入字段'}
                    ],
                    rangeSize: [
                        {required: true, trigger: 'change', message: '请输入范围段'}
                    ],
                    sqlExpression: [
                        {required: true, trigger: 'change', message: '请输入表达式'}
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
            //获取子组件的Rules
            getSelectRulesVal(id, name, ruleClass, ruleOutput, ruleInput, dataScope, fieldValueType, aggType, ruleOption, customValue) {
                this.getSelValRulesId = id;
                this.getSelValRulesName = name;
                //获取从子组件传来的输入范围
                this.getSelscope = dataScope;
                this.getFieldValueType = fieldValueType;
                this.getRuleOutput = ruleOutput;
                this.getRuleInput = ruleInput;
                this.getCustomValue = customValue;
            },
            saveForm(formName) {
                var addForm = {
                    'name': this.addForm.name,
            		"modelId":this.id,
                    'dataId': this.addForm.fieldName,
                    'ruleId': this.addForm.rulesId,
                    'ruleName': this.addForm.rulesName,
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
                //保存时上传表单的形式 inputGroup
                if (this.getRuleInput) {
                    let inputValObj = {
                        'inputELColumns': this.addForm.expreInputField,
                        'customExpression': this.addForm.customExpression,
                        'ruleRegexDefaultPattern': this.addForm.regularExpression,
                        'ruleDefaultDateFormat': this.addForm.dafaultDate,
                        'countDistinctFields': this.addForm.count,
                        'lookupDataset': this.addForm.dataset,
                        'lookupDatasetFieldName': this.addForm.datasetField,
                        'groupByColumns': this.addForm.groupingColumns,
                        'aggregationColumns': this.addForm.aggregateColumn,
                        'valueStartFrom': this.addForm.rangeStartVal,
                        'valueEndTo': this.addForm.rangeEndVal,
                        'valueBase': this.addForm.rangeBaseVal,
                        'valueStep': this.addForm.rangeSize,
                        'customSqlValidation': this.addForm.sqlExpression
                    }
                    this.getRuleInput.forEach((item,index) => {
                        addForm.inputParams.inputGroup[index] = {
                            "name": item.name,
                            "value": inputValObj[item.name]
                        }
                    })
                }
                this.$refs[formName].validate((valid) => {
                    let _this = this
                    if (valid) {
                        saveNewRule(_this.id,addForm).then(data => {
                            this.$router.push({ path: '/qualityAnalysis/analysisTemplate/rules', query:{id:_this.id, processDataId:_this.$route.query.processDataId}});
                            this.$message({
                                message: '恭喜你，新增数据已成功！',
                                type: 'success'
                            });
                        }, err => {
                            if (err.response.data.err == 'Arguments error') {
                                this.$message({
                                    message: '保存失败，此名称已存在',
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
            // 规则查询
            rulesInquire: function (val) {
                this.dialogRulesVisible = true;
                this.addForm.fieldName = "*";
            },
            //点击不同按钮打开同一个字段弹窗，确定标识
            fieldInquire(fieldType) {
                //打开选择字段弹窗后，清空选中状态
                if (this.$refs.lis) {
                    this.refresh();
                }
                this.hasChose = ['*'];
                this.fieldInquireType = fieldType
                this.showFieldDialog = true;
                //在弹框时候显示出被选中的字段
                if (this.addForm[fieldType] != '') {
                    this.hasChose = this.addForm[fieldType].split(',');
                }
            },
            //------------------选择字段的弹窗逻辑--------------------------
            handleItem(e) {
                if (e.target.className.indexOf('active') == -1) {
                    e.target.className = 'active';
                } else {
                    e.target.className = '';
                }
            },
            refresh() {
                for (var i = 0; i < this.$refs.lis.length; i++) {
                    this.$refs.lis[i].className = '';
                    this.fieldsList[i].show = false;
                }
            },
            //点击确定时，根据不同按钮提交不同的值
            submitField() {
                let arr = this.hasChose.join(',');
                this.addForm[this.fieldInquireType] = arr
                this.showFieldDialog = false;
            },
            newAdd() {
                for (var i = 0; i < this.$refs.lis.length; i++) {
                    if (this.$refs.lis[i].className == 'active') {
                        this.hasChose.push(this.$refs.lis[i].innerText)
                    }
                }
            },
            deleteItem(index) {
                for (var i = 0; i < this.$refs.ites.length; i++) {
                    if (i == index) {
                        this.hasChose.splice(i, 1);
                    }
                }
            },
            //提交规则查询
            submitRules: function () {
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
                this.addForm.rulesId = this.getSelValRulesId;
                this.addForm.rulesName = this.getSelValRulesName;
                this.addForm.inputRange = this.getSelscope;
                this.addForm.fieldType = this.getFieldValueType;
                this.addForm.customExpression = this.getCustomValue;
                //当规则ID不为空时，字段名为可编写状态
                if (this.addForm.rulesId !== '') {
                    this.disField = false;
                }
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
            returnForm(){
                history.go(-1);
            },
            //获取字段列表
            getFieldsList() {
                fieldsList(this.$route.query.processDataId).then(data => {
                    this.fieldsList = data.fields;
                })
            },
            //数据集查询查询
            dataInquire() {
                //弹出"data查询"层
                this.dialogDataSetVisible = true;
            },
            //获取子组件的data
            getSelectDateVal(data) {
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
            },
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
                }
            }
        },
        mounted() {
            this.addForm.name = 'model-rule-' + (new Date().getTime());
            this.addForm.fieldName = this.hasChose.join();
            this.getFieldsList();
        },
        watch: {
            "addForm.rulesId"(newval, oldval) {
                this.outDisField = (newval == "RuleFieldIsUnique" ? true : false)
            },
            "addForm.fieldName"(newval, oldval) {
                if (this.outDisField) {
                    this.addForm.outputField = newval;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .clearBox {
        padding-left: 20px;
    }

    .demo-ruleForm {
        width: 50%;
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
