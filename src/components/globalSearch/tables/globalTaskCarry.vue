<template>

  <section>
    <el-row class="btnClass">
      <div class="btn-left">
        <el-input placeholder="请输入执行任务名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
          <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
        </el-input>
        <el-date-picker
                v-model="dateValue"
                type="daterange"
                @change="handledateValue"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
        <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
      </div>
    </el-row>

    <el-row class="rf-swap">
      <el-table
      		  @sort-change="getOrder"
              :data="table.content"
              v-loading = "loading"
              id="bm-com-global-search-table-table"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              height="calc(100vh - 200px)">
        <el-table-column
                prop="id"
                label="ID"
                width="50"
                v-if="show">
        </el-table-column>
        <el-table-column
                prop="modelName"
                label="模板"
                sortable="custom"
                >

          <template slot-scope="scope">
            <span class="seeName">{{ scope.row.modelName }}</span>
          </template>

        </el-table-column>
        <el-table-column
                prop="name"
                label="执行任务名"
                sortable="custom"
                >
          <template slot-scope="scope">
            <span class="seeName">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="flowStatus"
                label="任务状态"
                sortable="custom"
                width="100"
                >
        </el-table-column>
        <el-table-column
                label="执行结果"
                width="100"                
                :formatter="resultFormatter">
        </el-table-column>
        <el-table-column
                prop="processDataId"
                label="输入数据"
                sortable="custom"
                >
        </el-table-column>
        <el-table-column
                prop="sliceTime"
                label="数据时间片"
                sortable="custom"
                >
        </el-table-column>
        <el-table-column
                prop="executionId"
                label="执行任务ID"
                sortable="custom"
                >
          <template slot-scope="scope">
            <span class="seeName">{{ scope.row.executionId }}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="qualityRank"
                label="数据质量等级"
                sortable="custom"
                width="150"
                >
        </el-table-column>
        <el-table-column
                prop="badRatio"
                label="坏数据占比"
                sortable="custom"
                width="120"
                >
        </el-table-column>
        <el-table-column
                prop="lastModifiedTime"
                label="修改时间"
                sortable="custom"
                width="180"
                :formatter="dateFormat"
                >
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[8, 16, 50, 100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="table.totalElements">
      </el-pagination>
    </el-row>

			<router-view></router-view>
  </section>
</template>
<script>
    import { zdafgetDate,zdafdelTbaleDate } from '@api';

    import {queryObject,createParameter} from '@function/queryParameter';
    //var parameter={filter:"",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};
    var parameter = {
  "fieldList": [],
  "sortObject": {
    "field": "lastModifiedTime",
    "orderDirection": "DESC"
  },
  "offset": 0,
  "limit": 8
}
    export default {
        data() {
            return {
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime:false,
                searchInput:'',
                show:false,
                currentPage:1,
                pagesize:8,
                parameter: '',
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                loading: true
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                this.parameter = createParameter('name',query,'LIKE').Offset(0).Limit(this.pagesize).Build();
                this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput);
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            
            buildParameters:function(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
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
            
            
            
            handledateValue:function (val) {
                /*var startTime=this.$refs.startTime.innerText.replace("\"","").replace("\"","");
                var endTime=this.$refs.endTime.innerText.replace("\"","").replace("\"","");
                var dateTime=startTime.replace(".000","")+" TO "+endTime.replace(".000","");
                var parameter={filter:"lastModifiedTime=["+dateTime+"]",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};*/
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.currentPage=1;
               var parameter = this.buildParameters();
              
                this.listTable(parameter);
            },

            //根据任务状态过滤执行结果
            resultFormatter:function(row, column){
                let resultName = row.flowStatus;
                switch (resultName){
                    case "FAILED":
                        return "";
                        break;
                    case  "SUCCEEDED":
                        return "结果";
                        break;
                }
            },
            //table list
            listTable:function listTable(parameter){
                // GET /someUrl
                zdafgetDate(parameter).then(data => {
                    this.loading = false
                    this.table = data;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )

            },
            //查询
            searchTable:function searchTable(){
            		this.currentPage=1;
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
            		this.currentPage=1;
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
           //列表排序
			getOrder(column) {
                var that = this
				if (column.order === 'ascending') { 
					this.orderDirection = 'ASC'
				} else {
					this.orderDirection = 'DESC'
                }
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
								var parameter = this.buildParameters();
								that.listTable(parameter);
			}       
        },
        mounted() {
            /*if(this.$route.query.queryWord != undefined){
                this.searchInput = this.$route.query.queryWord;
                this.searchTable();
            }else{
                this.listTable(parameter)
            }*/
           this.listTable(parameter);
        }
    };

</script>

<style scoped>
  .con-module .el-row{
    float: left;
    width: 100%;
  }
  .con-module .el-row .el-button i{
    font-size: 13px;
  }

  .el-table{
    float: left;
  }

	.seeName{
    margin-left: 5px;
     color: #333;
	cursor: text;
  }
  
  .btn-left{
    padding-left: 150px;
  }
  .input-with-search{
  	margin-left: 60px;
  }
</style>