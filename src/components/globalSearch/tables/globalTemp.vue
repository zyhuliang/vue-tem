<template>
	<section>
		<el-row class="btnClass">
	        <div class="btn-left">
	            <el-input placeholder="请输入分析模板名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
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
                  :data="table.content"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @sort-change="getOrder"
                  v-loading="loading"
                  id="bm-com-global-search-global-temp-dialog-table"
                  height="calc(100vh - 200px)">
             <!-- <el-table-column
                      type="selection"
                      width="40">
              </el-table-column>-->
              <el-table-column
                      prop="id"
                      label="主键"
                      width="50"
                      v-if="show">
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="分析模板"
                      sortable="custom"
                      >
                  <template slot-scope="scope">
                      <el-tooltip placement="top" effect="light">
                          <div slot="content">{{scope.row.id}}</div>
                          <i class="el-icon-info"></i>
                      </el-tooltip>
                      <span class="seeName">{{ scope.row.name }}</span>
                  </template>
              </el-table-column>
              <el-table-column
                      label="规则"
                      width="100">
                  <template slot-scope="scope">
                      <span class="editRules"  sortable="custom">编辑规则</span>
                  </template>
              </el-table-column>
              <el-table-column
                      label="相关任务"
                      width="100">
                  <template slot-scope="scope">
                      <span class="relatedTasks">任务</span>
                  </template>
              </el-table-column>
              <el-table-column
                      prop="processDataId"
                      label="数据（Dataset）"
                      sortable="custom"
                      >
              </el-table-column>
              <el-table-column
                      prop="preProcessFlowName"
                      label="预处理流程"
                      sortable="custom"
                      >
              </el-table-column>
              <el-table-column
                      prop="creator"
                      label="所有人"
                      width="100"
                      sortable="custom"
                      >
              </el-table-column>
              <el-table-column
                      prop="lastModifiedTime"
                      label="修改时间"
                      width="180"
                      :formatter="dateFormat"
                      sortable="custom"
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
	</section>
</template>

<script>
	import {atgetDate} from '@api'
	import {queryObject,createParameter} from '@function/queryParameter'
	 var parameter = queryObject();
    export default {
        components: {},
        data() {
            return {
                table:[],
                multipleSelection: [],
                dialogFormVisible: false,
                cycleClick: false,
                flag:'',
                modelId:[],
                modelName:'',                                                                          
                formLabelWidth: '125px',
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
                loading: true,
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
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.currentPage=1;
               var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //table list
            listTable:function listTable(parameter){
                // GET /someUrl
                this.loading = true,
                atgetDate(parameter).then(data => {
                    this.loading = false;
                    //console.log(data.content[0].createTime);
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
            //实现查询功能
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
            this.listTable(parameter);
        }
    };
</script>

<style lang="scss" scoped>
.input-with-search{
	margin-left:210px;
}

</style>