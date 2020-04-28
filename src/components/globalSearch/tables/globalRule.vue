<template>

  <section>
    <el-row class="btnClass">
      <div class="btn-left">
        <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
          <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
        </el-input>
        <el-date-picker
                v-model="dateValue"
                type="daterange"
                value-format="timestamp"
                @change="handledateValue"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
        <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
      </div>
    </el-row>

    <el-row class="tac rf-swap">
      <el-col>

        <el-table
        		@sort-change="getOrder"
                v-loading = "loading"
                id="bm-com-global-search-globalRule-table"
                :data="table.content"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                height="calc(100vh - 200px)">
          <el-table-column
                  
                  width="40">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="名称"
                  sortable="custom"
                  >
            <template slot-scope="scope">
              <span class="seeName">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="buildType"
                  label="类型"
                  sortable="custom"
                  width="80"
                  >
          </el-table-column>
          <el-table-column
                  prop="customType"
                  label="自定义类型"
                  sortable="custom"
                  width="150"
                  >
          </el-table-column>
          <el-table-column
                  prop="customValue"
                  label="自定义数据/表达式"
                  sortable="custom"
                  >
          </el-table-column>
          <el-table-column
                  prop="owner"
                  label="所有人"
                  sortable="custom"
                  width="100"
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
      </el-col>
    </el-row>

    <router-view></router-view>

  </section>
</template>
<script>

    import ruleNav from "@analysisRulesTree/ruleNav.js";
    import ruleTree from "@analysisRulesTree/ruleTree";
    import { argetDate} from '@api';
    import {queryObject, createParameter} from "@function/queryParameter";
    var parameter=queryObject();

    export default {
        components: {
            ruleNav,
            ruleTree
        },
        data() {
            return {
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime:false,
                searchInput:'',
                currentPage:1,
                pagesize:8,
                prop: 'lastModifiedTime',
                orderDirection:'DESC',
                loading: true
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('name',query,'LIKE').Offset(0).Limit(this.pagesize).Build();
                this.listTable(parameter)

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
                argetDate(parameter).then(data => {
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
        watch:{
            "$route":function () {
                this.listTable(parameter)
            }
        },
        mounted() {
            var that = this;
            that.listTable(parameter);
            
                     
        }
    };

</script>

<style lang="scss" scoped>
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

  .tpAddrl{
    color: #FFFFFF;
    margin-right: 10px;
    text-decoration: none;
  }

  .seeName{
    margin-left: 5px;
    color: #333;
	cursor: text;
  }

  /*.seeName:hover{
    text-decoration: underline;
  }*/
  .btn-left{
    padding-left: 125px;
  }
.input-with-search{
	margin-left: 85px;
}

</style>