<!-- steps参数 dataFlow IO source -->
<template>
     <div>
        <el-form id="bm-nodeset-source-form" ref="nodeSetData" :model="nodeSetData"  label-width="150px" >
            <el-form-item :label="'dataset'" >
                        <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input placeholder="请选择内容" :value="nodeData.dataset" :model="nodeData.dataset"  :disabled="true">
                                <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq"></el-button>
                        </el-input>
                </el-form-item>
            <el-form-item :label="'engine'" v-if="nodeData.engine == 'KAFKA'||'HDFS'">
                        <el-input placeholder="请选择内容" :value="nodeData.engine" :model="nodeData.engine" @input="engineChange" disabled>
                        </el-input>
                </el-form-item>
            <el-form-item :label="'brokers'" v-if="nodeData.engine == 'KAFKA'" >
                        <el-input placeholder="请选择内容" :value="nodeData.brokers" :model="nodeData.brokers" @input="brokersChange" disabled>
                        </el-input>
                </el-form-item>
            <el-form-item :label="'topic'" v-if="nodeData.engine == 'KAFKA'" >
                        <el-input placeholder="请选择内容" :value="nodeData.topic" :model="nodeData.topic" @input = "topicChange" disabled>
                        </el-input>
                </el-form-item>
            <el-form-item  :label="'format'" v-if="nodeData.engine == 'KAFKA'||'HDFS'">
                        <el-tooltip class="item" effect="dark" content="数据格式，包括CSV和Parquet" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select class="selectClass" name="format" :value="nodeData.format"  placeholder="请选择" @change="formatSelect" style="width:100%;" disabled>
                                <el-option
                                        v-for="item in ['csv','json']"
                                        :key="item"
                                        :name="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                        </el-select>
                </el-form-item>
            <el-form-item :label="'delimiter'"  v-if="nodeData.engine == 'KAFKA'||'HDFS'">
                    <el-input placeholder="请选择内容" :value="nodeData.delimiter" :model="nodeData.delimiter" @input="delimiterChange" disabled>
                    </el-input>
            </el-form-item>
            <el-form-item :label="'quote'"  v-if="nodeData.engine == 'KAFKA'||'HDFS'">
                        <el-input placeholder="请选择内容" :value="nodeData.quoteChar" :model="nodeData.quoteChar" @input="quoteChange" disabled>
                        </el-input>
                </el-form-item>
            <el-form-item :label="'escape'" v-if="nodeData.engine == 'KAFKA'||'HDFS'" >
                        <el-input placeholder="请选择内容" :value="nodeData.escapeChar" :model="nodeData.escapeChar" @input="escapeChange" disabled>
                        </el-input>
                </el-form-item>
                <el-form-item :label="'startingOffsets'" >
                            <el-select class="selectClass w100"  :value="nodeData.startingOffsets" placeholder="(选填 非必填项)"  @change = "startingOffsetsSelect">
                                     <el-option v-for="item in ['latest','earliest']" :key="item" :value="item"></el-option>
                            </el-select>
                </el-form-item>
            <el-form-item :label="'watermarkColumn'" >
                            <el-select class="selectClass w100" filterable allow-create  default-first-option :value="nodeData.watermark.watermarkColumn" placeholder="(选填 非必填项)"  @change="valueColumnsSelect">
                                    <el-option v-for="(lb,inputLb) in watermarkColumnArr" :key="inputLb" :value="lb.name"></el-option>
                            </el-select>
                </el-form-item>
            <el-form-item :label="'watermarkInterval'">
                        <el-select class="selectClass w49"  :value="num"  @change="changeNum" >
                                <el-option v-for="(lb,inputLb) in ['1','2','3','4','5','10','20','30']" :key="lb" :value="lb"></el-option>
                        </el-select>
                        <el-select class="selectClass w49 fr"  :value="name"  @change="changeName">
                                <el-option v-for="(lb,inputLb) in ['milliseconds','seconds','minutes','hours']" :key="lb" :value="lb"></el-option>
                        </el-select>
            </el-form-item>
        </el-form>
         <!-- 数据集查询 dialog-->
         <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                    :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
             <el-form>
                 <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal" filterType="kafka"
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
    import jqCronBuilderJs from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz'
    import jqCronBuilderCss from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz.css'
    import cronstrue from 'cronstrue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {querySchema } from '@api'
    export default {
        components: {
            dataSourceInquire
        },
        data() {
            return {
                nodeData:{
                    watermark: {
                        watermarkColumn: "",
                        watermarkInterval: ""
                    }                   
                },           //存放节点内容
                bok: false,
                dialogDataSetVisible:false,
                labelPosition: 'left',
                crrentDatasetType:false,
                cronCl:true,
                cronDis:false,
                getfields:[],
                num: '',
                name: '',
                watermarkInterval:'',
                type:"KAFKA",
                startingOffsetsArr:["earliest", "latest"],
                watermarkColumnArr:[]
            }
        },
        props:["nodeSetData", "datasetType","watermarkColumnArrsteps"],  //从父组件nodeset.vue中传递过来的节点信息
        //监听节点信息
        watch: {
            nodeSetData: {
                handler:function(newValue, oldValue){
                    this.nodeData = newValue;   //将节点信息存放到nodeData中
                    // this.getSchemaCon(this.nodeData.schemaId)
                    this.watermarkIntervalFn()
                    if(this.nodeData.ignoreMissingPath == undefined){
                        this.$set(this.nodeData, 'ignoreMissingPath', false )
                    }
                },
                deep: true
            },
            datasetType: function(newValue, oldValue){
                this.crrentDatasetType = newValue
            },
            nodeData:{
                handler: function(newValue, oldValue){
                    var _this = this;
                    if(!newValue.dataset){
                        newValue.dataset="";
                    }
                    if(newValue.dataset=='') {
                        _this.bok = true
                    } else {
                        _this.bok = false
                    }
                },
                deep: true
            },
            watermarkColumnArrsteps:{
                handler:function(val){
                    this.watermarkColumnArr = val
                }
            }
        },
        filters:{
            nodeNameFilter : function (value) {
                if(value == "dataset"){
                    return "数据集";
                }else{
                    return value;
                }
            },
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
             * 获取type=HDFS format 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            formatSelect : function (val) {
                this.nodeData.format = val;
            },
            /**
             * dataSet 查询
             * ------------------------------------------------------------------
             */
            dataSetInq : function () {
                this.dialogDataSetVisible = true;
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
                this.getfields = data.fields;
                this.getSelvalData = data;
                this.nodeData.engine = data.type
                this.nodeData.brokers = data.brokers
                this.nodeData.topic = data.topic
                this.nodeData.schema = data.schemaName
                this.nodeData.schemaId = data.schemaId
                this.nodeData.delimiter = data.storageConfigurations.separator
                this.nodeData.format = data.storageConfigurations.format
                this.watermarkColumnArr = JSON.parse(JSON.stringify( this.getfields))
                this.watermarkColumnArr.unshift({
                                    alias: "",
                                    column: "",
                                    description: "",
                                    type: "string"
                            })
            },
            valueColumnsSelect(val){
                this.nodeData.watermark.watermarkColumn = val;
            },
            //startingOffsets
            startingOffsetsSelect(val){
                this.nodeData.startingOffsets = val;
                if(this.nodeData.startingOffsets&& this.nodeData.startingOffsets!=''){
                        this.$set(this.nodeData, this.nodeData.startingOffsets, val )
                    }  
            },
            /**
             * 获取dataSet 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitDataSet : function () {
                this.cancelDatasetDialog();
                this.nodeData.dataset = this.getSelvalDataName;
                this.nodeData.datasetId = this.getSelvalDataId;
                //选择dataSet 获取 输出字段
                var fieldsArr = JSON.stringify(this.getSelvalData.fields)
                var fieldsFilter = JSON.parse(fieldsArr);
                for(var f =0; f<fieldsFilter.length; f++){
                    fieldsFilter[f].column=fieldsFilter[f].name;
                    delete fieldsFilter[f].name;
                }
                for(var i = 0; i < fieldsFilter.length; i++){
                    fieldsFilter[i].alias = ""
                }
                this.$emit('sourceOutput',fieldsFilter)
                
            },
            //获取时间数值
            changeNum: function(val){
                this.num = val
                this.nodeData.watermark.watermarkInterval =  val +" "+ this.name
            },
            //获取时间值的时分秒
            changeName: function(val){
               this.name = val
               this.nodeData.watermark.watermarkInterval = this.num +" "+ val
            },
            //brokers 发生变化
            brokersChange(val){
                this.nodeData.brokers = val
            },
            //engine 发生变化
            engineChange(val){
                this.nodeData.engine = val
            },
            //topic 发生变化
            topicChange(val){
                this.nodeData.topic = val
            },
            //quote 发生变化
            quoteChange(val){
                this.nodeData.quoteChar = val
            },
            delimiterChange(val){
                this.nodeData.delimiter = val
            },
            //escape 发生变化
            escapeChange(val){
                this.nodeData.escapeChar = val
            },
            //watermarkInterval 执行
            watermarkIntervalFn(){
                if(this.nodeData.watermark.watermarkInterval){
                    this.num =((this.nodeData.watermark.watermarkInterval).split(" "))[0]
                    this.name =  ((this.nodeData.watermark.watermarkInterval).split(" "))[1]
                } else {
                    this.num = ''
                    this.name = ''
                }
            },
            getSchemaCon(schemaId){
                querySchema(schemaId).then(data => {
                    this.watermarkColumnArr = data.fields
                    this.watermarkColumnArr.unshift({
                                        alias: "",
                                        column: "",
                                        description: "",
                                        type: "string"
                                })
                    console.log(data)
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                })
            }
        },
        created() {
           
        },
        mounted(){
            this.nodeData = this.nodeSetData;
            if(this.nodeData.startingOffsets&& this.nodeData.startingOffsets!=''){
                        this.nodeData.startingOffsets = "latest"
                    }
            this.watermarkIntervalFn()
            let schemaId = sessionStorage.getItem('schemaId')
            // this.getSchemaCon(schemaId)
        }
    }
</script>

<style scoped>
    .sign{
        margin:0px; 
        color: red;
        padding:0px; 
        font-size:8px;
    }
    .w100 {
        width: 100%;
    }
    .w49 {
        width: 49%;
    }
    .fr{
        float: right;
    }
</style>