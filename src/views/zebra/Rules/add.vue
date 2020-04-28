<template>
    <section class="clearBox" id="bm-qa-rules-add">
        <div>
            <el-form :model="addForm" :label-position="labelPosition" status-icon :rules="add" ref="addForm"
                     label-width="100px" class="demo-ruleForm" id="bm-qa-rules-add-form">
                <div class="scroll-content">
                    <el-form-item label="主键">
                        <el-input type="text" v-model="addForm.id" auto-complete="off" name="id"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="addForm.name"
                                  auto-complete="off"
                                  placeholder="名称（必填）"
                                  name="name"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="类型">
                        <el-input type="text" v-model="addForm.buildType" :disabled="true" auto-complete="off"
                                  name="buildType"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义类型">
                        <el-select v-model="addForm.customType" style="width:100%;" placeholder="请选择" name="customType">
                            <el-option
                                    v-for="item in ['Extend','EL','SQL']"
                                    :key="item"
                                    :label="item| cn"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自定义数据/表达式">
                        <el-input type="text" v-model="addForm.customValue" auto-complete="off" placeholder="自定义数据/表达式"
                                  name="customValue"></el-input>
                    </el-form-item>
                    <el-form-item label="基类" v-if="addForm.customType === 'Extend'" prop="ruleClass">
                        <el-input v-model="addForm.ruleClass" auto-complete="off" placeholder="基类(必填)"
                                  class="input-with-select" name="ruleClass">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                       @click="ruleInquire"></el-button>
                        </el-input>
                        <el-form-item v-for="f in params" :label="f.displayStr" :key="f.name">
                            <el-input v-if="!f.options" type="text" v-model="paramsValues[f.id]"
                                      auto-complete="off"></el-input>
                            <el-select v-if="f.options" v-model="paramsValues[f.id]" style="width: 100%">
                                <el-option v-for="option in f.options" :value="option" :key="option"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="输入字段类型">
                        <el-select v-model="addForm.fieldValueType" style="width: 100%" placeholder="请选择"
                                   name="fieldValueType">
                            <el-option value="Any"></el-option>
                            <el-option value="String"></el-option>
                            <el-option value="Number"></el-option>
                            <el-option value="Date"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="表达式输入字段" v-if="showExpreInputField">
                        <el-input v-model="expreInputField" disabled name="expreInputField"></el-input>
                    </el-form-item>

                    <el-form-item label="正则表达式" v-if="showRegularExpre">
                        <el-input v-model="regularExpre" name="regularExpre"></el-input>
                    </el-form-item>

                    <el-form-item label="缺省日期格式" prop="dafaultDate" v-if="showDateFormat">
                        <el-select v-model="dateFormat" style="width:100%;" placeholder="请选择" name="dateFormat">
                            <el-option
                                    v-for="item in dateOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="计数不同值／唯一值等" prop="fieldName" v-if="showCount">
                        <el-input placeholder="输入字段名，逗号分隔(必填)" disabled v-model="countField" class="input-with-select"
                                  name="countField">

                        </el-input>
                    </el-form-item>

                    <el-form-item label="数据集" v-if="showDataset">
                        <el-input placeholder="数据选择" disabled v-model="dataset" class="input-with-select"
                                  name="dataset">

                        </el-input>
                    </el-form-item>

                    <el-form-item label="数据集字段" v-if="showDataField">
                        <el-input type="text" placeholder="数据集字段(必填)" disabled v-model="dataField"
                                  name="dataField"></el-input>
                    </el-form-item>

                    <el-form-item label="分组列（逗号分隔）" v-if="showGroupCol">
                        <el-input type="text" v-model="groupCol" disabled placeholder="输入字段名，逗号分隔(必填)" name="groupCol">

                        </el-input>
                    </el-form-item>

                    <el-form-item label="聚合列（逗号分隔）" v-if="showAggreCol">
                        <el-input type="text" v-model="aggreCol" disabled placeholder="输入字段名，逗号分隔(必填)" name="aggreCol">

                        </el-input>
                    </el-form-item>
                    <el-form-item label="范围起始值(包括此值)" v-if="showRangeStartVal">
                        <el-input type="text" placeholder="范围起始值(包括此值)" disabled v-model="rangeStartVal"
                                  name="rangeStartVal"></el-input>
                    </el-form-item>

                    <el-form-item label="范围结束值(不包括此值)" v-if="showRangeEndVal">
                        <el-input type="text" placeholder="范围结束值(不包括此值)" disabled v-model="rangeEndVal"
                                  name="rangeEndVal"></el-input>
                    </el-form-item>

                    <el-form-item label="范围基准值" v-if="showRangeRefer">
                        <el-input type="text" placeholder="范围基准值" v-model="rangeRefer" disabled
                                  name="rangeRefer"></el-input>
                    </el-form-item>

                    <el-form-item label="范围段大小" v-if="showRangeSize">
                        <el-input type="text" placeholder="范围段大小(必填)" v-model="rangeSize" disabled
                                  name="rangeSize"></el-input>
                    </el-form-item>

                    <el-form-item label="自定义 SQL 表达式" v-if="showCustomSql">
                        <el-input type="text" v-model="customSql" disabled name="customSql"></el-input>
                    </el-form-item>

                    <el-form-item label="输出字段" v-if="showOutputFields">
                        <el-input v-model="outputField" disabled name="outputField"></el-input>
                    </el-form-item>

                    <el-form-item label="打分方式" v-if="showQualityType">
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
                        <el-input type="text" v-model="badDataLimit" placeholder="坏数据行数限制" disabled
                                  name="badDataLimit"></el-input>
                    </el-form-item>

                    <el-form-item label="描述">
                        <el-input type="text" v-model="description" auto-complete="off" name="description"></el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="save('addForm')" name="rule-sure">确定</el-button>
                    <el-button @click="returnForm()" name="rule-cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- rule dialog-->
        <el-dialog
                :visible.sync="dialogDataRuleVisible"
                :modal-append-to-body="false"
                title="规则查询"
        >
            <el-form id="bm-qa-rules-add-ruleSearch">
                <rules-inquire @thisSelectRulesVal="getSelectRuleVal"></rules-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer" id="bm-qa-rules-add-ruleSearchFooter">
                <el-button type="primary" @click="submitRuleData()" name="footer-sure">确定</el-button>
                <el-button @click="dialogDataRuleVisible=false" name="footer-cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>

    import {addRule} from '@api';
    import rulesInquire from '@components/rulesInq/rulesInquire'

    export default {
        components: {
            rulesInquire
        },
        data() {
            return {
                showExpreInputField: false,
                showCustomExpression: false,
                showRegularExpre: false,
                showDateFormat: false,
                showCount: false,
                showDataset: false,
                showDataField: false,
                showGroupCol: false,
                showAggreCol: false,
                showRangeStartVal: false,
                showRangeEndVal: false,
                showRangeRefer: false,
                showRangeSize: false,
                showCustomSql: false,
                showOutputFields: false,
                showQualityType: false,
                showOutputLimit: false,
                labelPosition: 'top',
                dialogDataRuleVisible: false,
                getSelValDataRule: {},
                params: new Array(),
                paramsValues: {},
                aggType: '',
                dataScope: '',
                ruleClass: '',
                ruleOption: {},
                expreInputField: '',
                outputField: '',
                scoreWay: '',
                regularExpre: '',
                dateFormat: 'yyyy-MM-dd-HH-mm-ss',
                countField: '',
                rangeEndVal: '',
                rangeSize: '',
                description: '',
                getRuleInput: [],
                getRuleOutput: [],
                scoreOptions: [],
                addForm: {
                    aggType: 'None',
                    buildType: 'Custom',
                    customType: 'EL',
                    dataScope: 'Field',
                    fieldValueType: 'Any',
                    ruleOption: {paramsMap: {}},
                    id: this.get_uuid(),
                    ruleClass: '',
                    name: ''
                },  //表单对象
                add: {
                    name: [
                        {required: true, trigger: 'blur', message: '请输入名称'}
                    ],
                    ruleClass: [
                        {required: true, trigger: 'change', message: '请选择基类'}
                    ]
                }
            };
        },
        methods: {
            currentSel() {
                //改变打分方式的值
                for (var i = 0; i < this.addForm.ruleOption.paramsMap.outputGroup.length; i++) {
                    if (this.addForm.ruleOption.paramsMap.outputGroup[i].name == 'qualityType') {
                        this.addForm.ruleOption.paramsMap.outputGroup[i].defaultValue = this.scoreWay;
                    }
                }
            },
            save: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addRule(this.addForm).then(data => {
                            this.$router.push({path: '/qualityAnalysis/analysisRules'});
                        }, err => {
                            let error = err.response.data.err == 'Name Duplicated'? '保存失败，此名称已存在' :err.response.data.err
                            this.$message({
                                message: error,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            get_uuid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
                s[8] = s[13] = s[18] = s[23] = "-";
                var uuid = s.join("");
                return uuid;
            },
            returnForm() {
                history.go(-1);
            },
            //弹出"分析规则（基类）查询"层
            ruleInquire: function () {
                this.dialogDataRuleVisible = true;
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
            applyRuleData(ruleEntity, inputParams) {
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
            submitRuleData() {
                this.showExpreInputField = false;
                this.showCustomExpression = false;
                this.showRegularExpre = false;
                this.showDateFormat = false;
                this.showCount = false;
                this.showDataset = false;
                this.showDataField = false;
                this.showGroupCol = false;
                this.showAggreCol = false;
                this.showRangeStartVal = false;
                this.showRangeEndVal = false;
                this.showRangeRefer = false;
                this.showRangeSize = false;
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
                            this.expreInputField = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'customExpression') {
                            this.showCustomExpression = true;
                            this.customExpre = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'ruleRegexDefaultPattern') {
                            this.showRegularExpre = true;
                            this.regularExpre = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'ruleDefaultDateFormat') {
                            this.showDateFormat = true;
                            this.dateOptions = this.getRuleInput[i].valueOptions;
                        }
                        if (this.getRuleInput[i].name == 'countDistinctFields') {
                            this.showCount = true;
                            this.countField = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'lookupDataset') {
                            this.showDataset = true;
                            this.dataset = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'lookupDatasetFieldName') {
                            this.showDataField = true;
                            this.dataField = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'groupByColumns') {
                            this.showGroupCol = true;
                            this.groupCol = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'aggregationColumns') {
                            this.showAggreCol = true;
                            this.aggreCol = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'valueStartFrom') {
                            this.showRangeStartVal = true;
                            this.rangeStartVal = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'valueEndTo') {
                            this.showRangeEndVal = true;
                            this.rangeEndVal = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'valueBase') {
                            this.showRangeRefer = true;
                            this.rangeRefer = this.getRuleInput[i].defaultValue;
                        }
                        if (this.getRuleInput[i].name == 'valueStep') {
                            this.showRangeSize = true;
                            this.rangeSize = this.getRuleInput[i].name;
                        }
                        if (this.getRuleInput[i].name == 'customSqlValidation') {
                            this.showCustomSql = true;
                            this.customSql = this.getRuleInput[i].name;
                        }
                    }
                }
                if (this.getRuleOutput) {
                    for (var i = 0; i < this.getRuleOutput.length; i++) {
                        if (this.getRuleOutput[i].name == 'outputFields') {
                            this.showOutputFields = true;
                            this.outputField = this.getRuleOutput[i].defaultValue;
                        }
                        if (this.getRuleOutput[i].name == 'qualityType') {
                            this.showQualityType = true;
                            this.scoreOptions = this.getRuleOutput[i].valueOptions;
                            this.scoreWay = this.getRuleOutput[i].defaultValue;
                        }
                        if (this.getRuleOutput[i].name == 'outputLimit') {
                            this.showOutputLimit = true;
                            this.badDataLimit = this.getRuleOutput[i].defaultValue;
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .dialog-footer {
        text-align: left;
    }

    .demo-ruleForm {
        width: 50%;
    }

    .clearBox {
        padding-left: 20px;
    }
</style>
