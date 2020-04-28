<!-- steps参数 dataFlow mapping lookupTable -->
<template>
    <div class="stepTable">
        <el-form id="bm-nodeset-cache-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
            <el-form-item :label="nodeData.dataset | dataSetNameFilter | cn">
                <el-tooltip class="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input placeholder="（必填）" :value="nodeData.dataset" @input="dataSetVal" name="dataset">
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq" name="dataSetInq"></el-button>
                </el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.dataset==''">{{'dataset'| cn}} 不能为空</i>
            <el-form-item :label="'schema'|cn">
                <el-tooltip class="item" effect="dark" content="1.Schema名称,从资源目录选择 2.格式为字符串：字符/数字/下划线/-的组合" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input placeholder="（必填）" :value="nodeData.schema" :disabled = "dataSelValDis" @input="schemaVal" name="schemaVal">
                    <el-button slot="append" icon="icon iconfont icon-ir-search" :disabled = "dataSelValDis" @click="schemaInq" name="schemaInq"></el-button>
                </el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.schema==''">{{'schema'|cn}} 不能为空</i>
            <el-form-item :label="'keyColumn'| cn">
                <el-tooltip class="item" effect="dark" content="用作key的字段" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input placeholder="字段（必填）" :value="nodeData.keyColumn" readonly @focus="keyColumnSelect()"></el-input>
            </el-form-item>
            <i class="sign" v-if="nodeData.keyColumn==''">{{'keyColumn'| cn}}  不能为空</i>
            <el-form-item :label="'valueColumns'| cn">
                <el-tooltip class="item" effect="dark" content="用作value的字段，多个字段用逗号分隔" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" multiple filterable allow-create  default-first-option :value="nodeData.valueColumns" @visible-change="valueColumnsFocus($event)" placeholder="（必填，多选）" @change="valueColumnsSelect">
                    <i v-if="getSelFields.length!=0">
                        <el-option v-for="(lb,inputLb,index) in getSelFieldData[0].fields" :key="inputLb" :value="lb.alias"  @click.shift.native="selectItem(lb,inputLb,index)"></el-option>
                    </i>

                </el-select>
            </el-form-item>
            <i class="sign" v-if="nodeData.valueColumns==''">{{'valueColumns'| cn}}  不能为空</i>
            <el-form-item :label="'engine'| cn">
                <el-tooltip class="item" effect="dark" content="cache系统，包括MapDB和REDIS" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" :value="nodeData.engine" :disabled = "dataSelValDis" placeholder="请选择" @change="engineSelect">
                    <el-option value="MapDB"></el-option>
                    <el-option value="REDIS"></el-option>
                    <el-option value="IGNITE"></el-option>
                </el-select>
            </el-form-item>
            <i class="sign" v-if="nodeData.engine==''">{{'engine'| cn}}  不能为空</i>
            <!-- engine MapDB-->
            <el-form-item :label="'path'| cn" v-if="nodeData.engine != 'REDIS' && nodeData.engine != 'IGNITE'">
                <el-tooltip class="item" effect="dark" content="存储cache文件的路径，指定一个目录" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.path" placeholder="（必填）" @input="pathVal" name="pathVal"></el-input>
            </el-form-item>
            <!--{{nodeData.path}}-->
            <p v-if="nodeData.engine != 'REDIS' && nodeData.engine != 'IGNITE'">
                <i class="sign" v-if="nodeData.path==''">{{'path'| cn}}  不能为空</i>
            </p>
            <!-- engine REDIS and IGNITE-->
            <el-form-item :label="'url'| cn" v-if="nodeData.engine == 'REDIS' || nodeData.engine == 'IGNITE'">
                <el-tooltip class="item" effect="dark" content="服务器的url,格式host:port,host:port,......,ignite可以给端口号指定范围如:host:47500..47509" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input :value="nodeData.url" placeholder="（必填）" @input="urlVal" name="urlVal"></el-input>
            </el-form-item>

            <!-- engine REDIS-->
            <el-form-item :label="'key'| cn" v-if="nodeData.engine == 'REDIS'">
                <el-tooltip class="item" effect="dark" content="Redis中存储的key" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input placeholder="（必填）" :value="nodeData.key" @input="keyVal" name="keyVal">
                    <el-button slot="append" icon="icon fa fa-random" @click="keyRandomUuid" name="keyRandomUuid"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item :label="'password'| cn"  v-if="nodeData.engine == 'REDIS'">
                <el-tooltip class="item" effect="dark" content="Redis连接密码" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input type="password" auto-complete="new-password" :value="nodeData.password" placeholder="password" @input="passwordVal" name="password"></el-input>
            </el-form-item>

            <!-- engine REDIS and IGNITE-->
            <el-form-item :label="'cacheName'| cn" v-if="nodeData.engine == 'IGNITE'">
                <el-tooltip class="item" effect="dark" content="ignite中缓存的名称" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input placeholder="（必填）" :value="nodeData.cacheName" @input="cacheNameVal" name="cacheNameVal">
                    <el-button slot="append" icon="icon fa fa-random" @click="cacheNameRandomUuid" name="cacheNameRandomUuid"></el-button>
                </el-input>
            </el-form-item>

        </el-form>
        <!-- 数据集查询 dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                   :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
            <el-form>
                <data-source-inquire ref="datasourceinquire" @thisSelectDatasetVal="getSelectDateVal"
                                     rootName="dataset_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="dialogDataSetVisible = false" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- schema 查询 -->
        <div v-if="dialogSchemaVisible == true" class="nodeDialog">
            <div class="diHeader">
                <h3>元数据查询</h3>
                <span @click="dialogSchemaVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form class="elForm" ref="form" label-width="80px" :label-position="labelPosition" id="bm-lookupTable-schemaForm">
                    <schema-inquire @thisSelectSchemaVal="getSelectSchemaVal"></schema-inquire>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="submitSchema" name="schemaSure">确定</el-button>
                <el-button @click="dialogSchemaVisible = false" name="schemaCancel">取消</el-button>
            </div>
        </div>
        <!--字段选择-->
        <el-dialog v-dialog-drag
                title="字段"
                :visible.sync="getFieldsDialogVisible"
                custom-class="gettFieldsDialog"
                :modal="false"
                :before-close="handleClose">
            <div class="dialog-content">
                <getFields :getFields = "getFields" @selFieldsVal = "selFieldsVal"></getFields>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import schemaInquire from '@schemaInq/schemaInquire.vue';
    import {nodeDataSet} from '@api';
    import {queryObject,createParameter} from '@function/queryParameter.js';
    import {RandomUuid} from '@function/comFunction'
    import getFields from '@components/design/designDraw/getFields.vue';
    export default {
        components: {
            dataSourceInquire,
            schemaInquire,
            getFields,
        },
        data() {
            return {
                nodeData:{
                    cacheName: "",
                    dataset: "",
                    engine: "MapDB",
                    interceptor: "",
                    key: "",
                    keyColumn: "",
                    password: "",
                    path: "",
                    schema: "",
                    sessionCache: "",
                    singleRowCache: "true",
                    url: "",
                    valueColumns: []
                },
                dialogDataSetVisible:false,
                dialogSchemaVisible:false,
                labelPosition: 'left',
                dataSelValDis:false,
                dataSetIfVal:'',
                dataSchemaIfVal:'',
                dataSchemaIdIfVal:'',
                getFieldsDialogVisible:false,
                tableIndex:"",
                getFields:[],
                getSelFieldData:[
                    {
                        id: "input",
                        fields:[]
                    }
                ],
                range: []
            }
        },
        props:["nodeSetData","getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                var _this = this;
                var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                nodeDataSet(parameter).then(data => {
                    if(data.content.length == 0){

                    }else{
                        _this.dataSetIfVal = data.content[0].name;
                    }

                    if(this.nodeData.dataset != this.dataSetIfVal){
                        this.dataSelValDis = false;
                    }else{
                        this.dataSelValDis = true;
                    }
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            range(val) {
                //return;
                if (this.range.length == 2) {
                    this.nodeData.valueColumns = this.getSelFieldData[0].fields
                    .slice(this.range[0], this.range[1] + 1)
                    .map(function(item) {
                        return item.column;
                    });
                }

                if (this.range.length == 1) {
                    this.nodeData.valueColumns = [this.getSelFieldData[0].fields[this.range[0]].column];
                }
            }
        },
        filters:{
            dataSetNameFilter : function () {
                return "数据集";
            },
        },
        methods: {
            selectItem(lb,index,inputLb) {
                this.nodeData.valueColumns=[];
                if (this.range.length == 2) {
                    this.range = [];
                }

                this.range.push(index);
                this.range.sort();
            },
            handleClose:function(){
                this.getFieldsDialogVisible = false;
                this.nodeData.aggregations[this.tableIndex].column = '';
            },
            /**
             * dataSet 查询
             * ------------------------------------------------------------------
             */
            dataSetInq : function () {
                this.dialogDataSetVisible = true;
            },
            /**
             * schema 查询
             * ------------------------------------------------------------------
             */
            schemaInq : function () {
                this.dialogSchemaVisible = true;
            },
            /**
             * 获取子组件的dataSet
             * ------------------------------------------------------------------
             */
            getSelectDateVal(data){
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
                this.getSelvalSchemaName = data.schemaName;
                this.getSelvalSchemaId = data.schemaId;
            },
            /**
             * dataSet input 值
             * ------------------------------------------------------------------
             */
            dataSetVal:function (val) {

                var _this = this;
                this.nodeData.dataset = val;
                if(val != this.dataSetIfVal){
                    this.dataSelValDis = false;
                    this.nodeData.datasetId = RandomUuid();
                    this.nodeData.schema = "";
                    this.nodeData.schemaId = "";
                }else{
                    this.dataSelValDis = true;
                    var parameter = createParameter('name',val,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                    nodeDataSet(parameter).then(data => {
                        this.dataSelValDis = true;
                        _this.nodeData.id = this.getSelvalDataId;
                        _this.nodeData.schema = this.getSelvalSchemaName;
                        _this.nodeData.schemaId = this.getSelvalSchemaId;
                        _this.nodeData.type = "HDFS";
                        _this.nodeData.sql = data.content[0].storageConfigurations.sql;
                        _this.nodeData.path = data.content[0].storageConfigurations.path;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
                this.cacheNameRandomUuid()
                this.keyRandomUuid()
            },
            /**
             * 获取dataSet 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitDataSet : function () {
                this.dialogDataSetVisible = false;
                this.nodeData.dataset = this.getSelvalDataName;
                this.nodeData.id = this.getSelvalDataId;
                this.nodeData.schema = this.getSelvalSchemaName;
                this.nodeData.schemaId = this.getSelvalSchemaId;
                this.dataSetIfVal = this.nodeData.dataset;

                var _this = this;
                //根据name请求获取dataSet
                var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                nodeDataSet(parameter).then(data => {
                    this.dataSelValDis = true;
                    _this.nodeData.type = "HDFS";
                    _this.nodeData.sql = data.content[0].storageConfigurations.sql;
                    _this.nodeData.path = data.content[0].storageConfigurations.path;
                })
            },
            /**
             * 获取子组件的schema
             * ------------------------------------------------------------------
             */
            getSelectSchemaVal(data){
                this.nodeData.schema = data.name;
                this.nodeData.schemaId = data.id;
            },
            /**
             * 获取schema input 值
             * ------------------------------------------------------------------
             */
            schemaVal:function (val) {
                this.nodeData.schema = val;

                if(val != this.dataSchemaIfVal){
                    this.nodeData.schemaId = RandomUuid();
                }else{
                    this.nodeData.schemaId = this.dataSchemaIdIfVal
                }
                this.cacheNameRandomUuid()
                this.keyRandomUuid()
            },
            /**
             * 获取schema 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitSchema : function () {
                this.dialogSchemaVisible = false;
                this.dataSchemaIfVal = this.nodeData.schema;
                this.dataSchemaIdIfVal = this.nodeData.schemaId;
            },
            /**
             * 获取keyColumn 下拉框 绑定获取值 (下拉框内为动态获取input字段)
             * ------------------------------------------------------------------
             */
            keyColumnSelect : function () {
                this.getFieldsDialogVisible = true;
                this.getFields = this.getSelFields[0].fields;
            },
            //字段选择后的回显
            selFieldsVal: function (val) {
                this.nodeData.keyColumn = val;
                this.nodeSetData.keyColumn = val;
                this.getFieldsDialogVisible = false;
            },
            /**
             * 获取keyColumn 下拉框 绑定获取值 (下拉框内为动态获取input字段)
             * ------------------------------------------------------------------
             */
            valueColumnsSelect : function (val) {
                this.nodeData.valueColumns = val;

                // console.log(val);
                // console.log(this.nodeData.valueColumns);
            },
            valueColumnsFocus:function(callback){
                var _this = this;
                if(callback == true){
                    _this.getSelFieldData = JSON.parse(JSON.stringify(_this.getSelFields));
                }else{
                    _this.getSelFieldData = [{id: "input",fields:[]}]
                }
            },
            /**
             * 获取engine 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            engineSelect : function (val) {
                this.nodeData.engine = val;
            },
            /**
             * 获取path 绑定获取值 (engine MapDB)
             * ------------------------------------------------------------------
             */
            pathVal : function (val) {
                this.nodeData.path = val;
            },
            /**
             * 获取url 绑定获取值 (engine REDIS and IGNITE)
             * ------------------------------------------------------------------
             */
            urlVal : function (val) {
                this.nodeData.url = val;
            },
            /**
             * 获取key 绑定获取值 (engine REDIS) 点击获取UUID 随机key值
             * ------------------------------------------------------------------
             */
            keyRandomUuid:function () {
                this.nodeData.key = RandomUuid();
            },
            keyVal : function (val) {
                this.nodeData.key = val;
            },
            /**
             * 获取password 绑定获取值 (engine REDIS)
             * ------------------------------------------------------------------
             */
            passwordVal : function (val) {
                this.nodeData.password = val;
            },
            /**
             * 获取cacheName 绑定获取值 (engine REDIS) 点击获取UUID 随机key值
             * ------------------------------------------------------------------
             */
            cacheNameRandomUuid:function () {
                this.nodeData.cacheName = RandomUuid();
            },
            cacheNameVal : function (val) {
                this.nodeData.cacheName = val;
            },

        },
        mounted() {
            this.nodeData = this.nodeSetData;
            /*console.log(this.nodeData);*/
            var _this = this;
            var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
            nodeDataSet(parameter).then(data => {
                if(data.content.length == 0){

                }else{
                    _this.dataSetIfVal = data.content[0].name;
                }

                if(this.nodeData.dataset != this.dataSetIfVal){
                    this.dataSelValDis = false;
                }else{
                    this.dataSelValDis = true;
                }
            })
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
        width: 31%;
        margin-right: 1%;
        text-align: center;
    }
    .adSct{
        float: left;
    }
    .adSct i{
        color: #3e98fe;
    }
    .removeSct i{
        color: #ff4949;
    }
    .sign{
        margin-left:150px;
        color: red;
        padding:0px;
        font-size:8px;
        font-style:normal;
    }
    .stepTable .el-form-item{
        margin-bottom: 0px !important;
        margin-top: 10px;
    }
</style>