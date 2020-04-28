<!-- steps参数 dataFlow Group aggregations -->
<template>
        <div>
                <el-form id="bm-nodeset-aggregate-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="groupBy">
                                <el-tooltip class="item" effect="dark" content="用作汇聚的字段，（一般是维度），支持1-n 个字段" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" multiple filterable allow-create default-first-option :value="nodeData.groupBy"
                                                placeholder="请选择" @change="groupBySelect">
                                        <p v-if="groupbyArr">
                                                 <el-option v-for="(la,inputLa,index) in groupbyArr" :key="inputLa" :value="la.alias"></el-option>
                                        </p>
                                       
                                </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="slideDuration">
                                <el-tooltip class="item" effect="dark"  placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-switch
                                        v-model="nodeData.slideDuration"
                                        class="switch-style">
                                </el-switch>
                        </el-form-item> -->
                        
                        <el-form-item :label="' watermarkColumn'">
                                <el-select class="selectClass"  :value=" watermarkColumn" filterable   @change="changeWatermarkColumn">   
                                        <p v-if="getSelFields[0]">
                                                 <el-option v-for="(la,inputLa,index) in getSelFields[0].fields" :key="inputLa" :value="la.alias"></el-option>
                                        </p>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'watermarkInterval'">
                                <el-input class="selectClass w49"  v-model="watermarkNum"  @input="changeNum" >
                                        
                                </el-input>
                                <el-select class="selectClass w49 fr"  :value="watermarkName"  @change="changeName">
                                        <el-option v-for="(lb,inputLb) in nameArr" :key="lb" :value="lb"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'windowTimeColumn'">
                                <el-select class="selectClass"    :value="timeColumn" filterable @change="changeTimeColumn">   
                                        <p v-if="getSelFields[0]">
                                                 <el-option v-for="(la,inputLa,index) in getSelFields[0].fields" :key="inputLa" :value="la.alias"></el-option>
                                        </p>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'slideDuration'">
                                <el-input class="selectClass w49"  v-model="windowFuncNum"  @input="changewindowFuncNum">
                                </el-input>
                                <el-select class="selectClass w49 fr"  :value="windowFuncName"  @change="changewindowFuncName">
                                        <el-option v-for="(lb,inputLb) in nameArr" :key="lb" :value="lb"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'windowDuration'">
                                <el-input class="selectClass w49"  v-model ="windowDurationNum"  @input="changewindowDurationNum">
                                       
                                </el-input>
                                <el-select class="selectClass w49 fr"  :value="windowDurationName"  @change="changewindowDurationName">
                                        <el-option v-for="(lb,inputLb) in nameArr" :key="lb" :value="lb"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="aggregations">
                                <el-tooltip class="item" effect="dark" content="需要汇聚的字段（一般为指标）。目前支持的聚合函数有avg、countDistinct、sum、sumDistinct、max、min和approxCountDistinct. 同样也支持1-n 个字段。必填项，无默认值。字段和函数从下拉列表中选择，别名为手动输入的字母/数字/_组成的字符串, 且第一个字符不允许为数字"
                                                placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-table :data="aggregationsArr.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                                                max-height="500">
                                        <el-table-column
                                                fixed
                                                type="index"
                                                width="50"
                                                :index="indexMethod">
                                        </el-table-column>
                                        <el-table-column prop="column" label="字段">
                                                <template slot-scope="scope">
                                                        <!-- <el-select class="selectClass" :value="scope.row.column" placeholder="字段（必填）" @change="(value) => agColumn(value,scope.$index,aggregationsArr)">
                                                                <p v-if="getSelFields[0]">
                                                                        <el-option v-for="(lb,inputLb,index) in getSelFields[0].fields" :key="inputLb" :value="lb.alias"></el-option>
                                                                </p>
                                                        </el-select> -->
                                                        <el-tooltip class="item" effect="dark" :content="scope.row.column == ''?'请点击选择字段':scope.row.column" placement="top">
                                                                <el-input placeholder="字段（必填）" :value="scope.row.column" readonly @focus="(value) => agColumn(value,scope.$index,aggregationsArr)"></el-input>
                                                        </el-tooltip>
                                                </template>
                                        </el-table-column>
                                        <el-table-column prop="function" label="函数">
                                                <template slot-scope="scope">
                                                        <el-select class="selectClass" :value="scope.row.function" placeholder="函数（必填）" @change="(value) => agFunction(value,scope.$index,aggregationsArr)">
                                                                <el-option value="count"></el-option>
                                                                <el-option value="avg"></el-option>
                                                                <!-- <el-option value="countDistinct"></el-option> -->
                                                                <el-option value="sum"></el-option>
                                                                <!-- <el-option value="sumDistinct"></el-option> -->
                                                                <el-option value="max"></el-option>
                                                                <el-option value="min"></el-option>
                                                                <!-- <el-option value="approxCountDistinct"></el-option> -->
                                                        </el-select>
                                                </template>
                                        </el-table-column>
                                        <el-table-column prop="alias" label="别名">
                                                <template slot-scope="scope">
                                                        <el-input :value="scope.row.alias" placeholder="别名（必填）" @input="(value) => agAlias(value,scope.$index,aggregationsArr)"></el-input>
                                                </template>
                                        </el-table-column>
                                        <el-table-column fixed="right" label="操作" width="80">
                                                <template slot-scope="scope">
                                                        <div class="removeAggregations">
                                                                <i title="移除当前对象" @click="deleteRow(scope.$index,aggregationsArr)" class="i remove el-icon-remove-outline"></i>
                                                        </div>
                                                </template>
                                        </el-table-column>
                                </el-table>
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                                                :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="aggregationsArr.length">
                                </el-pagination>
                                <div class="adAggregations">
                                        <i @click="addAggregations" title="新增对象" class="i add el-icon-circle-plus-outline"></i>
                                        <i @click="uploadAggregations" title="批量导入" class="i upload fa fa-upload"></i>
                                </div>
                        </el-form-item>
                </el-form>
                <!--字段选择-->
                <el-dialog v-dialog-drag title="字段" :visible.sync="getFieldsDialogVisible" custom-class="gettFieldsDialog" :modal="false"
                           :before-close="handleClose">
                        <div class="dialog-content">
                                <getFields :getFields="getFields" @selFieldsVal="selFieldsVal"></getFields>
                        </div>
                </el-dialog>
                <!-- aggregations批量导入 -->
                <div v-if="dialogUploadVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3><i class="i titleIcon fa fa-upload"></i>&nbsp;批量导入</h3>
                                <span @click="dialogUploadVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <div class="rf-swap">
                                        <el-input type="textarea" class="areaSize" v-model="upLoadVal" placeholder="请输入 字段,函数,别名 (多个以'回车'作为分隔符)" @input="(value) => upLoadArea(value)"></el-input>
                                </div>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitUpload">确定</el-button>
                                <el-button @click="dialogUploadVisible = false">取消</el-button>
                        </div>
                </div>

        </div>
</template>

<script>
    import getFields from '@components/design/designDraw/getFields.vue';
    export default {
        components: {getFields},
        data() {
            return {
                nodeData: {}, //存放节点参数信息
                dialogUploadVisible: false,
                upLoadVal: "",
                currentPage: 1,
                pagesize: 8,
                aggregationsArr: [],
                getFieldsDialogVisible: false,
                nameArr:['milliseconds','seconds','minutes','hours'],
                watermarkNum: '',
                watermarkName: '',
                windowFuncNum: '',
                windowFuncName: '',
                windowDurationNum:'',
                windowDurationName:'',
                time:'',
                watermarkColumn: '',
                timeColumn: '',
                groupbyArr:[],
                tableIndex:'',
                getFields: [],
            }
        },
        props: ["nodeSetData", "getSelFields"],
        //监听参数变化
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                this.aggregationsArr = this.nodeData.aggregations;
                this.aggregatePam()
            },
            getSelFields(val){
               this.groupbyArr = JSON.parse(JSON.stringify(val[0].fields))
               val[0].fields.unshift({
                                    alias: "",
                                    column: "",
                                    description: "",
                                    type: "string"
                            })
            },
            nodeData:{
                handler: function(val){                  
                },
                deep: true
            }
        },
        filters: {},
        methods: {
            handleClose: function() {
                this.getFieldsDialogVisible = false;
                this.nodeData.aggregations[this.tableIndex].column = '';
            },
           // 加载aggreate参数
            aggregatePam(){
                this.watermarkColumn = this.nodeData.watermark.watermarkColumn.toString()
                this.timeColumn = this.nodeData.windowFunc.timeColumn
                if(this.nodeData.watermark.watermarkInterval!=""){
                        this.watermarkNum =((this.nodeData.watermark.watermarkInterval).split(" "))[0]
                        this.watermarkName =  ((this.nodeData.watermark.watermarkInterval).split(" "))[1]
                } else {
                        this.watermarkNum = ''
                        this.watermarkName = ''
                }
                if(this.nodeData.windowFunc.windowDuration!="" && typeof this.nodeData.windowFunc.windowDuration!='undefined'){
                        this.windowDurationNum =((this.nodeData.windowFunc.windowDuration).split(" "))[0]
                        this.windowDurationName =  ((this.nodeData.windowFunc.windowDuration).split(" "))[1]
                } else {
                        this.windowDurationNum = ''
                        this.windowDurationName = ''
                }
                if(this.nodeData.windowFunc.slideDuration!="" && typeof this.nodeData.windowFunc.windowDuration!='undefined'){
                        this.windowFuncNum =((this.nodeData.windowFunc.slideDuration).split(" "))[0]
                        this.windowFuncName =  ((this.nodeData.windowFunc.slideDuration).split(" "))[1]
                } else {
                        this.windowFuncNum = ''
                        this.windowFuncName = ''
                }
            },
                // watermarkColumn
            changeWatermarkColumn(val){
                this.watermarkColumn = val
                this.nodeData.watermark.watermarkColumn =  val
            },
            changeTimeColumn(val){
                this.timeColumn = val
                this.nodeData.windowFunc.timeColumn =  val
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            indexMethod(index){
              return (this.pagesize * (this.currentPage - 1)) + index + 1;
            },
            /**
             * groupBySelect 下拉框 绑定获取值 (多选)
             * ------------------------------------------------------------------
             */
            groupBySelect: function(val) {
                this.nodeData.groupBy = val;
            },
            /**
             * aggregations table 新增数据
             * ------------------------------------------------------------------
             */
            addAggregations: function() {
                this.aggregationsArr.push({
                    "column": "",
                    "function": "",
                    "alias": ""
                })
            },
            /**
             * 移除 aggregations
             * ------------------------------------------------------------------
             */
            removeAggregations: function(index) {
                this.aggregationsArr.splice(index, 1);
            },
            /**
             * aggregations column 字段 绑定值
             * ------------------------------------------------------------------
             */
            agColumn: function(val, index, row) {
                // row[((this.currentPage - 1) * this.pagesize) + index].column = val;
                this.getFieldsDialogVisible = true;
                this.tableIndex = (this.pagesize * (this.currentPage - 1)) + index;
                this.getFields = this.getSelFields[0].fields;
            },
            //字段选择后的回显
            selFieldsVal: function(val) {
                // childValue就是子组件传过来的值
                console.log(val)
                this.nodeData.aggregations[this.tableIndex].column = val;
                this.getFieldsDialogVisible = false;
            },
            /**
             * aggregations function 函数 绑定值
             * ------------------------------------------------------------------
             */
            agFunction: function(val, index, row) {
                // this.nodeData.aggregations[index].function=val;
                row[((this.currentPage - 1) * this.pagesize) + index].function = val;
            },
            /**
             * aggregations alias 别名 绑定值
             * ------------------------------------------------------------------
             */
            agAlias: function(val, index, row) {
                row[((this.currentPage - 1) * this.pagesize) + index].alias = val;
            },
            /**
             * aggregations 批量导入
             * ------------------------------------------------------------------
             */
            uploadAggregations: function() {
                this.dialogUploadVisible = true;
                this.upLoadVal = "";
            },
            upLoadArea: function(val) {
                this.upLoadVal = val.replace("\r\n", "；");
            },
            submitUpload: function() {
                var _this = this;
                var upArr = new Array(); //定义一数组
                if (_this.upLoadVal == "") {
                    this.dialogUploadVisible = false;
                } else {
                    upArr = _this.upLoadVal.split("\n"); //字符分割
                    for (var i = 0; i < upArr.length; i++) {
                        var obj = upArr[i].split(",");
                        var objObj = new Object();
                        for (var j = 0; j < 3; j++) {
                            objObj.column = obj[0];
                            objObj.function = obj[1]
                            if (obj[2] == undefined) {
                                objObj.alias = ""
                            } else {
                                objObj.alias = obj[2]
                            }
                        }
                        _this.aggregationsArr.push(objObj);
                    }
                    this.dialogUploadVisible = false;
                }
            },
            deleteRow(index, rows) {
                rows.splice(((this.currentPage - 1) * this.pagesize) + index, 1);
            },
            //watermark 获取时间数值
            changeNum: function(val){
                if(val==''){
                this.watermarkName = ''
                }
                this.watermarkNum = val.replace(/[^\d]/g,'')
                this.nodeData.watermark.watermarkInterval =   this.watermarkNum +" "+ this.watermarkName
            },
            //watermark 获取时间值的时分秒
            changeName: function(val){
               this.watermarkName = val
               this.nodeData.watermark.watermarkInterval = this.watermarkNum +" "+ val
            },
            //windowFunc 获取时间数值
            changewindowFuncNum: function(val){
                if(val == ''){
                     this.windowFuncName = ''   
                }
                this.windowFuncNum = val.replace(/[^\d]/g,'')
                this.nodeData.windowFunc.slideDuration =  this.windowFuncNum +" "+ this.windowFuncName
                //this.$set(this.nodeData.windowFunc,this.slideDuration, val +" "+ this.windowFuncName)
            },
            //windowFunc 获取时间值的时分秒
            changewindowFuncName: function(val){
               this.windowFuncName = val
               //this.$set(this.nodeData.windowFunc,this.slideDuration, this.windowFuncNum +" "+ val)
               this.nodeData.windowFunc.slideDuration = this.windowFuncNum +" "+ val
            },
             //windowDuration 获取时间数值
            changewindowDurationNum: function(val){
                if(val == ''){
                   this.windowDurationName = ''     
                }
                this.windowDurationNum = val.replace(/[^\d]/g,'')
                this.nodeData.windowFunc.windowDuration =  this.windowDurationNum +" "+ this.windowDurationName
            },
            //windowDuration 获取时间值的时分秒
            changewindowDurationName: function(val){
               this.windowDurationName = val
               this.nodeData.windowFunc.windowDuration = this.windowDurationNum +" "+ val
            }

        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.aggregationsArr = this.nodeSetData.aggregations;
            this.aggregatePam()
            
        }
    }
</script>

<style scoped>
        .selectClass {
                width: 100%;
        }

        .tableTitle {
                float: left;
                width: 100%;
                height: 30px;
                margin: 10px 0px 0px 0px;
                padding: 0px;
        }
        .el-table__header tr,
        .el-table__header th {
                padding: 0;
                height: 40px;
        }
        .tableTitle li {
                float: left;
                width: 31%;
                margin-right: 1%;
                text-align: center;
        }

        .adAggregations {
                float: left;
                margin-top: 5px;
        }

        .adAggregations i {
                color: #3e98fe;
        }

        .removeAggregations i {
                color: #ff4949;
                cursor: pointer;
        }

        .add {
                cursor: pointer;
        }

        .adAggregations .upload {
                margin-left: 10px;
                cursor: pointer;
                color: #67C23A;
        }

        .sign {
                color: red;
                padding: 0px;
                font-size: 8px;
                font-style: normal;
        }
        .w49 {
                width: 49%;
        }
        .fr{
                float: right;
        }
</style>
