<!--  design 设置 参数声明 组件  -->
<template>
    <div>
        <el-dialog v-dialog-drag  title="自定义组合节点" id="designSetDialog" :close-on-click-modal="false" :visible.sync="designNode.nodeVisible"  @click="designSetNone" :modal-append-to-body="false">
            <div class="dtTableUp" name="bm-components-customContent-search-data">
                <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchTable" class="input-with-search diSearch">
                    <el-button  name="bm-components-dataSetInq-dataInquire-search-table-data" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <el-date-picker
                        name="bm-components-dataSetInq-dataInquire-search-date-data"
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="mt20">
                <el-table
                    ref="multipleTable"
                    :data="json1.content"
                    tooltip-effect="dark"
                    height="400"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width = "100px"
                    >
                    </el-table-column>
                    <el-table-column
                    label="名称"
                    >
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column
                    label="ID"
                    >
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column
                    label="flowtype"
                    >
                    <template slot-scope="scope">{{ scope.row.flowType }}</template>
                    </el-table-column>

                    <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button  type="primary" @click="deleteStep(scope.row.id)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="height: 50px;">
                <el-pagination
                    @size-change = "handleSizeChange"
                    @current-change = "handleCurrentChange"
                    :current-page = "currentPage"
                    :page-sizes = "[8, 10, 20, 50, 100]"
                    :page-size = "8"
                    layout = "total, sizes, prev, pager, next, jumper"
                    :total = "json1.totalElements">   
                </el-pagination>
            </div>
            <div slot="footer">
                <el-button @click = "desSetSubmit" type="primary" >确定</el-button>
                <el-button @click = "designSetNone">取消</el-button>
            </div>
    </el-dialog>

    </div>
</template>

<script>
    //数组去重
    import customPackage from "@customPackage/customPackage.vue";
    import {deepCopy,transformArr} from "@function/comFunction";
    import { queryObject,createParameter } from "@function/queryParameter"
    // import {steps, links, json, json1} from "@components/mock/mockSteps"
    import {queryDefinStep, deleteDefinStep,defineList} from "@api"

    
    export default {
        components: {customPackage},
        data() {
            return {
                 stepsData: [],
                 multipleSelection: [],       
                 changeStepsData:{},        //选中step组合json
                 json1: [],                 //表格列表
                 searchInput:'',            //搜索内容
                 dateValue: [],             //时间选择
                 currentPage: 1,             //当前页
                 pagesize: 8,
                 startTime: false,
                 endTime:false,
                 prop:'lastModifiedTime',
                 orderDirection:'DESC',
                 parameter:'',
                 type: sessionStorage.getItem("type")

            }
        },
        props:['designNode'],
        watch: {
            designNode:{                                // 监听父级传的来的整体的data
              handler:function(newValue){        
                  var _this = this;
                  var val = JSON.parse(JSON.stringify(newValue))      //深度拷贝一份传过来的值
                  if(val.nodeVisible == true){
                      var parameter = this.buildParameters()
                      parameter.fieldList= []
                      this.listTable(parameter)
                 }
              },
              deep:true
            },
        },
        methods: {
            designSetNone(){                  // 点击取消/关闭按钮
                this.designNode.nodeVisible = false;
            },
            desSetSubmit() {                //确认
                this.designNode.nodeVisible = false;
                if(typeof this.designNodeData !== 'undefined'){
                    this.$emit('designNodeload', this.designNodeData)
                } 
            },
            deleteStep(val){
                var IdArr = []
                var _this = this
                IdArr.push(val)
                deleteDefinStep(IdArr).then( (data)=>{
                    var parameter=queryObject()
                      defineList(parameter, 'dataflow').then( (data) => {
                          _this.json1 = data
                      })
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                var _this = this
                if(val.length===1){
                    this.designNodeData = val
                }else {
                    _this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
                    return false;
                }
                this.designNodeData = val
            },
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]];
                }
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            //分页
            handleSizeChange(val) {
                this.pagesize = val;
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            buildParameters(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('owner',sessionStorage.getItem('userId'),"EQUAL").Limit(limit).Offset(offset).Build();
                // var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
                }
                if(this.dateValue){
                    if(this.dateValue!= '' && this.dateValue.length != 0 ){
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }    
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            //查询
           searchTable(){
            	this.currentPage = 1;
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //获取表格信息
            listTable(parameter){
                var _this = this
                defineList(parameter).then( (data) => {
                    _this.json1 = data
                })
            }
        },
        mounted(){
            
        }
           
    }
</script>

<style scoped lang="scss">
    .tableTitle,.setUi,.parameterTableTitle{
        float: left;
        width: 100%;
        padding:0px;
    }
    .setUi .divUl{
        float: left;
        width: 100%;
        margin:10px 0px 0px 0px;
    }
    .setUi .divUl .divLi{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 7%;
    }
    .setUi .divUl .parameterLi{
        float: left;
        position: relative;
        width: 20%;
        margin-right: 5%;
    }
    .nameLi{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 1%;
    }
    .tableTitle li{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 5%;
        text-align: center;
        color: #333333;
        font-weight: bold;
    }
    .parLi{
        float: left;
        position: relative;
        width: 23%;
        margin-right: 1%;
    }
    .parameterTableTitle li{
        float: left;
        position: relative;
        width: 22%;
        margin-right: 3%;
        text-align: center;
        color: #333333;
        font-weight: bold;
    }
    .quote{
        width: 100%;
        position: relative;
    }
    .quote .quotePos{
        float: left;
        width: 100%;
        position: relative;
    }
    .quoteBtn{
        position: absolute;
        top: 10px;
        right: -40px;
    }
    .quoteBtn .i{
        position: static;
        float: left;
        margin-left: 5px;
        font-size: 15px;
    }
    .divLi i{
        position: absolute;
        top: 10px;
        right: -20px;
        color: #ff4e4e;
        font-weight: bold;
        cursor: pointer;
    }
    .addQuote{
        position: absolute;
        right: 0px;
        bottom: 34px;
    }
    .addQuote i{
        color: #3e98fe;
        font-size: 15px;
    }
    .addUl{
        float: left;
        width: 100%;
        margin: 10px 0px 0px 0px;
        color: #3d464d;
        font-size: 18px;
    }
    .addUl i{
        cursor: pointer;
    }
    .addUl i:hover{
        color: #0070e0;
    }
    .removeUl i{
        position: absolute;
        top: 10px;
        right: -20px;
        color: #ff4e4e;
        font-weight: bold;
        cursor: pointer;
    }
    .addQuote2{
        position: absolute;
        right: -20px;
        bottom: 8px;
    }
    .addQuote2 i{
        color: #3e98fe;
        font-size: 15px;
    }
    h3{
        font-size: 14px;
        color: #000000;
    }
    .status-class {
        font-size: 12px;
        font-style: normal;
        color: red;
    }

    .dependencies h3{
        height: 30px;
        line-height: 30px;
    }
    .dependencies .dedivClass{
        margin: 10px 0px 0px 0px;
    }
    .dependencies .el-input-group{
        width: calc(100% - 30px);

    }

    .dependencies .dedivClass .remove{
        float: right;
        margin: 5px 0px 0px 0px;
    }
    .dtTableUp {
        height: 40px;
    }
    .mt20 {
        margin-top: 20px;
    }
    .fr {
        float: right;
    }
    .deleteBtn {
            margin-top: 8px;
            margin-right: 100px;
    }
</style>