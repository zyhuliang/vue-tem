<!-- steps参数 dataFlow Join lookup -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-lookup-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'mode'| cn">
                                <el-tooltip  class="item" effect="dark" content="查找模式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.mode" placeholder="请选择" @change="modeSelect">
                                        <el-option value="mapping"></el-option>
                                        <el-option value="chain"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.mode==''">选择内容不能为空</i>
                        <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit " @tab-click="handleClick">
                                
                                <el-tab-pane :key="index" v-for="(item, index) in nodeData.ruleSettings" :label="index | labTabsFilter| cn" :name="index | nameTabsFilter">
                                        <el-form-item label="数据集">
                                                <el-tooltip class="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合" placement="top">
                                                        <i class="parIcon el-icon-warning"></i>
                                                </el-tooltip>
                                                <el-input :placeholder="'（必填）'" :value="nodeData.ruleSettings[index].dataset" @input="(value) => dataSetVal(value, index)">
                                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq(index)"></el-button>
                                                </el-input>
                                        </el-form-item>
                                        <i class="sign" v-if="nodeData.ruleSettings[index].dataset==''">数据集不能为空</i>
                                        <el-form-item :label="'inputKeyColumn'| cn">
                                                <el-tooltip  class="item" effect="dark" content="用作key的字段" placement="top">
                                                        <i class="parIcon el-icon-warning"></i>
                                                </el-tooltip>
                                                <el-select class="selectClass" :value="nodeData.ruleSettings[index].inputKeyColumn" placeholder="（必填）" @change="(value) => inputKeyColumnSelect(value, index)">
                                                        <div v-if = "getSelFields[0]">
                                                                <el-option v-for="(lf,inputF,index) in getSelFields[0].fields" :key="inputF" :value="lf.alias"></el-option>
                                                        </div>
                                                </el-select>
                                        </el-form-item>
                                        <i class="sign" v-if="nodeData.ruleSettings[index].inputKeyColumn==''">{{'inputKeyColumn'| cn}}不能为空</i>
                                        <el-form-item :label="'valueColumns'| cn">
                                                <el-tooltip  class="item" effect="dark" :content="'valueColumns'| cn" placement="top">
                                                        <i class="parIcon el-icon-warning"></i>
                                                </el-tooltip>
                                                <div>
                                                        <ul class="tableTitle">
                                                                <li>列名 </li>
                                                                <li>别名</li>
                                                                <li>默认值 (no match)</li>
                                                                <li>默认值 (null key)</li>
                                                        </ul>
                        
                                                        <ul class="tableTitle" v-for="(vc,key1) in nodeData.ruleSettings[index].valueColumns" :key="key1">
                                                                <li>
                                                                        <el-select class="selectClass" :value="vc.name" placeholder="（必填）" @change="(value) => taxonNameVal(value,index,key1)">
                                                                                <el-option v-for="(lName,inputLname) in inputFi[index]" :key="inputLname" :value="lName.name"></el-option>
                                                                        </el-select>
                                                                </li>
                                                                 <li>
                                                                        <el-input class="selectClass" :value="vc.alias" :placeholder="'（必填）'" @input="(value) => aliasNameVal(value,index,key1)"></el-input>
                                                                </li>
                                
                                                                <li>
                                                                        <el-input class="selectClass" :value="vc.defaultNoMatch" :placeholder="'（必填）'" @input="(value) => defaultValueVal(value,index,key1)"></el-input>
                                                                </li>
                                                                <li>
                                                                        <el-input class="selectClass" :value="vc.defaultNullKey" :placeholder="'（必填）'"  @input="(value) => nullDefaultValueVal(value,index,key1)"></el-input>
                                                                </li>
                                                                <div class="removeValueColumns" v-if="nodeData.ruleSettings[index].valueColumns.length > '1'">
                                                                        <i @click="removeValueColumns(index,key1)" class="i remove el-icon-remove-outline"></i>
                                                                </div>
                                                        </ul>
                                                        <div class="adValueColumns">
                                                                <i @click="addValueColumns(index)" class="i el-icon-circle-plus-outline"></i>
                                                        </div>
                                                </div>
                                        </el-form-item>
                                </el-tab-pane>

                        </el-tabs>
                </el-form>
                <!-- 数据集查询 dialog-->
                <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                           :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
                        <el-form>
                                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
                                                     rootName="dataset_dir"></data-source-inquire>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
                        </div>
                </el-dialog>
        </div>
</template>

<script>
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {querySchema} from '@api'
    var vm = {}
    export default  vm = {
        components: {
            dataSourceInquire
        },
        data() {
            return {
                nodeData:{},    //节点参数
                inputData:{},
                inputFi:[],
                editableTabsValue: 'Set_1',
                dialogDataSetVisible:false,
                labelPosition: 'left',
                dialogIndex:0,
                singData: []
            }
        },
        computed: {
        },
        props:["nodeSetData","inputField","getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                this.editableTabsValue = 'Set_1';
            },
            inputField(newValue, oldValue) {
                this.inputData = newValue;
            },
            inputFi(newValue, oldValue){
                //     alert('1')
                //     console.log(newValue)
            }
        },
        filters:{
            labTabsFilter : function (val) {
                return "Set_"+(val+1)
            },
            nameTabsFilter : function (val) {
                return "Set_"+(val+1)
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            /**
             * mode 绑定值
             * ------------------------------------------------------------------
             */
            modeSelect : function (val) {
                this.nodeData.mode = val;
            },
            /**
             * tabs 新增、删除操作
             * ------------------------------------------------------------------
             */
            handleTabsEdit(targetName, action) {
                var _this =this;
                if (action === 'add') {
                    let newTabName = 'Set_'+ (this.nodeData.ruleSettings.length+1);
                    this.nodeData.ruleSettings.push({
                        tabName:newTabName,
                        dataset: "",
                        datasetId:"",
                        inputKeyColumn: "",
                        schema:"",
                        schemaId:"",
                        valueColumns: [{
                            name:"",
                            alias:"",
                            defaultNoMatch:"",
                            defaultNullKey:""
                        }]
                    });
                    this.editableTabsValue = newTabName;
                }
                if (action === 'remove') {
                    let tabs = _this.nodeData.ruleSettings;
                    let activeName = _this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.tabName === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.tabName;
                                }
                            }
                        });
                    }

                    _this.editableTabsValue = activeName;
                    _this.nodeData.ruleSettings = tabs.filter(tab => tab.tabName !== targetName);
                }
            },
            handleClick(tab, event) {
                this.dialogIndex = tab.index
                var id = JSON.parse(sessionStorage.getItem("datasetIdArr"))[tab.index].schemaId
                this.getDatasetId(id)
                // console.log( this.inputFi)
            },
            /**
             * 获取子组件的dataSet
             * ------------------------------------------------------------------
             */
            getSelectDateVal(data){
                this.getSelvalDataName = data.name;
                this.getSelvalDataId = data.id;
                this.getschemaName = data.schemaName;
                this.getschemaId = data.schemaId;
                this.getSelvalData = data;
            },
            /**
             * 获取dataSet 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            dataSetInq : function (index) {
                this.dialogDataSetVisible = true;
                this.dialogIndex = index;
            },
            submitDataSet : function (index) {
                this.cancelDatasetDialog();
                this.nodeData.ruleSettings[this.dialogIndex].dataset = this.getSelvalDataName;
                this.nodeData.ruleSettings[this.dialogIndex].datasetId = this.getSelvalDataId;
                this.nodeData.ruleSettings[this.dialogIndex].schema = this.getschemaName;
                this.nodeData.ruleSettings[this.dialogIndex].schemaId = this.getschemaId;
                this.inputFi[this.dialogIndex]=this.getSelvalData.fields
            },
            dataSetVal : function (val,index) {
                this.nodeData.ruleSettings[index].dataset = val;
            },
            /**
             * inputKeyColumn 选择绑定值
             * ------------------------------------------------------------------
             */
            inputKeyColumnSelect : function (val,index) {
                this.nodeData.ruleSettings[index].inputKeyColumn = val;
            },
            /**
             * valueColumns table 新增数据
             * ------------------------------------------------------------------
             */
            addValueColumns : function (index) {
                this.nodeData.ruleSettings[index].valueColumns.push({ "name": "", "alias": "", "defaultNoMatch": "","defaultNullKey":"" })
            },
            /**
             * 移除 valueColumns
             * ------------------------------------------------------------------
             */
            removeValueColumns:function (index,index1) {
                this.nodeData.ruleSettings[index].valueColumns.splice(index1,1);
            },
            /**
             * valueColumns name 列名 绑定值
             * ------------------------------------------------------------------
             */
            taxonNameVal:function (val,index,index1) {
                this.nodeData.ruleSettings[index].valueColumns[index1].name = val;
            },
            /**
             * valueColumns alias 别名 绑定值
             * ------------------------------------------------------------------
             */
            aliasNameVal:function (val,index,index1) {
                this.nodeData.ruleSettings[index].valueColumns[index1].alias = val;
            },
            /**
             * valueColumns defaultNoMatch 默认值 (no match) 绑定值
             * ------------------------------------------------------------------
             */
            defaultValueVal:function (val,index,index1) {
                this.nodeData.ruleSettings[index].valueColumns[index1].defaultNoMatch = val;
            },
            /**
             * valueColumns defaultNullKey 默认值 (null key) 绑定值
             * ------------------------------------------------------------------
             */
            nullDefaultValueVal:function (val,index,index1) {
                this.nodeData.ruleSettings[index].valueColumns[index1].defaultNullKey = val;
            },
            //获取对应点的schemaId的fields字段
           getDatasetId(id){
                var _this = this
                querySchema(id).then(data => {
                _this.inputFi[_this.dialogIndex] = data.fields;
                this.$set(this.inputFi,_this.dialogIndex, _this.inputFi[_this.dialogIndex])
                })
            }
        },
        mounted() {
                var idValue = JSON.parse(sessionStorage.getItem("datasetIdArr"))
                if(idValue.length===0){
                        this.inputFi[this.dialogIndex] = []

                }else {
                        var id = JSON.parse(sessionStorage.getItem("datasetIdArr"))[this.dialogIndex].schemaId
                        this.getDatasetId(id)
                }
            this.nodeData = this.nodeSetData;
            console.log(this.nodeData);
            this.inputData = this.inputField;
            if(this.nodeData.ruleSettings !== "" || this.nodeSetData.ruleSettings.length !== 0){
                for(var i =0; i<this.nodeData.ruleSettings.length; i++){
                    this.nodeData.ruleSettings[i].tabName = "Set_"+(i+1);
                }
            }
        }
    }

</script>

<style scoped>
        .selectClass{
                width: 100%;
        }
        .tableTitle{
                float: left;
                width: 100%;
                height: 30px;
                margin: 10px 0px 0px 0px;
                padding:0px;
        }
        .tableTitle li{
                float: left;
                width: 23%;
                margin-right: 1%;
                text-align: center;
        }
        .adValueColumns{
                float: left;
        }
        .adValueColumns i{
                color: #3e98fe;
                cursor: pointer;
        }
        .removeValueColumns i{
                color: #ff4949;
                cursor: pointer;
        }
        .sign{
                margin-left:150px; 
                color: red;
                padding:0px; 
                font-size:8px;
                font-style:normal;
        }
        .empty {
                color: red;
                padding:0px; 
                font-size:8px;
                font-style:normal;
        }
        .el-input__inner {
                width: 100%;
                padding: 0px;
                border: 1px solid red;
                -webkit-appearance: none;
                background-color: #fff;
                background-image: none;
                border-radius: 4px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                color: #606266;
                display: inline-block;
                font-size: inherit;
                height: 40px;
                line-height: 40px;
                outline: 0;
                padding: 0 15px;
                -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        }
        .stepTable .el-form-item{
                margin-bottom: 0px !important;
                margin-top: 10px;
        }
</style>